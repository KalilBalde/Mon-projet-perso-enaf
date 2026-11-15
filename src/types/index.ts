// ============================================================
// FILE: src/types/index.ts
// ============================================================

export type ListingOfferType = "rent" | "sale";
export type ListingKitchen = "internal" | "external" | "both";
export type ListingCardBadge = "new" | "rented" | "sold" | "title_deed";

export interface Listing {
  id: number;
  title: string;
  quartier: string;
  price: number | null;
  offerType?: ListingOfferType | null;
  surface: number | null;
  bedrooms: number | null;
  livingRooms: number | null;
  showers: number | null;
  kitchen?: ListingKitchen | null;
  type: string;
  priority?: number;
  createdAt?: string;
  status?: "sold" | "rented";
  cardBadge?: ListingCardBadge | null;
  viewCount?: number;
  image: string | null;
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