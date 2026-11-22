import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { UserRole } from "../auth/permissions";
import type { Listing, ListingCardBadge, ListingKitchen, ListingOfferType } from "../../types";

export type ListingDraft = {
  title: string;
  quartier: string;
  price: number | null;
  offerType: ListingOfferType | null;
  cardBadge: ListingCardBadge | null;
  surface: number | null;
  bedrooms: number | null;
  livingRooms: number | null;
  showers: number | null;
  kitchen: ListingKitchen | null;
  type: string;
  priority?: number;
  image: string | null;
  additionalImages?: string[];
  description: string;
  features: string[];
};

export type ListingSubmission = Listing & {
  moderation_status: "pending" | "published" | "rejected";
  created_at: string;
};

interface DatabaseListing {
  id: number | string;
  reference_id?: string | null;
  title: string | null;
  quartier: string | null;
  price: number | null;
  offer_type: ListingOfferType | null;
  surface: number | null;
  bedrooms: number | null;
  living_rooms: number | null;
  showers: number | null;
  kitchen: ListingKitchen | null;
  type: string | null;
  priority: number;
  status: "sold" | "rented" | null;
  card_badge?: ListingCardBadge | null;
  view_count?: number | null;
  image: string | null;
  images: string[] | null;
  description: string | null;
  features: string[] | null;
  is_new: boolean;
  moderation_status: "pending" | "published" | "rejected";
  created_at: string;
}

interface LegacyDatabaseListing extends Omit<
  DatabaseListing,
  "offer_type" | "bedrooms" | "living_rooms" | "showers"
  | "kitchen"
> {
  rooms: number | null;
  bathrooms: number | null;
}

type ListingReadResponse = {
  data: unknown[] | null;
  error: { code: string; message?: string } | null;
};

type ListingReadQuery = (columns: string) => PromiseLike<ListingReadResponse>;

const LISTING_COLUMNS =
  "id, title, quartier, price, offer_type, card_badge, surface, bedrooms, living_rooms, showers, kitchen, type, priority, status, image, images, description, features, is_new, moderation_status, created_at, reference_id";
const LISTING_COLUMNS_WITHOUT_CARD_BADGE =
  "id, title, quartier, price, offer_type, surface, bedrooms, living_rooms, showers, kitchen, type, priority, status, image, images, description, features, is_new, moderation_status, created_at, reference_id";
const LISTING_COLUMNS_WITH_VIEW_COUNT = `${LISTING_COLUMNS}, view_count`;
const LISTING_COLUMNS_WITHOUT_BADGE_AND_VIEW_COUNT = `${LISTING_COLUMNS_WITHOUT_CARD_BADGE}`;
const LISTING_COLUMNS_WITHOUT_KITCHEN =
  "id, title, quartier, price, offer_type, card_badge, surface, bedrooms, living_rooms, showers, type, priority, status, image, images, description, features, is_new, moderation_status, created_at, reference_id";
const LISTING_COLUMNS_WITHOUT_KITCHEN_AND_VIEW_COUNT = `${LISTING_COLUMNS_WITHOUT_KITCHEN}, view_count`;
const LISTING_COLUMNS_WITHOUT_KITCHEN_OR_BADGE =
  "id, title, quartier, price, offer_type, surface, bedrooms, living_rooms, showers, type, priority, status, image, images, description, features, is_new, moderation_status, created_at, reference_id";
const LEGACY_LISTING_COLUMNS =
  "id, title, quartier, price, surface, rooms, bathrooms, type, priority, status, image, images, description, features, is_new, moderation_status, created_at";

const LISTING_IMAGE_BUCKET = "listing-images";
const LISTING_IMAGE_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
const MAX_LISTING_IMAGE_SIZE = 10 * 1024 * 1024;

function createPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) {
    return null;
  }

  return createSupabaseClient(url, publishableKey, {
    global: {
      fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }),
    },
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });
}

function toListing(row: DatabaseListing): Listing {
  return {
    id: Number(row.id),
    referenceId: row.reference_id ?? createFallbackListingReference(row),
    title: row.title ?? "",
    quartier: row.quartier ?? "",
    price: row.price === null ? null : Number(row.price),
    offerType: row.offer_type,
    surface: row.surface === null ? null : Number(row.surface),
    bedrooms: row.bedrooms,
    livingRooms: row.living_rooms,
    showers: row.showers,
    kitchen: row.kitchen ?? null,
    type: row.type ?? "",
    priority: row.priority,
    createdAt: row.created_at,
    status: row.status ?? undefined,
    cardBadge: row.card_badge ?? null,
    viewCount: Number(row.view_count ?? 0),
    image: row.image ?? null,
    images: row.images ?? undefined,
    description: row.description ?? undefined,
    features: row.features ?? undefined,
    isNew: row.is_new,
    isFavorite: false,
  };
}

function createFallbackListingReference(
  row: Pick<DatabaseListing, "id" | "quartier" | "created_at">,
): string {
  const neighborhoodPrefix = (row.quartier ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/gi, "")
    .slice(0, 3)
    .toUpperCase();
  const prefix = neighborhoodPrefix
    ? neighborhoodPrefix.padEnd(3, "X")
    : "ANN";

  return `${prefix}-${row.id}`;
}

function toSubmission(row: DatabaseListing): ListingSubmission {
  return {
    ...toListing(row),
    moderation_status: row.moderation_status,
    created_at: row.created_at,
  };
}

async function fetchListingRows(
  query: ListingReadQuery,
): Promise<DatabaseListing[]> {
  const isMissingColumnError = (error: { code: string } | null) =>
    error !== null && ["42703", "PGRST204"].includes(error.code);
  const queryWithReferenceFallback = async (columns: string) => {
    const result = await query(columns);
    const referenceIdIsMissing =
      isMissingColumnError(result.error) &&
      result.error?.message?.includes("reference_id");

    if (!referenceIdIsMissing) return result;

    return query(columns.split(", ").filter((column) => column !== "reference_id").join(", "));
  };

  const currentResult = await queryWithReferenceFallback(LISTING_COLUMNS_WITH_VIEW_COUNT);

  if (!currentResult.error && currentResult.data) {
    return currentResult.data as DatabaseListing[];
  }

  if (!isMissingColumnError(currentResult.error)) {
    return [];
  }

  const currentSchemaResult = await queryWithReferenceFallback(LISTING_COLUMNS);

  if (!currentSchemaResult.error && currentSchemaResult.data) {
    return (currentSchemaResult.data as unknown as DatabaseListing[]).map((row) => ({
      ...row,
      view_count: 0,
    }));
  }

  if (!isMissingColumnError(currentSchemaResult.error)) {
    return [];
  }

  const schemaWithoutBadge = await queryWithReferenceFallback(LISTING_COLUMNS_WITHOUT_BADGE_AND_VIEW_COUNT);

  if (!schemaWithoutBadge.error && schemaWithoutBadge.data) {
    return (schemaWithoutBadge.data as unknown as DatabaseListing[]).map((row) => ({
      ...row,
      card_badge: row.status === "sold"
        ? "sold"
        : row.status === "rented"
          ? "rented"
          : row.is_new
            ? "new"
            : null,
      view_count: 0,
    }));
  }

  if (!isMissingColumnError(schemaWithoutBadge.error)) {
    return [];
  }

  const schemaWithoutKitchenAndViewCount = await queryWithReferenceFallback(
    LISTING_COLUMNS_WITHOUT_KITCHEN_AND_VIEW_COUNT,
  );

  if (!schemaWithoutKitchenAndViewCount.error && schemaWithoutKitchenAndViewCount.data) {
    return (schemaWithoutKitchenAndViewCount.data as unknown as DatabaseListing[]).map((row) => ({
      ...row,
      kitchen: null,
      view_count: 0,
    }));
  }

  if (!isMissingColumnError(schemaWithoutKitchenAndViewCount.error)) {
    return [];
  }

  const schemaWithoutKitchen = await queryWithReferenceFallback(LISTING_COLUMNS_WITHOUT_KITCHEN);

  if (!schemaWithoutKitchen.error && schemaWithoutKitchen.data) {
    return (schemaWithoutKitchen.data as unknown as DatabaseListing[]).map((row) => ({
      ...row,
      kitchen: null,
      view_count: 0,
    }));
  }

  if (!isMissingColumnError(schemaWithoutKitchen.error)) {
    return [];
  }

  const schemaWithoutKitchenOrBadge = await queryWithReferenceFallback(
    LISTING_COLUMNS_WITHOUT_KITCHEN_OR_BADGE,
  );

  if (!schemaWithoutKitchenOrBadge.error && schemaWithoutKitchenOrBadge.data) {
    return (schemaWithoutKitchenOrBadge.data as unknown as DatabaseListing[]).map((row) => ({
      ...row,
      kitchen: null,
      card_badge: row.status === "sold"
        ? "sold"
        : row.status === "rented"
          ? "rented"
          : row.is_new
            ? "new"
            : null,
      view_count: 0,
    }));
  }

  if (!isMissingColumnError(schemaWithoutKitchenOrBadge.error)) {
    return [];
  }

  const legacyResult = await queryWithReferenceFallback(LEGACY_LISTING_COLUMNS);

  if (legacyResult.error || !legacyResult.data) {
    return [];
  }

  return (legacyResult.data as unknown as LegacyDatabaseListing[]).map((row) => ({
    ...row,
    offer_type:
      row.status === "rented" ? "rent" : row.status === "sold" ? "sale" : null,
    bedrooms: row.rooms,
    living_rooms: 0,
    showers: row.bathrooms,
    kitchen: null,
    card_badge: row.status === "sold"
      ? "sold"
      : row.status === "rented"
        ? "rented"
        : row.is_new
          ? "new"
          : null,
    view_count: 0,
  }));
}

export async function uploadListingImage(
  supabase: SupabaseClient,
  ownerId: string,
  file: File,
): Promise<{ url: string | null; error: string | null }> {
  const extension = LISTING_IMAGE_EXTENSIONS[file.type];

  if (!extension) {
    return { url: null, error: "Choisissez une image JPG, PNG ou WebP." };
  }

  if (file.size > MAX_LISTING_IMAGE_SIZE) {
    return { url: null, error: "La photo ne doit pas dépasser 10 Mo." };
  }

  const filePath = `${ownerId}/${crypto.randomUUID()}.${extension}`;
  const { data, error } = await supabase.storage
    .from(LISTING_IMAGE_BUCKET)
    .upload(filePath, file, {
      cacheControl: "31536000",
      contentType: file.type,
      upsert: false,
    });

  if (error || !data) {
    return { url: null, error: error?.message ?? "Image upload failed" };
  }

  const { data: publicUrl } = supabase.storage
    .from(LISTING_IMAGE_BUCKET)
    .getPublicUrl(data.path);

  return { url: publicUrl.publicUrl, error: null };
}

export async function fetchPublishedListings(): Promise<Listing[]> {
  const supabase = createPublicClient();

  if (!supabase) {
    return [];
  }

  const rows = await fetchListingRows((columns) =>
    supabase
      .from("listings")
      .select(columns)
      .eq("moderation_status", "published")
      .order("priority", { ascending: false })
      .order("created_at", { ascending: false }),
  );

  return rows.map(toListing);
}

export async function incrementListingView(listingId: number): Promise<number | null> {
  const supabase = createPublicClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase.rpc("increment_listing_view", {
    target_listing_id: listingId,
  });

  if (error || data === null || data === undefined) {
    return null;
  }

  const viewCount = Number(data);
  return Number.isFinite(viewCount) ? viewCount : null;
}

export async function submitListing(
  supabase: SupabaseClient,
  ownerId: string,
  role: UserRole,
  draft: ListingDraft,
): Promise<{ listing: ListingSubmission | null; error: string | null }> {
  const moderationStatus = role === "real_estate_agent" ? "pending" : "published";
  const image = draft.image?.trim() || null;
  const { data, error } = await supabase
    .from("listings")
    .insert({
      owner_id: ownerId,
      title: draft.title.trim() || null,
      quartier: draft.quartier.trim() || null,
      price: draft.price,
      offer_type: draft.offerType,
      card_badge: draft.cardBadge,
      surface: draft.surface,
      bedrooms: draft.bedrooms,
      living_rooms: draft.livingRooms,
      showers: draft.showers,
      kitchen: draft.kitchen,
      type: draft.type.trim() || null,
      is_new: true,
      status: null,
      image,
      images: [...(image ? [image] : []), ...(draft.additionalImages ?? [])],
      description: draft.description.trim(),
      features: draft.features,
      priority: 0,
      moderation_status: moderationStatus,
    })
    .select(LISTING_COLUMNS)
    .single();

  if (error || !data) {
    return { listing: null, error: error?.message ?? "Submission failed" };
  }

  return {
    listing: toSubmission(data as unknown as DatabaseListing),
    error: null,
  };
}

export async function listMyListings(
  supabase: SupabaseClient,
  ownerId: string,
): Promise<ListingSubmission[]> {
  const rows = await fetchListingRows((columns) =>
    supabase
      .from("listings")
      .select(columns)
      .eq("owner_id", ownerId)
      .order("created_at", { ascending: false }),
  );

  return rows.map(toSubmission);
}

export async function listPendingListings(
  supabase: SupabaseClient,
): Promise<ListingSubmission[]> {
  const rows = await fetchListingRows((columns) =>
    supabase
      .from("listings")
      .select(columns)
      .eq("moderation_status", "pending")
      .order("created_at", { ascending: true }),
  );

  return rows.map(toSubmission);
}

export async function listManageableListings(
  supabase: SupabaseClient,
): Promise<ListingSubmission[]> {
  const rows = await fetchListingRows((columns) =>
    supabase
      .from("listings")
      .select(columns)
      .order("created_at", { ascending: false }),
  );

  return rows.map(toSubmission);
}

function getStoredListingImagePath(imageUrl: string): string | null {
  try {
    const pathname = new URL(imageUrl).pathname;
    const prefix = `/storage/v1/object/public/${LISTING_IMAGE_BUCKET}/`;

    return pathname.startsWith(prefix)
      ? decodeURIComponent(pathname.slice(prefix.length))
      : null;
  } catch {
    return null;
  }
}

async function removeStoredListingImages(
  supabase: SupabaseClient,
  imageUrls: string[],
): Promise<string | null> {
  const paths = [...new Set(
    imageUrls
      .map(getStoredListingImagePath)
      .filter((path): path is string => path !== null),
  )];

  if (!paths.length) {
    return null;
  }

  const { error } = await supabase.storage
    .from(LISTING_IMAGE_BUCKET)
    .remove(paths);

  return error?.message ?? null;
}

export async function updateListing(
  supabase: SupabaseClient,
  listingId: number,
  draft: ListingDraft,
): Promise<{ listing: ListingSubmission | null; error: string | null }> {
  const { data: current, error: currentError } = await supabase
    .from("listings")
    .select("image")
    .eq("id", listingId)
    .maybeSingle();

  if (currentError || !current) {
    return { listing: null, error: currentError?.message ?? "Listing not found" };
  }

  const image = draft.image?.trim() || null;
  const { data, error } = await supabase
    .from("listings")
    .update({
      title: draft.title.trim() || null,
      quartier: draft.quartier.trim() || null,
      price: draft.price,
      offer_type: draft.offerType,
      card_badge: draft.cardBadge,
      surface: draft.surface,
      bedrooms: draft.bedrooms,
      living_rooms: draft.livingRooms,
      showers: draft.showers,
      kitchen: draft.kitchen,
      type: draft.type.trim() || null,
      priority: draft.priority ?? 0,
      image,
      images: [...(image ? [image] : []), ...(draft.additionalImages ?? [])],
      description: draft.description.trim(),
      features: draft.features,
    })
    .eq("id", listingId)
    .select(LISTING_COLUMNS)
    .single();

  if (error || !data) {
    return { listing: null, error: error?.message ?? "Listing update failed" };
  }

  const cleanupError = current.image && current.image !== image
    ? await removeStoredListingImages(supabase, [current.image])
    : null;

  return {
    listing: toSubmission(data as unknown as DatabaseListing),
    error: cleanupError,
  };
}

export async function deleteListing(
  supabase: SupabaseClient,
  listingId: number,
): Promise<{ deleted: boolean; error: string | null }> {
  const { data: current, error: currentError } = await supabase
    .from("listings")
    .select("image, images")
    .eq("id", listingId)
    .maybeSingle();

  if (currentError || !current) {
    return { deleted: false, error: currentError?.message ?? "Listing not found" };
  }

  const { error } = await supabase
    .from("listings")
    .delete()
    .eq("id", listingId);

  if (error) {
    return { deleted: false, error: error.message };
  }

  const cleanupError = await removeStoredListingImages(supabase, [
    ...(current.image ? [current.image] : []),
    ...(current.images ?? []),
  ]);
  return { deleted: true, error: cleanupError };
}

export async function reviewListingSubmission(
  supabase: SupabaseClient,
  listingId: number,
  approve: boolean,
): Promise<boolean> {
  const { error } = await supabase.rpc("review_listing_submission", {
    target_listing_id: listingId,
    approve_submission: approve,
  });

  return !error;
}
