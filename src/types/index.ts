// ============================================================
// FILE: src/types/index.ts
// ============================================================

export type ListingOfferType = "rent" | "sale";
export type ListingCardBadge = "new" | "rented" | "sold" | "title_deed";

export interface Listing {
  id: number;
  title: string;
  quartier: string;
  price: number;
  offerType?: ListingOfferType | null;
  surface: number;
  bedrooms: number;
  livingRooms: number;
  showers: number;
  type: string;
  priority?: number;
  status?: "sold" | "rented";
  cardBadge?: ListingCardBadge | null;
  viewCount?: number;
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