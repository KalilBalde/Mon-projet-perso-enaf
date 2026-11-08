export const USER_ROLES = [
  "tenant",
  "real_estate_agent",
  "admin",
  "super_admin",
] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  tenant: "Locataire",
  real_estate_agent: "Agent immobilier",
  admin: "Administrateur",
  super_admin: "Super-administrateur",
};

export type Permission =
  | "browse_listings"
  | "save_favorites"
  | "contact_agency"
  | "manage_own_profile"
  | "manage_email_preferences"
  | "create_listings"
  | "manage_own_listings"
  | "review_listings"
  | "manage_users"
  | "manage_roles"
  | "manage_settings";

const tenantPermissions: Permission[] = [
  "browse_listings",
  "save_favorites",
  "contact_agency",
  "manage_own_profile",
  "manage_email_preferences",
];

const realEstateAgentPermissions: Permission[] = [
  ...tenantPermissions,
  "create_listings",
  "manage_own_listings",
];

const adminPermissions: Permission[] = [
  ...realEstateAgentPermissions,
  "review_listings",
  "manage_users",
];

export const ROLE_PERMISSIONS: Record<UserRole, readonly Permission[]> = {
  tenant: tenantPermissions,
  real_estate_agent: realEstateAgentPermissions,
  admin: adminPermissions,
  super_admin: [...adminPermissions, "manage_roles", "manage_settings"],
};

export function hasPermission(
  role: UserRole,
  permission: Permission,
): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}
