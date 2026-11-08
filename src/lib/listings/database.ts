import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { UserRole } from "../auth/permissions";
import type { Listing, ListingCardBadge, ListingOfferType } from "../../types";

export type ListingDraft = {
  title: string;
  quartier: string;
  price: number;
  offerType: ListingOfferType | null;
  cardBadge: ListingCardBadge | null;
  surface: number;
  bedrooms: number;
  livingRooms: number;
  showers: number;
  type: string;
  priority?: number;
  image: string;
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
  title: string;
  quartier: string;
  price: number;
  offer_type: ListingOfferType | null;
  surface: number;
  bedrooms: number;
  living_rooms: number;
  showers: number;
  type: string;
  priority: number;
  status: "sold" | "rented" | null;
  card_badge?: ListingCardBadge | null;
  view_count?: number | null;
  image: string;
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
> {
  rooms: number;
  bathrooms: number;
}

type ListingReadResponse = {
  data: unknown[] | null;
  error: { code: string } | null;
};

type ListingReadQuery = (columns: string) => PromiseLike<ListingReadResponse>;

const LISTING_COLUMNS =
  "id, title, quartier, price, offer_type, card_badge, surface, bedrooms, living_rooms, showers, type, priority, status, image, images, description, features, is_new, moderation_status, created_at";
const LISTING_COLUMNS_WITHOUT_CARD_BADGE =
  "id, title, quartier, price, offer_type, surface, bedrooms, living_rooms, showers, type, priority, status, image, images, description, features, is_new, moderation_status, created_at";
const LISTING_COLUMNS_WITH_VIEW_COUNT = `${LISTING_COLUMNS}, view_count`;
const LISTING_COLUMNS_WITHOUT_BADGE_AND_VIEW_COUNT = `${LISTING_COLUMNS_WITHOUT_CARD_BADGE}`;
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
    title: row.title,
    quartier: row.quartier,
    price: Number(row.price),
    offerType: row.offer_type,
    surface: Number(row.surface),
    bedrooms: row.bedrooms,
    livingRooms: row.living_rooms,
    showers: row.showers,
    type: row.type,
    priority: row.priority,
    status: row.status ?? undefined,
    cardBadge: row.card_badge ?? null,
    viewCount: Number(row.view_count ?? 0),
    image: row.image,
    images: row.images ?? undefined,
    description: row.description ?? undefined,
    features: row.features ?? undefined,
    isNew: row.is_new,
    isFavorite: false,
  };
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

  const currentResult = await query(LISTING_COLUMNS_WITH_VIEW_COUNT);

  if (!currentResult.error && currentResult.data) {
    return currentResult.data as DatabaseListing[];
  }

  if (!isMissingColumnError(currentResult.error)) {
    return [];
  }

  const currentSchemaResult = await query(LISTING_COLUMNS);

  if (!currentSchemaResult.error && currentSchemaResult.data) {
    return (currentSchemaResult.data as unknown as DatabaseListing[]).map((row) => ({
      ...row,
      view_count: 0,
    }));
  }

  if (!isMissingColumnError(currentSchemaResult.error)) {
    return [];
  }

  const schemaWithoutBadge = await query(LISTING_COLUMNS_WITHOUT_BADGE_AND_VIEW_COUNT);

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

  const legacyResult = await query(LEGACY_LISTING_COLUMNS);

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
  const image = draft.image.trim();
  const { data, error } = await supabase
    .from("listings")
    .insert({
      owner_id: ownerId,
      title: draft.title.trim(),
      quartier: draft.quartier,
      price: draft.price,
      offer_type: draft.offerType,
      card_badge: draft.cardBadge,
      surface: draft.surface,
      bedrooms: draft.bedrooms,
      living_rooms: draft.livingRooms,
      showers: draft.showers,
      type: draft.type,
      is_new: true,
      status: null,
      image,
      images: [image, ...(draft.additionalImages ?? [])],
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

  const image = draft.image.trim();
  const { data, error } = await supabase
    .from("listings")
    .update({
      title: draft.title.trim(),
      quartier: draft.quartier,
      price: draft.price,
      offer_type: draft.offerType,
      card_badge: draft.cardBadge,
      surface: draft.surface,
      bedrooms: draft.bedrooms,
      living_rooms: draft.livingRooms,
      showers: draft.showers,
      type: draft.type,
      priority: draft.priority ?? 0,
      image,
      images: [image, ...(draft.additionalImages ?? [])],
      description: draft.description.trim(),
      features: draft.features,
    })
    .eq("id", listingId)
    .select(LISTING_COLUMNS)
    .single();

  if (error || !data) {
    return { listing: null, error: error?.message ?? "Listing update failed" };
  }

  const cleanupError = current.image === image
    ? null
    : await removeStoredListingImages(supabase, [current.image]);

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
    current.image,
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
