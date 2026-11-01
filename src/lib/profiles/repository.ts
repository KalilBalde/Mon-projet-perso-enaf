import type { SupabaseClient } from "@supabase/supabase-js";
import type { UserRole } from "../auth/permissions";

export type Profile = {
  first_names: string;
  last_name: string;
  phone: string;
  email_notifications: boolean;
  role: UserRole;
  requested_role: "tenant" | "landlord";
  role_request_status: "none" | "pending" | "approved" | "rejected";
};

export type LandlordRequest = {
  user_id: string;
  email: string | null;
  first_names: string;
  last_name: string;
  phone: string;
  submitted_at: string;
};

export type ManagedAccount = {
  user_id: string;
  email: string | null;
  first_names: string;
  last_name: string;
  role: UserRole;
  role_request_status: "none" | "pending" | "approved" | "rejected";
  created_at: string;
};

export type ProfileUpdate = Pick<
  Profile,
  "first_names" | "last_name" | "phone"
>;

export async function getProfile(
  supabase: SupabaseClient,
  userId: string,
): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("first_names, last_name, phone, email_notifications, role, requested_role, role_request_status")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    return null;
  }

  return data;
}

export async function updateProfile(
  supabase: SupabaseClient,
  userId: string,
  updates: ProfileUpdate,
): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select("first_names, last_name, phone, email_notifications, role, requested_role, role_request_status")
    .single();

  if (error) {
    return null;
  }

  return data;
}

export async function updateEmailNotifications(
  supabase: SupabaseClient,
  userId: string,
  enabled: boolean,
): Promise<boolean> {
  const { error } = await supabase
    .from("profiles")
    .update({ email_notifications: enabled })
    .eq("id", userId);

  return !error;
}

export async function listPendingLandlordRequests(
  supabase: SupabaseClient,
): Promise<LandlordRequest[]> {
  const { data, error } = await supabase.rpc(
    "list_pending_landlord_requests",
  );

  if (error || !data) {
    return [];
  }

  return data as LandlordRequest[];
}

export async function reviewLandlordRequest(
  supabase: SupabaseClient,
  userId: string,
  approve: boolean,
): Promise<boolean> {
  const { error } = await supabase.rpc("review_landlord_request", {
    target_user_id: userId,
    approve_request: approve,
  });

  return !error;
}

export async function listManagedAccounts(
  supabase: SupabaseClient,
  searchTerm: string,
  pageOffset: number,
  pageLimit = 20,
): Promise<ManagedAccount[]> {
  const { data, error } = await supabase.rpc(
    "list_profiles_for_super_admin",
    {
      search_term: searchTerm,
      page_offset: pageOffset,
      page_limit: pageLimit,
    },
  );

  if (error || !data) {
    return [];
  }

  return data as ManagedAccount[];
}

export async function promoteAccountToAdmin(
  supabase: SupabaseClient,
  userId: string,
): Promise<boolean> {
  const { error } = await supabase.rpc("promote_user_to_admin", {
    target_user_id: userId,
  });

  return !error;
}

export async function demoteManagedAccountToTenant(
  supabase: SupabaseClient,
  userId: string,
): Promise<boolean> {
  const { error } = await supabase.rpc("demote_managed_account_to_tenant", {
    target_user_id: userId,
  });

  return !error;
}
