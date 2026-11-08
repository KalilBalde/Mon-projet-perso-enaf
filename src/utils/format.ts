/* ─── UTILS : formatage ─── */

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("fr-GN").format(price) + " GNF";
}

export function formatListingPrice(
  price: number,
  offerType?: "rent" | "sale" | null,
): string {
  const units = [
    { value: 1_000_000_000, singular: "milliard", plural: "milliards" },
    { value: 1_000_000, singular: "million", plural: "millions" },
    { value: 1_000, singular: "mille", plural: "mille" },
  ];
  const unit = units.find(({ value }) => price >= value);

  if (!unit) {
    return `${formatPrice(price)}${offerType === "rent" ? "/mois" : ""}`;
  }

  const amount = price / unit.value;
  const formattedAmount = new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: 1,
  }).format(amount);
  const unitLabel = amount === 1 ? unit.singular : unit.plural;
  const priceLabel = `${formattedAmount} ${unitLabel} GNF`;

  return `${priceLabel}${offerType === "rent" ? "/mois" : ""}`;
}
