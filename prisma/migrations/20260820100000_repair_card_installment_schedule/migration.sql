-- Existing installment schedules were previously projected from the date they
-- were registered in WhatSpent. Rebuild only those schedules that do not start
-- in the statement month calculated from the original purchase date.
DO $$
DECLARE
  purchase_record RECORD;
  existing_first_due_month TIMESTAMP;
  purchase_statement_month TIMESTAMP;
  expected_first_due_month TIMESTAMP;
  starting_installment INTEGER;
  effective_installment INTEGER;
  installment_value DOUBLE PRECISION;
BEGIN
  FOR purchase_record IN
    SELECT
      purchase."id",
      purchase."purchaseDate",
      purchase."installments",
      purchase."currentInstallment",
      purchase."installmentAmount",
      purchase."totalAmount",
      card."closingDay"
    FROM "CardPurchase" AS purchase
    INNER JOIN "CreditCard" AS card ON card."id" = purchase."cardId"
    WHERE purchase."installments" > 1
  LOOP
    starting_installment := LEAST(
      GREATEST(COALESCE(purchase_record."currentInstallment", 1), 1),
      purchase_record."installments"
    );

    purchase_statement_month := date_trunc('month', purchase_record."purchaseDate") +
      CASE
        WHEN EXTRACT(DAY FROM purchase_record."purchaseDate") > purchase_record."closingDay"
          THEN INTERVAL '1 month'
        ELSE INTERVAL '0 months'
      END;
    expected_first_due_month := purchase_statement_month +
      ((starting_installment - 1) * INTERVAL '1 month');

    SELECT date_trunc('month', installment."dueMonth")
      INTO existing_first_due_month
    FROM "CardInstallment" AS installment
    WHERE installment."purchaseId" = purchase_record."id"
    ORDER BY installment."number" ASC
    LIMIT 1;

    IF existing_first_due_month IS NULL OR existing_first_due_month <> expected_first_due_month THEN
      effective_installment := GREATEST(
        starting_installment,
        LEAST(
          purchase_record."installments",
          GREATEST(
            1,
            ((EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER - EXTRACT(YEAR FROM purchase_record."purchaseDate")::INTEGER) * 12) +
              EXTRACT(MONTH FROM CURRENT_DATE)::INTEGER - EXTRACT(MONTH FROM purchase_record."purchaseDate")::INTEGER + 1
          )
        )
      );
      installment_value := COALESCE(
        purchase_record."installmentAmount",
        ROUND((purchase_record."totalAmount" / purchase_record."installments")::NUMERIC, 2)::DOUBLE PRECISION
      );

      DELETE FROM "CardInstallment"
      WHERE "purchaseId" = purchase_record."id";

      INSERT INTO "CardInstallment" ("id", "purchaseId", "number", "dueMonth", "amount")
      SELECT
        'repair_' || md5(purchase_record."id" || ':' || installment_number::TEXT),
        purchase_record."id",
        installment_number,
        purchase_statement_month + ((installment_number - 1) * INTERVAL '1 month'),
        installment_value
      FROM generate_series(effective_installment, purchase_record."installments") AS installment_number;

      UPDATE "CardPurchase"
      SET
        "currentInstallment" = effective_installment,
        "installmentAmount" = installment_value,
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE "id" = purchase_record."id";
    END IF;
  END LOOP;
END $$;
