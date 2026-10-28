import { LISTINGS } from "../../data/listings";
import type { Listing } from "../../types";

export interface ListingFilters {
  type?: string;
  quartier?: string;
  budgetMax?: number;
  page?: number;
  limit?: number;
}

export interface ListingRepository {
  findAll(filters?: ListingFilters): Listing[];
  findById(id: number): Listing | undefined;
  findBySlug(slug: string): Listing | undefined;
  getSlug(listing: Listing): string;
}

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function createListingSlug(listing: Listing): string {
  const titleSlug = normalizeText(listing.title);
  const neighborhoodSlug = normalizeText(listing.quartier);

  return `${titleSlug}-${neighborhoodSlug}-${listing.id}`;
}

function matchesFilters(
  listing: Listing,
  filters: ListingFilters,
): boolean {
  const matchesType =
    !filters.type ||
    filters.type === "Tous types" ||
    listing.type === filters.type;

  const matchesNeighborhood =
    !filters.quartier ||
    filters.quartier === "Tous les quartiers" ||
    listing.quartier === filters.quartier;

  const matchesBudget =
    !filters.budgetMax || listing.price <= filters.budgetMax;

  return matchesType && matchesNeighborhood && matchesBudget;
}

function paginateListings(
  listings: Listing[],
  page = 1,
  limit = listings.length,
): Listing[] {
  const safePage = Math.max(1, page);
  const safeLimit = Math.max(1, limit);
  const startIndex = (safePage - 1) * safeLimit;

  return listings.slice(startIndex, startIndex + safeLimit);
}

export const listingRepository: ListingRepository = {
  findAll(filters = {}) {
    const filteredListings = LISTINGS.filter((listing) =>
      matchesFilters(listing, filters),
    );

    const sortedListings = [...filteredListings].sort(
      (a, b) => (b.priority ?? 0) - (a.priority ?? 0),
    );

    return paginateListings(
      sortedListings,
      filters.page,
      filters.limit,
    );
  },

  findById(id) {
    return LISTINGS.find((listing) => listing.id === id);
  },

  findBySlug(slug) {
    return LISTINGS.find(
      (listing) => createListingSlug(listing) === slug,
    );
  },

  getSlug(listing) {
    return createListingSlug(listing);
  },
};