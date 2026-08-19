# Credit Card Purchase Controls Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make credit-card purchases accurate and controllable by supporting cash or installment purchases, storing the true installment amount and progress, excluding paid historical installments from invoices, and allowing individual purchases to be edited or deleted without affecting the card.

**Architecture:** Keep `CardPurchase` as the immutable purchase-history record and `Transaction` as the full financial impact of the purchase. Persist the installment amount and selected current installment on each new purchase, and generate `CardInstallment` rows only for the current and future installments that can still appear on statements. Centralize currency-safe calculation and progression logic in library helpers; the API validates and persists that normalized input, while the workspace offers explicit cash/installment controls and purchase-level actions.

**Tech Stack:** Next.js 15 App Router, React client components, TypeScript, Prisma/PostgreSQL, Vitest, Tailwind CSS, Lucide React.

## Global Constraints

- Preserve every existing card and purchase. The migration adds nullable columns only; it must not delete or rewrite current records.
- Cash purchases always become `1/1`. Installment purchases accept a per-installment amount, a total count from 1 to 48, and a current installment number from 1 through the total.
- Compute the recorded purchase total as `perInstallmentAmount × totalInstallments`, in cents. Never derive the monthly amount by dividing the entered monthly value.
- Generate statement projections only from the selected current installment onward. Historical paid installments remain visible as compact purchase history but must not create old invoices.
- Editing or deleting a purchase affects only that purchase and its linked financial transaction. Archiving a card remains a separate, explicit action with confirmation.
- Keep all changes scoped to the credit-card flow; do not stage or modify unrelated worktree changes.

---

## File Structure

```text
prisma/schema.prisma
prisma/migrations/20260819143000_refine_card_purchase_installments/migration.sql
src/lib/credit-cards.ts
src/lib/credit-cards.test.ts
src/lib/card-purchase-input.ts
src/lib/card-purchase-input.test.ts
src/app/api/financial/card-purchases/route.ts
src/components/financial/credit-cards-workspace.tsx
```

## Task 1: Add durable purchase-progress fields without touching existing records

**Files:**
- Modify: `prisma/schema.prisma`
- Create: `prisma/migrations/20260819143000_refine_card_purchase_installments/migration.sql`

- [ ] **Step 1: Extend `CardPurchase` with nullable fields for the value of each installment and the active installment number.**

  Add these fields next to the existing `installments` field:

  ```prisma
  installmentAmount Float?
  currentInstallment Int?
  ```

  Existing rows remain valid because both fields are nullable. New purchase creation and updates will always fill them.

- [ ] **Step 2: Add a non-destructive SQL migration.**

  Create `prisma/migrations/20260819143000_refine_card_purchase_installments/migration.sql` with:

  ```sql
  ALTER TABLE "CardPurchase" ADD COLUMN "installmentAmount" DOUBLE PRECISION;
  ALTER TABLE "CardPurchase" ADD COLUMN "currentInstallment" INTEGER;
  ```

- [ ] **Step 3: Validate the schema.**

  Run: `npm run db:validate`

  Expected: Prisma validates successfully and existing migrations are unchanged.

## Task 2: Define and test installment calculation semantics

**Files:**
- Modify: `src/lib/credit-cards.ts`
- Create: `src/lib/credit-cards.test.ts`

- [ ] **Step 1: Write failing unit tests for the calculation rules.**

  Cover these cases in `src/lib/credit-cards.test.ts`:

  ```ts
  it("keeps a cash purchase as installment 1/1", () => {
    expect(calculatePurchaseTotal(90, 1)).toBe(90);
  });

  it("uses the entered installment value instead of dividing it again", () => {
    expect(calculatePurchaseTotal(272.4, 21)).toBe(5720.4);
  });

  it("suggests installment 20 for a January 2025 purchase viewed in August 2026", () => {
    expect(suggestCurrentInstallment(new Date("2025-01-22T12:00:00.000Z"), 21, new Date("2026-08-19T12:00:00.000Z"))).toBe(20);
  });

  it("creates only the remaining installments for statement projection", () => {
    const schedule = buildPendingInstallments({
      installmentAmount: 272.4,
      installments: 21,
      currentInstallment: 20,
      purchaseDate: new Date("2025-01-22T12:00:00.000Z"),
      closingDay: 10,
      referenceDate: new Date("2026-08-19T12:00:00.000Z"),
    });
    expect(schedule.map((item) => item.number)).toEqual([20, 21]);
    expect(schedule.map((item) => item.amount)).toEqual([272.4, 272.4]);
    expect(schedule.map((item) => monthKey(item.dueMonth))).toEqual(["2026-09", "2026-10"]);
  });
  ```

- [ ] **Step 2: Replace the current total-splitting helper with helpers that preserve cents and model remaining projections.**

  In `src/lib/credit-cards.ts`, keep `monthKey`, `dateFromMonthKey`, `statementMonthForPurchase`, and `statementDueDate`. Replace `buildInstallments` with these exported contracts:

  ```ts
  export type PendingInstallmentInput = {
    installmentAmount: number;
    installments: number;
    currentInstallment: number;
    purchaseDate: Date;
    closingDay: number;
    referenceDate?: Date;
  };

  export function calculatePurchaseTotal(installmentAmount: number, installments: number): number;
  export function suggestCurrentInstallment(purchaseDate: Date, installments: number, referenceDate?: Date): number;
  export function buildPendingInstallments(input: PendingInstallmentInput): InstallmentPlan[];
  ```

  Implementation rules:

  - Convert values to integer cents before multiplying and return a two-decimal number.
  - Clamp installment count to `1..48` and current installment to `1..count`.
  - `suggestCurrentInstallment` is the calendar-month distance from the purchase date to the reference date plus one, clamped to the purchase count.
  - The first pending installment uses the statement month for `referenceDate ?? new Date()` and the card closing day; each remaining number advances exactly one calendar month.
  - Every generated item has the same entered `installmentAmount`; do not distribute a remainder.

- [ ] **Step 3: Run the focused tests.**

  Run: `npx vitest run src/lib/credit-cards.test.ts`

  Expected: tests prove the `R$ 272,40 × 21 = R$ 5.720,40` case and only generate installments `20/21` and `21/21`.

## Task 3: Normalize card-purchase input before persistence

**Files:**
- Create: `src/lib/card-purchase-input.ts`
- Create: `src/lib/card-purchase-input.test.ts`

- [ ] **Step 1: Write failing tests for explicit cash and installment modes.**

  The test file must verify:

  - `CASH` normalizes to `installments: 1` and `currentInstallment: 1`.
  - `INSTALLMENT` accepts `amountPerInstallment: 272.4`, `installments: 21`, and `currentInstallment: 20`.
  - Values less than or equal to zero, counts outside `1..48`, and a current number outside `1..installments` return a useful validation error.

- [ ] **Step 2: Implement the normalized input contract.**

  Add this public type and parser in `src/lib/card-purchase-input.ts`:

  ```ts
  export type CardPurchaseMode = "CASH" | "INSTALLMENT";

  export type NormalizedCardPurchaseInput = {
    mode: CardPurchaseMode;
    amountPerInstallment: number;
    installments: number;
    currentInstallment: number;
  };

  export function normalizeCardPurchaseInput(input: Record<string, unknown>):
    | { value: NormalizedCardPurchaseInput }
    | { error: string };
  ```

  Use `amountPerInstallment` for both modes. For `CASH`, ignore sent counts and normalize them to `1/1`; for `INSTALLMENT`, require bounded integers for both values. Do not accept the legacy `amount` field for a new write.

- [ ] **Step 3: Run parser tests.**

  Run: `npx vitest run src/lib/card-purchase-input.test.ts`

  Expected: the API can rely on a single, well-formed input shape rather than guessing whether an amount is total or monthly.

## Task 4: Persist accurate schedules and add purchase update support

**Files:**
- Modify: `src/app/api/financial/card-purchases/route.ts`

- [ ] **Step 1: Update `POST` to use normalized input and pending-only installments.**

  Replace the `amount` and `buildInstallments` flow with:

  ```ts
  const normalized = normalizeCardPurchaseInput(body);
  if ("error" in normalized) {
    return NextResponse.json({ error: normalized.error }, { status: 400 });
  }

  const totalAmount = calculatePurchaseTotal(
    normalized.value.amountPerInstallment,
    normalized.value.installments,
  );
  const schedule = buildPendingInstallments({
    installmentAmount: normalized.value.amountPerInstallment,
    installments: normalized.value.installments,
    currentInstallment: normalized.value.currentInstallment,
    purchaseDate,
    closingDay: card.closingDay,
  });
  ```

  Persist `Transaction.amount = totalAmount`, and persist `CardPurchase.totalAmount`, `installments`, `installmentAmount`, and `currentInstallment`. Create only the `schedule` records returned by the helper.

- [ ] **Step 2: Add `PATCH` for an existing purchase.**

  Add `export async function PATCH(request: Request)`. It must:

  - Resolve the current user and financial context exactly as the existing handlers do.
  - Find the purchase by id only when the card belongs to the authenticated user in the active personal or family workspace.
  - Reuse the same normalized input and calculation helpers as `POST`.
  - In one Prisma transaction, update the linked `Transaction` description/category/date/total amount; delete only this purchase's `CardInstallment` rows; update the purchase fields; then create the newly generated current/future schedule.
  - Return the refreshed purchase with ordered `installmentsList` and `transaction`.

- [ ] **Step 3: Make deletion unmistakably purchase-scoped.**

  Keep the current `DELETE` endpoint's ownership checks, but return `{ success: true, purchaseId }` after deleting the linked purchase and transaction. Do not call any `CreditCard` delete/update operation from this handler.

- [ ] **Step 4: Verify API type checking and behavior.**

  Run: `npm run lint && npm run build`

  Expected: all route handlers compile, and no credit card is removed by a purchase deletion.

## Task 5: Build an explicit cash/installment purchase form

**Files:**
- Modify: `src/components/financial/credit-cards-workspace.tsx`

- [ ] **Step 1: Extend the local purchase type and form state.**

  Add nullable `installmentAmount` and `currentInstallment` to the `Purchase` type. Replace the ambiguous `amount` form field with:

  ```ts
  type PurchaseForm = {
    description: string;
    category: string;
    purchaseDate: string;
    mode: "CASH" | "INSTALLMENT";
    amountPerInstallment: string;
    installments: string;
    currentInstallment: string;
  };
  ```

  Track whether the user has manually changed `currentInstallment`, so the date/count suggestion does not overwrite an intentional correction.

- [ ] **Step 2: Add the two clear form choices.**

  In the create/edit modal, render an accessible segmented choice or radio group:

  - `À vista` shows the field label `Valor da compra`, fixes count and current number to `1/1`, and submits `mode: "CASH"`.
  - `Parcelada` shows `Valor de cada parcela`, `Quantidade de parcelas`, and `Parcela atual`. Display the live calculated total as `R$ {installmentAmount × installmentCount}` and show the progress as `{current}/{total}`.

  Set a default current number using `suggestCurrentInstallment` whenever the user changes the date or count, unless they have directly edited that field. Limit the count to 48 and current number to the selected count in the client before submission.

- [ ] **Step 3: Support opening the same modal for creation or editing.**

  Introduce `editingPurchase: Purchase | null` and an `openPurchaseForm(purchase?: Purchase)` helper. For legacy data, use this fallback when initializing the installment amount:

  ```ts
  const legacyInstallmentAmount = purchase.installmentAmount
    ?? Number((purchase.totalAmount / purchase.installments).toFixed(2));
  ```

  This gives the user a clear way to correct legacy purchases whose historical projections were wrong.

- [ ] **Step 4: Submit to `POST` or `PATCH` appropriately.**

  Change the create handler into one save handler that sends `mode`, `amountPerInstallment`, `installments`, and `currentInstallment`. Use `POST` for a new purchase and `PATCH` with the purchase id for an edit. Refresh the workspace after a successful write and show the exact API validation error when one occurs.

## Task 6: Add purchase-level edit/delete actions and separate card archiving

**Files:**
- Modify: `src/components/financial/credit-cards-workspace.tsx`

- [ ] **Step 1: Replace verbose installment schedules with compact, accurate history.**

  In every purchase row, derive the active number with:

  ```ts
  const currentNumber = purchase.currentInstallment
    ?? purchase.installmentsList[0]?.number
    ?? 1;
  ```

  Display `À vista · 1/1` for cash purchases. For installments, display a concise label such as `20/21 · R$ 272,40 por parcela · 2 restantes`. Do not print every historical paid installment as a long sentence.

- [ ] **Step 2: Add visible per-purchase actions.**

  Beside each purchase, add labeled `Editar` and `Excluir compra` controls. `Editar` opens the populated modal. `Excluir compra` asks for confirmation naming the purchase, calls `DELETE /api/financial/card-purchases?id=<purchaseId>&context=<context>`, and refreshes only the workspace data after success.

- [ ] **Step 3: Make card archiving separate and explicit.**

  Replace the unlabeled trash icon in the selected-card header with a text action `Arquivar cartão`. Confirm with copy stating that it archives the card, not an individual purchase. Keep `archiveCard` targeting only `/api/financial/cards`.

- [ ] **Step 4: Manually verify the critical workflow.**

  In the running app:

  1. Create an `À vista` purchase and confirm it shows `1/1`.
  2. Create a 21-installment purchase with `R$ 272,40`, purchase date `22/01/2025`, and current installment `20`; confirm the total is `R$ 5.720,40`, history shows `20/21`, and only current/future statements receive `R$ 272,40`.
  3. Edit the purchase to correct the current installment and confirm statements are regenerated only for the selected future range.
  4. Delete the purchase and confirm the card remains listed and active.
  5. Archive a card and confirm its distinct confirmation dialog appears.

## Task 7: Run the complete verification suite and document the migration behavior

**Files:**
- Modify: `README.md` only if it already documents credit-card behavior; otherwise no documentation change is necessary.

- [ ] **Step 1: Run focused unit tests.**

  Run: `npx vitest run src/lib/credit-cards.test.ts src/lib/card-purchase-input.test.ts`

  Expected: exact-cent totals, progress suggestion, and pending-only schedule logic pass.

- [ ] **Step 2: Run project checks.**

  Run: `npm run db:validate && npm run lint && npm run build`

  Expected: Prisma schema, ESLint, and the production build succeed.

- [ ] **Step 3: Inspect the migration and changed files before release.**

  Run: `git diff --check && git diff -- prisma/schema.prisma prisma/migrations/20260819143000_refine_card_purchase_installments/migration.sql src/lib/credit-cards.ts src/lib/card-purchase-input.ts src/app/api/financial/card-purchases/route.ts src/components/financial/credit-cards-workspace.tsx`

  Expected: only additive schema changes, focused purchase-flow code, and no unrelated dashboard changes.

## Acceptance Criteria

- A cash purchase is explicitly selectable, creates a `1/1` purchase, and uses its entered amount as both purchase total and installment value.
- An installment purchase accepts the per-installment amount, total count, and editable active number; `R$ 272,40 × 21` persists as `R$ 5.720,40`.
- For a January 2025 purchase entered at installment `20/21`, the app generates statement entries only for installments `20` and `21`, each for `R$ 272,40`.
- Existing cards and purchases are preserved. Legacy purchases can be opened and corrected through edit.
- Each purchase has edit/delete controls. Deleting a purchase never deletes or archives its card.
- Card archiving is a clearly labeled, separately confirmed action.
