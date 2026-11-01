import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { UserRole } from "../auth/permissions";
import type { Listing } from "../../types";

export type ListingDraft = {
  title: string;
  quartier: string;
  price: number;
  surface: number;
  rooms: number;
  bathrooms: number;
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
  surface: number;
  rooms: number;
  bathrooms: number;
  type: string;
  priority: number;
  status: "sold" | "rented" | null;
  image: string;
  images: string[] | null;
  description: string | null;
  features: string[] | null;
  is_new: boolean;
  moderation_status: "pending" | "published" | "rejected";
  created_at: string;
}

const LISTING_COLUMNS =
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
    surface: Number(row.surface),
    rooms: row.rooms,
    bathrooms: row.bathrooms,
    type: row.type,
    priority: row.priority,
    status: row.status ?? undefined,
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

  const { data, error } = await supabase
    .from("listings")
    .select(LISTING_COLUMNS)
    .eq("moderation_status", "published")
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return (data as unknown as DatabaseListing[]).map(toListing);
}

export async function submitListing(
  supabase: SupabaseClient,
  ownerId: string,
  role: UserRole,
  draft: ListingDraft,
): Promise<{ listing: ListingSubmission | null; error: string | null }> {
  const moderationStatus = role === "landlord" ? "pending" : "published";
  const image = draft.image.trim();
  const { data, error } = await supabase
    .from("listings")
    .insert({
      owner_id: ownerId,
      title: draft.title.trim(),
      quartier: draft.quartier,
      price: draft.price,
      surface: draft.surface,
      rooms: draft.rooms,
      bathrooms: draft.bathrooms,
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
  const { data, error } = await supabase
    .from("listings")
    .select(LISTING_COLUMNS)
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return (data as unknown as DatabaseListing[]).map(toSubmission);
}

export async function listPendingListings(
  supabase: SupabaseClient,
): Promise<ListingSubmission[]> {
  const { data, error } = await supabase
    .from("listings")
    .select(LISTING_COLUMNS)
    .eq("moderation_status", "pending")
    .order("created_at", { ascending: true });

  if (error || !data) {
    return [];
  }

  return (data as unknown as DatabaseListing[]).map(toSubmission);
}

export async function listManageableListings(
  supabase: SupabaseClient,
): Promise<ListingSubmission[]> {
  const { data, error } = await supabase
    .from("listings")
    .select(LISTING_COLUMNS)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return (data as unknown as DatabaseListing[]).map(toSubmission);
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
      surface: draft.surface,
      rooms: draft.rooms,
      bathrooms: draft.bathrooms,
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
