export type CreditCardReference = {
  id: string;
  name: string;
  issuer: string | null;
  lastFour: string | null;
  closingDay: number;
};

function normalizedReference(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase("pt-BR")
    .replace(/[^a-z0-9]/gu, "");
}

export function matchCreditCards(reference: string, cards: CreditCardReference[]) {
  const normalized = normalizedReference(reference);
  const lastFour = reference.match(/\d{4}/gu)?.at(-1) || null;

  if (lastFour) {
    return cards.filter((card) => card.lastFour === lastFour);
  }

  return cards.filter((card) => {
    const cardName = normalizedReference(card.name);
    const issuer = card.issuer ? normalizedReference(card.issuer) : "";
    return Boolean(
      (cardName && (normalized.includes(cardName) || cardName.includes(normalized))) ||
      (issuer && (normalized.includes(issuer) || issuer.includes(normalized))),
    );
  });
}
