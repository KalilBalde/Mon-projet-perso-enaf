export const FAVORITES_CHANGED_EVENT = "enafim:favorites-changed";

const FAVORITES_STORAGE_KEY = "enafim.favorite-listing-ids";

export function getFavoriteIds(): number[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const storedValue = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
    const parsedValue: unknown = storedValue ? JSON.parse(storedValue) : [];

    return Array.isArray(parsedValue)
      ? parsedValue.filter(
          (listingId): listingId is number =>
            Number.isSafeInteger(listingId) && listingId > 0,
        )
      : [];
  } catch {
    return [];
  }
}

export function toggleFavorite(listingId: number): boolean {
  const favoriteIds = new Set(getFavoriteIds());

  if (favoriteIds.has(listingId)) {
    favoriteIds.delete(listingId);
  } else {
    favoriteIds.add(listingId);
  }

  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(
        FAVORITES_STORAGE_KEY,
        JSON.stringify([...favoriteIds]),
      );
    } catch {}

    window.dispatchEvent(new Event(FAVORITES_CHANGED_EVENT));
  }

  return favoriteIds.has(listingId);
}