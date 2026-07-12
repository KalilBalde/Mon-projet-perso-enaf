/* ─── UTILS : formatage ─── */

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("fr-GN").format(price) + " GNF";
}
