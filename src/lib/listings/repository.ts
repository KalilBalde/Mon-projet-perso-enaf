import type { Listing, ListingOfferType } from "../../types";

export interface ListingFilters {
  type?: string;
  quartier?: string;
  offerType?: ListingOfferType;
  kitchen?: "internal" | "external";
  budgetMin?: number;
  budgetMax?: number;
  surfaceMin?: number;
  surfaceMax?: number;
  bedroomsMin?: number;
  showersMin?: number;
  features?: string[];
  page?: number;
  limit?: number;
}

export interface ListingRepository {
  findAll(filters?: ListingFilters, additionalListings?: readonly Listing[]): Listing[];
  findById(id: number, additionalListings?: readonly Listing[]): Listing | undefined;
  findBySlug(slug: string, additionalListings?: readonly Listing[]): Listing | undefined;
  getSlug(listing: Listing): string;
}

function normalizeText(value: string | null | undefined): string {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getEditDistance(left: string, right: string): number {
  let previousRow = Array.from({ length: right.length + 1 }, (_, index) => index);

  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    const currentRow = [leftIndex];

    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      const substitutionCost = left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1;

      currentRow[rightIndex] = Math.min(
        currentRow[rightIndex - 1] + 1,
        previousRow[rightIndex] + 1,
        previousRow[rightIndex - 1] + substitutionCost,
      );
    }

    previousRow = currentRow;
  }

  return previousRow[right.length];
}

export function suggestNeighborhoods(
  query: string,
  neighborhoods: readonly string[],
  limit = 5,
): string[] {
  const normalizedQuery = normalizeText(query);

  if (normalizedQuery.length < 2) {
    return [];
  }

  const uniqueNeighborhoods = [...new Set(neighborhoods)];
  const normalized = uniqueNeighborhoods.map((name) => ({
    name,
    normalizedName: normalizeText(name),
  }));

  if (normalized.some(({ normalizedName }) => normalizedName === normalizedQuery)) {
    return [];
  }

  const partialMatches = normalized
    .filter(({ normalizedName }) => normalizedName.includes(normalizedQuery))
    .sort((a, b) => {
      const aStartsWith = a.normalizedName.startsWith(normalizedQuery);
      const bStartsWith = b.normalizedName.startsWith(normalizedQuery);
      return Number(bStartsWith) - Number(aStartsWith);
    });

  if (partialMatches.length > 0) {
    return partialMatches.slice(0, limit).map(({ name }) => name);
  }

  const maximumDistance = normalizedQuery.length < 5
    ? 1
    : normalizedQuery.length < 9
      ? 2
      : 3;

  return normalized
    .map(({ name, normalizedName }) => ({
      name,
      distance: getEditDistance(normalizedQuery, normalizedName),
    }))
    .filter(({ distance }) => distance <= maximumDistance)
    .sort((a, b) => a.distance - b.distance || a.name.localeCompare(b.name, "fr"))
    .slice(0, limit)
    .map(({ name }) => name);
}

function getNeighborhoodMatches(
  query: string,
  listings: readonly Listing[],
): Map<string, number> | null {
  const normalizedQuery = normalizeText(query);

  if (!normalizedQuery || normalizedQuery === "tous-les-quartiers") {
    return null;
  }

  const neighborhoods = [...new Set(
    listings.map((listing) => normalizeText(listing.quartier)),
  )];
  const directMatches = neighborhoods.filter((neighborhood) =>
    neighborhood.includes(normalizedQuery),
  );

  if (directMatches.length > 0) {
    return new Map(directMatches.map((neighborhood) => [neighborhood, 0]));
  }

  const maximumDistance = normalizedQuery.length < 5
    ? 1
    : normalizedQuery.length < 9
      ? 2
      : 3;
  const matches = new Map<string, number>();

  for (const neighborhood of neighborhoods) {
    const distance = getEditDistance(normalizedQuery, neighborhood);

    if (distance <= maximumDistance) {
      matches.set(neighborhood, distance);
    }
  }

  return matches;
}

function createListingSlug(listing: Listing): string {
  const titleSlug = normalizeText(listing.title);
  const neighborhoodSlug = normalizeText(listing.quartier);

  return `${titleSlug}-${neighborhoodSlug}-${listing.id}`;
}

function getCreatedAtTimestamp(listing: Listing): number {
  if (!listing.createdAt) {
    return 0;
  }

  const timestamp = Date.parse(listing.createdAt);
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function matchesFilters(
  listing: Listing,
  filters: ListingFilters,
  neighborhoodMatches: Map<string, number> | null,
): boolean {
  const normalizedType = normalizeText(filters.type ?? "");
  const normalizedListingNeighborhood = normalizeText(listing.quartier);
  const matchesType =
    !normalizedType ||
    normalizedType === "tous-types" ||
    normalizeText(listing.type) === normalizedType;

  const matchesNeighborhood =
    neighborhoodMatches === null ||
    neighborhoodMatches.has(normalizedListingNeighborhood);

  const hasBudgetFilter =
    filters.budgetMin !== undefined || filters.budgetMax !== undefined;
  const matchesBudget = !hasBudgetFilter || (
    listing.price !== null &&
    (filters.budgetMin === undefined || listing.price >= filters.budgetMin) &&
    (filters.budgetMax === undefined || listing.price <= filters.budgetMax)
  );
  const matchesOffer = !filters.offerType || listing.offerType === filters.offerType;
  const matchesKitchen = !filters.kitchen ||
    listing.kitchen === filters.kitchen ||
    listing.kitchen === "both";
  const hasSurfaceFilter =
    filters.surfaceMin !== undefined || filters.surfaceMax !== undefined;
  const matchesSurface = !hasSurfaceFilter || (
    listing.surface !== null &&
    (filters.surfaceMin === undefined || listing.surface >= filters.surfaceMin) &&
    (filters.surfaceMax === undefined || listing.surface <= filters.surfaceMax)
  );
  const matchesBedrooms =
    filters.bedroomsMin === undefined ||
    (listing.bedrooms !== null && listing.bedrooms >= filters.bedroomsMin);
  const matchesShowers =
    filters.showersMin === undefined ||
    (listing.showers !== null && listing.showers >= filters.showersMin);
  const matchesFeatures =
    !filters.features?.length ||
    filters.features.every((feature) => listing.features?.includes(feature));

  return matchesType && matchesNeighborhood && matchesOffer && matchesKitchen && matchesBudget &&
    matchesSurface && matchesBedrooms && matchesShowers && matchesFeatures;
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
  findAll(filters = {}, additionalListings = []) {
    const neighborhoodMatches = getNeighborhoodMatches(
      filters.quartier ?? "",
      additionalListings,
    );
    const filteredListings = additionalListings.filter((listing) =>
      matchesFilters(listing, filters, neighborhoodMatches),
    );

    const sortedListings = [...filteredListings].sort((a, b) => {
      const priorityDifference = (b.priority ?? 0) - (a.priority ?? 0);
      const creationTimeDifference =
        getCreatedAtTimestamp(b) - getCreatedAtTimestamp(a);
      const neighborhoodDistance = (neighborhoodMatches?.get(
        normalizeText(a.quartier),
      ) ?? 0) - (neighborhoodMatches?.get(normalizeText(b.quartier)) ?? 0);

      return priorityDifference || creationTimeDifference || b.id - a.id || neighborhoodDistance;
    });

    return paginateListings(
      sortedListings,
      filters.page,
      filters.limit,
    );
  },

  findById(id, additionalListings = []) {
    return additionalListings.find((listing) => listing.id === id);
  },

  findBySlug(slug, additionalListings = []) {
    return additionalListings.find(
      (listing) => createListingSlug(listing) === slug,
    );
  },

  getSlug(listing) {
    return createListingSlug(listing);
  },
};