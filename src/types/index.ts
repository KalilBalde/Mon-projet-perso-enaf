/* ─── TYPES ─── */

export interface Listing {
  id: number;
  title: string;
  quartier: string;
  price: number;
  surface: number;
  rooms: number;
  bathrooms: number;
  type: string;
  image: string;
  isNew: boolean;
  isFavorite: boolean;
}

export interface SearchFilters {
  type: string;
  quartier: string;
  budgetMax: string;
}
