/** Staffel: each older generation −5%, capped at −20%. */
export function getDiscountPercent(collectionAge: number): number {
  return Math.min(20, Math.max(0, collectionAge) * 5);
}

export function getEffectivePrice(basePrice: number, collectionAge: number): number {
  const discount = getDiscountPercent(collectionAge);
  return Math.round(basePrice * (1 - discount / 100) * 100) / 100;
}

export function formatEuro(amount: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}
