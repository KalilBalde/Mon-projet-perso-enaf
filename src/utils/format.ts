/* ─── UTILS : formatage ─── */

import type { ListingKitchen } from "../types";

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("fr-GN").format(price) + " GNF";
}

export function formatListingPrice(
  price: number | null,
  offerType?: "rent" | "sale" | null,
): string {
  if (price === null) {
    return "Prix à préciser";
  }

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

export function formatListingKitchen(
  kitchen: ListingKitchen | null | undefined,
): string | null {
  if (kitchen === "internal") return "Interne";
  if (kitchen === "external") return "Externe";
  if (kitchen === "both") return "Interne et externe";
  return null;
}
