// ============================================================
// FILE: src/types/index.ts
// ============================================================

export interface Listing {
  id: number;
  title: string;
  quartier: string;
  price: number;
  surface: number;
  rooms: number;
  bathrooms: number;
  type: string;
  priority?: number;
  status?: "sold" | "rented";
  image: string;
  images?: string[];
  description?: string;
  features?: string[];
  isNew: boolean;
  isFavorite: boolean;
}

export interface SearchFilters {
  type: string;
  quartier: string;
  budgetMax: string;
}