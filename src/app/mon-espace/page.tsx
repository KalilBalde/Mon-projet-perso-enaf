"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import type { User } from "@supabase/supabase-js";
import {
  ArrowRight,
  Bell,
  Building2,
  ClipboardCheck,
  Heart,
  MoreHorizontal,
  MessageCircle,
  Phone,
  Plus,
  Search as SearchIcon,
  ShieldCheck,
  UserRound,
  Wrench,
  UserCog,
  type LucideIcon,
} from "lucide-react";
import { createClient } from "../../lib/supabase/client";
import {
  hasPermission,
  USER_ROLE_LABELS,
} from "../../lib/auth/permissions";
import {
  getProfile,
  demoteManagedAccountToTenant,
  type AgentRequest,
  type ManagedAccount,
  listManagedAccounts,
  listPendingAgentRequests,
  promoteAccountToAdmin,
  reviewAgentRequest,
  type Profile,
  updateEmailNotifications,
  updateProfile,
} from "../../lib/profiles/repository";
import {
  fetchPublishedListings,
  listMyListings,
  listPendingListings,
  reviewListingSubmission,
  submitListing,
  type ListingDraft,
  type ListingSubmission,
} from "../../lib/listings/database";
import {
  FAVORITES_CHANGED_EVENT,
  getFavoriteIds,
} from "../../lib/favorites/storage";
import { listingRepository } from "../../lib/listings/repository";
import type { Listing } from "../../types";
import ListingScroller from "../../components/shared/ListingScroller";
import AccountForms from "./AccountForms";
import ListingManagement from "./ListingManagement";
import ListingSubmissionForm from "./ListingSubmissionForm";
import SignOutButton from "./SignOutButton";
import styles from "./dashboard.module.css";
import { useContactModal } from "../../components/contact/ContactModal";
import { formatListingPrice } from "../../utils/format";

type AccountSection =
  | "favorites"
  | "profile"
  | "notifications"
  | "my_listings"
  | "submit_listing"
  | "listing_review"
  | "listing_management"
  | "agent_requests"
  | "role_management";
type Feedback = { ok: boolean; text: string } | null;

const TABS: { id: AccountSection; label: string; Icon: LucideIcon }[] = [
  { id: "favorites", label: "Mes favoris", Icon: Heart },
  { id: "profile", label: "Profil", Icon: UserRound },
  { id: "notifications", label: "Notifications", Icon: Bell },
  { id: "my_listings", label: "Mes annonces", Icon: Building2 },
  { id: "submit_listing", label: "Ajouter une annonce", Icon: Plus },
  { id: "listing_review", label: "Annonces à valider", Icon: ClipboardCheck },
  { id: "listing_management", label: "Gestion des annonces", Icon: Building2 },
  { id: "agent_requests", label: "Demandes d’agents immobiliers", Icon: ShieldCheck },
  { id: "role_management", label: "Gestion des rôles", Icon: UserCog },
];

// Heavily blurred, so a small copy of a site photo is enough.
const BACKDROP_SRC =
  "https://images.unsplash.com/photo-1460317442991-0ec209397118?w=960&h=640&fit=crop&q=50";

const AGENCY_MESSAGE =
  "Bonjour ENAFIM Guinée, je vous contacte depuis mon espace personnel.";

export default function AccountPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabasePublishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const supabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [databaseListings, setDatabaseListings] = useState<Listing[]>([]);
  const [myListings, setMyListings] = useState<ListingSubmission[]>([]);
  const [pendingListings, setPendingListings] = useState<ListingSubmission[]>([]);
  const [profileDraft, setProfileDraft] = useState({
    first_names: "",
    last_name: "",
    phone: "",
  });
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [confirmationError, setConfirmationError] = useState(false);
  const [activeSection, setActiveSection] =
    useState<AccountSection>("profile");
  const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false);
  const optionsMenuRef = useRef<HTMLDivElement>(null);
  const [favoriteListings, setFavoriteListings] = useState<Listing[]>([]);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileFeedback, setProfileFeedback] = useState<Feedback>(null);
  const [isSavingNotifications, setIsSavingNotifications] = useState(false);
  const [notificationFeedback, setNotificationFeedback] =
    useState<Feedback>(null);
  const [agentRequests, setAgentRequests] = useState<AgentRequest[]>([]);
  const [isLoadingAgentRequests, setIsLoadingAgentRequests] = useState(false);
  const [reviewingUserId, setReviewingUserId] = useState<string | null>(null);
  const [reviewFeedback, setReviewFeedback] = useState<Feedback>(null);
  const [isLoadingMyListings, setIsLoadingMyListings] = useState(false);
  const [isLoadingPendingListings, setIsLoadingPendingListings] = useState(false);
  const [reviewingListingId, setReviewingListingId] = useState<number | null>(null);
  const [listingReviewFeedback, setListingReviewFeedback] = useState<Feedback>(null);
  const [managedAccounts, setManagedAccounts] = useState<ManagedAccount[]>([]);
  const [isLoadingManagedAccounts, setIsLoadingManagedAccounts] = useState(false);
  const [managedAccountsSearch, setManagedAccountsSearch] = useState("");
  const [managedAccountsOffset, setManagedAccountsOffset] = useState(0);
  const [hasMoreManagedAccounts, setHasMoreManagedAccounts] = useState(false);
  const [changingManagedRoleUserId, setChangingManagedRoleUserId] = useState<string | null>(null);
  const [manageRoleFeedback, setManageRoleFeedback] = useState<Feedback>(null);
  const { openContact } = useContactModal();

  useEffect(() => {
    setConfirmationError(
      new URLSearchParams(window.location.search).get("confirmation") ===
        "error",
    );

    const requestedSection = new URLSearchParams(
      window.location.search,
    ).get("section");

    if (
      requestedSection === "favorites" ||
      requestedSection === "profile" ||
      requestedSection === "notifications" ||
      requestedSection === "my_listings" ||
      requestedSection === "submit_listing" ||
      requestedSection === "listing_review" ||
      requestedSection === "listing_management" ||
      requestedSection === "agent_requests" ||
      requestedSection === "role_management"
    ) {
      setActiveSection(requestedSection);
    }

    if (!supabaseConfigured) {
      setIsAuthLoading(false);
      return;
    }

    let active = true;
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) {
        setUser(session?.user ?? null);
        setIsAuthLoading(false);
      }
    });

    void supabase.auth.getUser().then(({ data }) => {
      if (active) {
        setUser(data.user);
        setIsAuthLoading(false);
      }
    }).catch(() => {
      if (active) {
        setUser(null);
        setIsAuthLoading(false);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [supabaseConfigured]);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setIsProfileLoading(false);
      return;
    }

    let active = true;
    setIsProfileLoading(true);

    void getProfile(createClient(), user.id).then((nextProfile) => {
      if (active) {
        setProfile(nextProfile);
      }
    }).catch(() => {
      if (active) {
        setProfile(null);
      }
    }).finally(() => {
      if (active) {
        setIsProfileLoading(false);
      }
    });

    return () => {
      active = false;
    };
  }, [user]);

  const canReviewAgentRequests = Boolean(
    profile && hasPermission(profile.role, "manage_users"),
  );
  const canManageRoles = Boolean(
    profile && hasPermission(profile.role, "manage_users"),
  );
  const canCreateListings = Boolean(
    profile && hasPermission(profile.role, "create_listings"),
  );
  const canReviewListings = Boolean(
    profile && hasPermission(profile.role, "review_listings"),
  );

  useEffect(() => {
    let active = true;

    void fetchPublishedListings().then((listings) => {
      if (active) {
        setDatabaseListings(listings);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!user || !canReviewAgentRequests) {
      setAgentRequests([]);
      return;
    }

    let active = true;
    setIsLoadingAgentRequests(true);

    void listPendingAgentRequests(createClient())
      .then((requests) => {
        if (active) {
          setAgentRequests(requests);
        }
      })
      .finally(() => {
        if (active) {
          setIsLoadingAgentRequests(false);
        }
      });

    return () => {
      active = false;
    };
  }, [user, canReviewAgentRequests]);

  useEffect(() => {
    if (!user || !canCreateListings) {
      setMyListings([]);
      return;
    }

    let active = true;
    setIsLoadingMyListings(true);

    void listMyListings(createClient(), user.id)
      .then((listings) => {
        if (active) {
          setMyListings(listings);
        }
      })
      .finally(() => {
        if (active) {
          setIsLoadingMyListings(false);
        }
      });

    return () => {
      active = false;
    };
  }, [user, canCreateListings]);

  useEffect(() => {
    if (!user || !canReviewListings) {
      setPendingListings([]);
      return;
    }

    let active = true;
    setIsLoadingPendingListings(true);

    void listPendingListings(createClient())
      .then((listings) => {
        if (active) {
          setPendingListings(listings);
        }
      })
      .finally(() => {
        if (active) {
          setIsLoadingPendingListings(false);
        }
      });

    return () => {
      active = false;
    };
  }, [user, canReviewListings]);

  useEffect(() => {
    if (!user || !canManageRoles) {
      setManagedAccounts([]);
      return;
    }

    let active = true;
    setIsLoadingManagedAccounts(true);

    void listManagedAccounts(
      createClient(),
      managedAccountsSearch,
      managedAccountsOffset,
    )
      .then((accounts) => {
        if (active) {
          setManagedAccounts(accounts);
          setHasMoreManagedAccounts(accounts.length === 20);
        }
      })
      .finally(() => {
        if (active) {
          setIsLoadingManagedAccounts(false);
        }
      });

    return () => {
      active = false;
    };
  }, [user, canManageRoles, managedAccountsSearch, managedAccountsOffset]);

  useEffect(() => {
    if (!profile) {
      return;
    }

    setProfileDraft({
      first_names: profile.first_names,
      last_name: profile.last_name,
      phone: profile.phone,
    });
  }, [profile]);

  useEffect(() => {
    const refreshFavorites = () => {
      // Ids are stored oldest first, so reverse to show the latest like first.
      const currentListings = getFavoriteIds()
        .reverse()
        .map((listingId) =>
          listingRepository.findById(listingId, databaseListings),
        )
        .filter((listing): listing is Listing => Boolean(listing));

      setFavoriteListings(currentListings);
    };

    refreshFavorites();
    window.addEventListener(FAVORITES_CHANGED_EVENT, refreshFavorites);
    window.addEventListener("storage", refreshFavorites);

    return () => {
      window.removeEventListener(FAVORITES_CHANGED_EVENT, refreshFavorites);
      window.removeEventListener("storage", refreshFavorites);
    };
  }, [databaseListings]);

  const handleProfileSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user) {
      return;
    }

    setIsSavingProfile(true);
    setProfileFeedback(null);

    const updatedProfile = await updateProfile(createClient(), user.id, {
      first_names: profileDraft.first_names.trim().replace(/\s+/g, " "),
      last_name: profileDraft.last_name.trim(),
      phone: profileDraft.phone.trim(),
    });

    if (updatedProfile) {
      setProfile(updatedProfile);
      setIsEditingProfile(false);
      setProfileFeedback({ ok: true, text: "Votre profil a été mis à jour." });
    } else {
      setProfileFeedback({
        ok: false,
        text: "La mise à jour a échoué. Réessayez.",
      });
    }

    setIsSavingProfile(false);
  };

  const handleProfileCancel = () => {
    if (profile) {
      setProfileDraft({
        first_names: profile.first_names,
        last_name: profile.last_name,
        phone: profile.phone,
      });
    }

    setProfileFeedback(null);
    setIsEditingProfile(false);
  };

  const handleNotificationsToggle = async () => {
    if (!user || !profile || isSavingNotifications) {
      return;
    }

    const nextEnabled = !profile.email_notifications;
    setIsSavingNotifications(true);
    setNotificationFeedback(null);

    const saved = await updateEmailNotifications(
      createClient(),
      user.id,
      nextEnabled,
    );

    if (saved) {
      setProfile({ ...profile, email_notifications: nextEnabled });
      setNotificationFeedback({
        ok: true,
        text: "Votre préférence a été enregistrée.",
      });
    } else {
      setNotificationFeedback({
        ok: false,
        text: "La préférence n’a pas pu être enregistrée.",
      });
    }

    setIsSavingNotifications(false);
  };

  const handleAgentRequestReview = async (
    request: AgentRequest,
    approve: boolean,
  ) => {
    setReviewingUserId(request.user_id);
    setReviewFeedback(null);

    try {
      const reviewed = await reviewAgentRequest(
        createClient(),
        request.user_id,
        approve,
      );

      if (reviewed) {
        setAgentRequests((current) =>
          current.filter((item) => item.user_id !== request.user_id),
        );
        setReviewFeedback({
          ok: true,
          text: approve
            ? `La demande de ${request.first_names} ${request.last_name} est approuvée.`
            : `La demande de ${request.first_names} ${request.last_name} est refusée.`,
        });
      } else {
        setReviewFeedback({
          ok: false,
          text: "La décision n’a pas pu être enregistrée.",
        });
      }
    } catch {
      setReviewFeedback({
        ok: false,
        text: "La décision n’a pas pu être enregistrée.",
      });
    } finally {
      setReviewingUserId(null);
    }
  };

  const handleManagedAccountSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setManagedAccountsOffset(0);
  };

  const handlePromoteAccount = async (account: ManagedAccount) => {
    setChangingManagedRoleUserId(account.user_id);
    setManageRoleFeedback(null);

    const promoted = await promoteAccountToAdmin(
      createClient(),
      account.user_id,
    );

    if (promoted) {
      setManagedAccounts((accounts) =>
        accounts.map((item) =>
          item.user_id === account.user_id
            ? { ...item, role: "admin" }
            : item,
        ),
      );
      setManageRoleFeedback({
        ok: true,
        text: `${account.first_names} ${account.last_name} est maintenant administrateur.`,
      });
    } else {
      setManageRoleFeedback({
        ok: false,
        text: "La promotion a échoué. Vérifie le rôle et réessaie.",
      });
    }

    setChangingManagedRoleUserId(null);
  };

  const handleDemoteAccount = async (account: ManagedAccount) => {
    const confirmed = window.confirm(
      `Retirer le rôle ${USER_ROLE_LABELS[account.role]} de ${account.first_names} ${account.last_name} et le passer au rôle Locataire ?`,
    );
    if (!confirmed) return;

    setChangingManagedRoleUserId(account.user_id);
    setManageRoleFeedback(null);

    const demoted = await demoteManagedAccountToTenant(
      createClient(),
      account.user_id,
    );

    if (demoted) {
      setManagedAccounts((accounts) =>
        profile?.role === "admin"
          ? accounts.filter((item) => item.user_id !== account.user_id)
          : accounts.map((item) =>
              item.user_id === account.user_id
                ? { ...item, role: "tenant", role_request_status: "none" }
                : item,
            ),
      );
      setManageRoleFeedback({
        ok: true,
        text: `${account.first_names} ${account.last_name} a maintenant le rôle Locataire.`,
      });
    } else {
      setManageRoleFeedback({
        ok: false,
        text: "La rétrogradation a échoué. Vérifie le rôle et réessaie.",
      });
    }

    setChangingManagedRoleUserId(null);
  };

  const handleListingSubmitted = () => {
    setActiveSection("my_listings");

    if (user) {
      void listMyListings(createClient(), user.id).then(setMyListings);
    }

    void fetchPublishedListings().then(setDatabaseListings);
  };

  const handleListingReview = async (
    listing: ListingSubmission,
    approve: boolean,
  ) => {
    setReviewingListingId(listing.id);
    setListingReviewFeedback(null);

    try {
      const reviewed = await reviewListingSubmission(
        createClient(),
        listing.id,
        approve,
      );

      if (reviewed) {
        setPendingListings((current) =>
          current.filter((item) => item.id !== listing.id),
        );
        setListingReviewFeedback({
          ok: true,
          text: approve
            ? `« ${listing.title} » est publiée.`
            : `« ${listing.title} » a été refusée.`,
        });

        if (approve) {
          void fetchPublishedListings().then(setDatabaseListings);
        }
      } else {
        setListingReviewFeedback({
          ok: false,
          text: "La décision n’a pas pu être enregistrée.",
        });
      }
    } catch {
      setListingReviewFeedback({
        ok: false,
        text: "La décision n’a pas pu être enregistrée.",
      });
    } finally {
      setReviewingListingId(null);
    }
  };

  const firstNames =
    profile?.first_names ||
    (user?.user_metadata?.first_names as string | undefined) ||
    "";
  const lastName =
    profile?.last_name ||
    (user?.user_metadata?.last_name as string | undefined) ||
    "";
  const greetingName =
    firstNames.split(/\s+/)[0] || user?.email?.split("@")[0] || "";
  const initials =
    `${firstNames.charAt(0)}${lastName.charAt(0)}`.toUpperCase() ||
    user?.email?.charAt(0).toUpperCase() ||
    "E";

  const filledProfileFields = [
    profile?.first_names,
    profile?.last_name,
    profile?.phone,
  ].filter((value) => value && value.trim().length > 0).length;
  const stats: {
    id: AccountSection;
    Icon: LucideIcon;
    value: string;
    label: string;
  }[] = [
    {
      id: "favorites",
      Icon: Heart,
      value: String(favoriteListings.length),
      label: "Annonces favorites",
    },
    {
      id: "profile",
      Icon: UserRound,
      value: profile ? `${Math.round((filledProfileFields / 3) * 100)} %` : "—",
      label: "Profil complété",
    },
    {
      id: "notifications",
      Icon: Bell,
      value: profile
        ? profile.email_notifications
          ? "Activées"
          : "Désactivées"
        : "—",
      label: "Notifications e-mail",
    },
  ];

  const latestListings = listingRepository
    .findAll({ limit: 12 }, databaseListings)
    .filter((listing) => !listing.status)
    .slice(0, 10);

  const visibleTabs = TABS.filter((tab) => {
    if (tab.id === "agent_requests") {
      return canReviewAgentRequests;
    }

    if (tab.id === "role_management") {
      return canManageRoles;
    }

    if (tab.id === "my_listings" || tab.id === "submit_listing") {
      return canCreateListings;
    }

    if (tab.id === "listing_review") {
      return canReviewListings;
    }

    if (tab.id === "listing_management") {
      return canReviewListings;
    }

    return true;
  });
  const primaryTabs = visibleTabs.filter((tab) =>
    ["favorites", "profile", "notifications"].includes(tab.id),
  );
  const optionTabs = visibleTabs.filter(
    (tab) => !["favorites", "profile", "notifications"].includes(tab.id),
  );

  useEffect(() => {
    if (!isOptionsMenuOpen) {
      return;
    }

    const closeOnOutsideClick = (event: MouseEvent) => {
      if (
        optionsMenuRef.current &&
        !optionsMenuRef.current.contains(event.target as Node)
      ) {
        setIsOptionsMenuOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOptionsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOptionsMenuOpen]);

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <img
          className={styles.backdrop}
          src={BACKDROP_SRC}
          alt=""
          aria-hidden="true"
          decoding="async"
        />
        <div className={styles.veil} />
        <div className={styles.heroInner}>
          {user ? (
            <>
              <div className={styles.heroTop}>
                <div className={styles.identity}>
                  <span className={styles.avatar} aria-hidden="true">
                    {initials}
                  </span>
                  <div className={styles.identityText}>
                    <span className={styles.status}>
                      <i /> Connecté
                    </span>
                    <h1>Bonjour, {greetingName}</h1>
                    <p className={styles.heroSub}>{user.email}</p>
                    {profile && (
                      <span className={styles.roleBadge}>
                        {USER_ROLE_LABELS[profile.role]}
                      </span>
                    )}
                    {profile?.requested_role === "real_estate_agent" &&
                      profile.role_request_status === "pending" && (
                        <p className={styles.agentRequestStatus}>
                          Demande d’accès comme agent immobilier en attente de validation
                        </p>
                      )}
                  </div>
                </div>
                <div className={styles.heroActions}>
                  <button
                    type="button"
                    className={styles.heroAgency}
                    aria-label="Écrire à l’agence"
                    onClick={() => openContact(AGENCY_MESSAGE)}
                  >
                    <MessageCircle size={18} aria-hidden="true" />
                  </button>
                  <SignOutButton />
                </div>
              </div>

              <div className={styles.heroStats}>
                {stats.map(({ id, Icon, value, label }) => (
                  <button
                    key={id}
                    type="button"
                    className={styles.statTile}
                    onClick={() => setActiveSection(id)}
                  >
                    <span className={styles.statIcon}>
                      <Icon size={19} aria-hidden="true" />
                    </span>
                    <span className={styles.statText}>
                      <strong>{value}</strong>
                      <small>{label}</small>
                    </span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className={styles.identityText}>
              <p className={styles.eyebrow}>ESPACE CLIENT ENAFIM</p>
              <h1>Mon espace personnel</h1>
              <p className={styles.heroSub}>
                Connectez-vous ou créez votre compte ENAFIM Guinée.
              </p>
            </div>
          )}
        </div>
      </section>

      <div className={styles.container}>

        {!supabaseConfigured ? (
          <section className={styles.setupNotice}>
            <ShieldCheck size={24} aria-hidden="true" />
            <div>
              <h2>Connexion momentanément indisponible</h2>
              <p>La configuration du service de compte est incomplète.</p>
            </div>
          </section>
        ) : isAuthLoading ? (
          <section className={styles.accountLoading} aria-live="polite">
            Vérification de votre session...
          </section>
        ) : user ? (
          <>
            <div className={styles.toolbar}>
              <nav className={styles.tabs} aria-label="Rubriques principales du compte">
                {primaryTabs.map(({ id, label, Icon }) => (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={activeSection === id}
                    className={
                      activeSection === id
                        ? `${styles.tab} ${styles.tabActive}`
                        : styles.tab
                    }
                    onClick={() => setActiveSection(id)}
                  >
                    <Icon size={17} aria-hidden="true" />
                    {label}
                    {id === "favorites" && favoriteListings.length > 0 && (
                      <span className={styles.count}>
                        {favoriteListings.length}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
              <div className={styles.toolbarActions}>
                {optionTabs.length > 0 && (
                  <div className={styles.optionsWrap} ref={optionsMenuRef}>
                    <button
                      type="button"
                      className={`${styles.moreButton} ${optionTabs.some((tab) => tab.id === activeSection) ? styles.moreButtonActive : ""}`}
                      aria-expanded={isOptionsMenuOpen}
                      aria-haspopup="menu"
                      aria-controls="account-more-menu"
                      onClick={() => setIsOptionsMenuOpen((isOpen) => !isOpen)}
                    >
                      <MoreHorizontal size={19} aria-hidden="true" />
                      <span>Plus</span>
                    </button>
                    {isOptionsMenuOpen && (
                      <div
                        id="account-more-menu"
                        className={styles.optionsMenu}
                        role="menu"
                        aria-label="Autres options du compte"
                      >
                        {optionTabs.map(({ id, label, Icon }) => (
                          <button
                            key={id}
                            type="button"
                            role="menuitem"
                            className={styles.optionsMenuItem}
                            aria-current={activeSection === id ? "page" : undefined}
                            onClick={() => {
                              setActiveSection(id);
                              setIsOptionsMenuOpen(false);
                            }}
                          >
                            <Icon size={17} aria-hidden="true" />
                            <span>{label}</span>
                            {id === "listing_review" && pendingListings.length > 0 && (
                              <span className={styles.count}>{pendingListings.length}</span>
                            )}
                            {id === "agent_requests" && agentRequests.length > 0 && (
                              <span className={styles.count}>{agentRequests.length}</span>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                <button
                  type="button"
                  className={styles.agencyButton}
                  aria-label="Écrire à l’agence"
                  onClick={() => openContact(AGENCY_MESSAGE)}
                >
                  <MessageCircle size={18} aria-hidden="true" />
                  <span className={styles.agencyLabel}>Écrire à l’agence</span>
                </button>
              </div>
            </div>

            <section className={styles.panel}>
              {activeSection === "favorites" ? (
                <div>
                  <div className={styles.sectionTop}>
                    <div className={styles.sectionHeading}>
                      <span className={styles.sectionEyebrow}>Mes favoris</span>
                      <h2>Vos annonces enregistrées</h2>
                      <p>{favoriteListings.length} annonce{favoriteListings.length === 1 ? "" : "s"} enregistrée{favoriteListings.length === 1 ? "" : "s"} sur cet appareil</p>
                    </div>
                  </div>
                  {favoriteListings.length ? (
                    <ListingScroller
                      listings={favoriteListings}
                      label="Mes annonces favorites"
                    />
                  ) : (
                    <div className={styles.emptyFavorites}>
                      <span className={styles.emptyIcon}>
                        <Heart size={28} aria-hidden="true" />
                      </span>
                      <h3>Aucun favori pour le moment</h3>
                      <p>Touchez le cœur d’une annonce pour la retrouver ici.</p>
                    </div>
                  )}

                  {latestListings.length > 0 && (
                    <div className={styles.subSection}>
                      <div className={styles.sectionTop}>
                        <div className={styles.sectionHeading}>
                          <span className={styles.sectionEyebrow}>Découvrir</span>
                          <h2>Dernières annonces</h2>
                        </div>
                        <Link href="/annonces" className={styles.outlineLink}>
                          Voir tout <ArrowRight size={14} aria-hidden="true" />
                        </Link>
                      </div>
                      <ListingScroller
                        listings={latestListings}
                        label="Dernières annonces"
                      />
                    </div>
                  )}
                </div>
              ) : activeSection === "submit_listing" && canCreateListings ? (
                <section>
                  <ListingSubmissionForm
                    userId={user.id}
                    role={profile!.role}
                    onSubmitted={handleListingSubmitted}
                  />
                </section>
              ) : activeSection === "my_listings" && canCreateListings ? (
                <section className={styles.myListingsSection}>
                  <div className={styles.sectionTop}>
                    <div className={styles.sectionHeading}>
                      <span className={styles.sectionEyebrow}>Suivi</span>
                      <h2>Mes annonces</h2>
                      <p>Consultez ici leur état de publication.</p>
                    </div>
                  </div>
                  {isLoadingMyListings ? (
                    <p className={styles.accountLoading}>Chargement de vos annonces...</p>
                  ) : myListings.length ? (
                    <div className={styles.ownerListingList}>
                      {myListings.map((listing) => (
                        <article key={listing.id} className={styles.ownerListing}>
                          <img src={listing.image} alt="" />
                          <div className={styles.ownerListingInfo}>
                            <h3>{listing.title}</h3>
                            <p>{listing.quartier}, Conakry · {formatListingPrice(listing.price, listing.offerType)}</p>
                          </div>
                          <span className={`${styles.moderationBadge} ${styles[`moderation_${listing.moderation_status}`]}`}>
                            {listing.moderation_status === "published"
                              ? "Publiée"
                              : listing.moderation_status === "pending"
                                ? "En attente"
                                : "Refusée"}
                          </span>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <div className={styles.emptyRequestQueue}>
                      Vous n’avez pas encore déposé d’annonce.
                    </div>
                  )}
                </section>
              ) : activeSection === "listing_review" && canReviewListings ? (
                <section>
                  <div className={styles.sectionTop}>
                    <div className={styles.sectionHeading}>
                      <span className={styles.sectionEyebrow}>Modération</span>
                      <h2>Annonces à valider</h2>
                      <p>Les annonces déposées par les agents immobiliers restent privées jusqu’à votre approbation.</p>
                    </div>
                  </div>
                  {listingReviewFeedback && (
                    <p
                      className={listingReviewFeedback.ok ? styles.profileFeedback : styles.profileFeedbackError}
                      role="status"
                    >
                      {listingReviewFeedback.text}
                    </p>
                  )}
                  {isLoadingPendingListings ? (
                    <p className={styles.accountLoading}>Chargement des annonces...</p>
                  ) : pendingListings.length ? (
                    <div className={styles.listingReviewList}>
                      {pendingListings.map((listing) => (
                        <article key={listing.id} className={styles.listingReviewItem}>
                          <img src={listing.image} alt="" />
                          <div className={styles.listingReviewInfo}>
                            <span className={styles.moderationBadge}>À valider</span>
                            <h3>{listing.title}</h3>
                            <p>{listing.type} · {listing.quartier}, Conakry</p>
                            <p>{formatListingPrice(listing.price, listing.offerType)} · {listing.surface} m² · {listing.bedrooms} chambre(s)</p>
                          </div>
                          <div className={styles.requestActions}>
                            <button
                              className={styles.approveButton}
                              type="button"
                              disabled={reviewingListingId !== null}
                              onClick={() => handleListingReview(listing, true)}
                            >
                              {reviewingListingId === listing.id ? "Validation..." : "Approuver"}
                            </button>
                            <button
                              className={styles.rejectButton}
                              type="button"
                              disabled={reviewingListingId !== null}
                              onClick={() => handleListingReview(listing, false)}
                            >
                              Refuser
                            </button>
                          </div>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <div className={styles.emptyRequestQueue}>
                      Aucune annonce en attente de validation.
                    </div>
                  )}
                </section>
              ) : activeSection === "listing_management" && canReviewListings ? (
                <ListingManagement userId={user.id} />
              ) : activeSection === "profile" ? (
                <div>
                  <div className={styles.sectionTop}>
                    <div className={styles.sectionHeading}>
                      <span className={styles.sectionEyebrow}>Mon profil</span>
                      <h2>Vos informations</h2>
                      <p>Vos coordonnées personnelles.</p>
                    </div>
                    {profile && !isEditingProfile && (
                      <button
                        type="button"
                        className={styles.outlineLink}
                        onClick={() => {
                          setProfileFeedback(null);
                          setIsEditingProfile(true);
                        }}
                      >
                        Modifier
                      </button>
                    )}
                  </div>
                  {profile?.requested_role === "real_estate_agent" &&
                    profile.role_request_status === "pending" && (
                      <div className={styles.roleRequestNotice} role="status">
                        Votre demande d’accès comme agent immobilier est en attente de validation par ENAFIM.
                        Votre compte conserve le rôle Locataire jusque-là.
                      </div>
                    )}
                  {isProfileLoading ? (
                    <p className={styles.accountLoading}>Chargement du profil...</p>
                  ) : profile ? (
                    <>
                      {isEditingProfile ? (
                        <form className={styles.profileForm} onSubmit={handleProfileSave}>
                          <label className={styles.field}>
                            <span>Prénom(s)</span>
                            <input autoComplete="given-name" maxLength={100} onChange={(event) => setProfileDraft({ ...profileDraft, first_names: event.target.value })} required value={profileDraft.first_names} />
                          </label>
                          <label className={styles.field}>
                            <span>Nom</span>
                            <input autoComplete="family-name" maxLength={100} onChange={(event) => setProfileDraft({ ...profileDraft, last_name: event.target.value })} required value={profileDraft.last_name} />
                          </label>
                          <label className={styles.field}>
                            <span>Adresse e-mail</span>
                            <input readOnly value={user.email || ""} />
                          </label>
                          <label className={styles.field}>
                            <span>Téléphone</span>
                            <input autoComplete="tel" inputMode="tel" maxLength={25} onChange={(event) => setProfileDraft({ ...profileDraft, phone: event.target.value })} required type="tel" value={profileDraft.phone} />
                          </label>
                          <div className={styles.profileFormActions}>
                            <button className={styles.primaryAction} type="submit" disabled={isSavingProfile}>
                              {isSavingProfile ? "Enregistrement..." : "Enregistrer le profil"}
                            </button>
                            <button className={styles.cancelAction} type="button" disabled={isSavingProfile} onClick={handleProfileCancel}>
                              Annuler
                            </button>
                          </div>
                        </form>
                      ) : (
                        <dl className={styles.profileReadOnly}>
                          <div>
                            <dt>Prénom(s)</dt>
                            <dd>{profile.first_names || "Non renseigné"}</dd>
                          </div>
                          <div>
                            <dt>Nom</dt>
                            <dd>{profile.last_name || "Non renseigné"}</dd>
                          </div>
                          <div>
                            <dt>Adresse e-mail</dt>
                            <dd>{user.email || "Non renseignée"}</dd>
                          </div>
                          <div>
                            <dt>Téléphone</dt>
                            <dd>{profile.phone || "Non renseigné"}</dd>
                          </div>
                          <div>
                            <dt>Type de compte</dt>
                            <dd>{USER_ROLE_LABELS[profile.role]}</dd>
                          </div>
                        </dl>
                      )}
                      {profileFeedback && (
                        <p
                          className={profileFeedback.ok ? styles.profileFeedback : styles.profileFeedbackError}
                          role="status"
                        >
                          {profileFeedback.text}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className={styles.errorMessage}>Le profil n’a pas pu être chargé.</p>
                  )}
                </div>
              ) : activeSection === "agent_requests" && canReviewAgentRequests ? (
                <section>
                  <div className={styles.sectionTop}>
                    <div className={styles.sectionHeading}>
                      <span className={styles.sectionEyebrow}>Administration</span>
                      <h2>Demandes d’agents immobiliers</h2>
                      <p>L’accès professionnel n’est accordé qu’après validation par ENAFIM.</p>
                    </div>
                  </div>

                  {reviewFeedback && (
                    <p
                      className={reviewFeedback.ok ? styles.profileFeedback : styles.profileFeedbackError}
                      role="status"
                    >
                      {reviewFeedback.text}
                    </p>
                  )}

                  {isLoadingAgentRequests ? (
                    <p className={styles.accountLoading}>Chargement des demandes...</p>
                  ) : agentRequests.length === 0 ? (
                    <div className={styles.emptyRequestQueue}>
                      Aucune demande d’agent immobilier en attente.
                    </div>
                  ) : (
                    <div className={styles.requestQueue}>
                      {agentRequests.map((request) => (
                        <article key={request.user_id} className={styles.requestItem}>
                          <div className={styles.requestIdentity}>
                            <span className={styles.requestAvatar} aria-hidden="true">
                              {request.first_names.charAt(0).toUpperCase()}
                            </span>
                            <div>
                              <h3>{request.first_names} {request.last_name}</h3>
                              <p>{request.email}</p>
                              <p>{request.phone} · Demande du {new Date(request.submitted_at).toLocaleDateString("fr-FR")}</p>
                            </div>
                          </div>
                          <div className={styles.requestActions}>
                            <button
                              className={styles.approveButton}
                              type="button"
                              disabled={reviewingUserId !== null}
                              onClick={() => handleAgentRequestReview(request, true)}
                            >
                              {reviewingUserId === request.user_id ? "Traitement..." : "Approuver"}
                            </button>
                            <button
                              className={styles.rejectButton}
                              type="button"
                              disabled={reviewingUserId !== null}
                              onClick={() => handleAgentRequestReview(request, false)}
                            >
                              Refuser
                            </button>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </section>
              ) : activeSection === "role_management" && canManageRoles ? (
                <section>
                  <div className={styles.sectionTop}>
                    <div className={styles.sectionHeading}>
                      <span className={styles.sectionEyebrow}>
                        {profile?.role === "admin" ? "Administration" : "Super-administration"}
                      </span>
                      <h2>Gestion des rôles</h2>
                      <p>
                        {profile?.role === "admin"
                          ? "Vous pouvez retirer le rôle Agent immobilier. Seul un Super-admin peut attribuer ou retirer le rôle Administrateur."
                          : "Gérez les rôles Agent immobilier et Administrateur. Les comptes Super-admin sont protégés."}
                      </p>
                    </div>
                  </div>

                  <form
                    className={styles.accountSearch}
                    onSubmit={handleManagedAccountSearch}
                  >
                    <SearchIcon size={18} aria-hidden="true" />
                    <input
                      aria-label="Rechercher un compte"
                      placeholder="Rechercher par nom ou e-mail"
                      value={managedAccountsSearch}
                      onChange={(event) => {
                        setManagedAccountsSearch(event.target.value);
                        setManagedAccountsOffset(0);
                      }}
                    />
                  </form>

                  {manageRoleFeedback && (
                    <p
                      className={manageRoleFeedback.ok ? styles.profileFeedback : styles.profileFeedbackError}
                      role="status"
                    >
                      {manageRoleFeedback.text}
                    </p>
                  )}

                  {isLoadingManagedAccounts ? (
                    <p className={styles.accountLoading}>Chargement des comptes...</p>
                  ) : managedAccounts.length === 0 ? (
                    <div className={styles.emptyRequestQueue}>
                      Aucun compte trouvé.
                    </div>
                  ) : (
                    <div className={styles.managedAccountList}>
                      {managedAccounts.map((account) => {
                        const canPromoteAccount =
                          profile?.role === "super_admin" &&
                          (account.role === "tenant" || account.role === "real_estate_agent") &&
                          account.role_request_status !== "pending";
                        const canDemoteAccount =
                          account.role === "real_estate_agent" ||
                          (profile?.role === "super_admin" && account.role === "admin");

                        return (
                        <article key={account.user_id} className={styles.managedAccount}>
                          <div className={styles.managedAccountIdentity}>
                            <span className={styles.requestAvatar} aria-hidden="true">
                              {(account.first_names || account.email || "?").charAt(0).toUpperCase()}
                            </span>
                            <div>
                              <h3>{account.first_names} {account.last_name}</h3>
                              <p>{account.email}</p>
                            </div>
                          </div>
                          <span className={styles.managedRole}>
                            {USER_ROLE_LABELS[account.role]}
                          </span>
                          <div className={styles.managedRoleActions}>
                            {account.role_request_status === "pending" && (
                              <button
                                className={styles.reviewRequestButton}
                                type="button"
                                disabled={changingManagedRoleUserId !== null}
                                onClick={() => setActiveSection("agent_requests")}
                              >
                                Examiner la demande <ArrowRight size={15} aria-hidden="true" />
                              </button>
                            )}
                            {canPromoteAccount && (
                              <button
                                className={styles.approveButton}
                                type="button"
                                disabled={
                                  changingManagedRoleUserId !== null ||
                                  account.user_id === user.id
                                }
                                onClick={() => handlePromoteAccount(account)}
                              >
                                {changingManagedRoleUserId === account.user_id
                                  ? "Traitement..."
                                  : "Promouvoir Admin"}
                              </button>
                            )}
                            {canDemoteAccount && (
                              <button
                                className={styles.rejectButton}
                                type="button"
                                disabled={
                                  changingManagedRoleUserId !== null ||
                                  account.user_id === user.id
                                }
                                onClick={() => void handleDemoteAccount(account)}
                              >
                                {changingManagedRoleUserId === account.user_id
                                  ? "Traitement..."
                                  : "Passer Locataire"}
                              </button>
                            )}
                            {!canPromoteAccount &&
                              !canDemoteAccount &&
                              account.role_request_status !== "pending" && (
                                <span className={styles.roleLocked}>
                                  {account.role === "super_admin"
                                    ? "Rôle protégé"
                                    : "Aucune action disponible"}
                                </span>
                              )}
                          </div>
                        </article>
                        );
                      })}
                    </div>
                  )}

                  <div className={styles.pagination}>
                    {managedAccountsOffset > 0 && (
                      <button
                        className={styles.cancelAction}
                        type="button"
                        disabled={isLoadingManagedAccounts}
                        onClick={() => setManagedAccountsOffset((offset) => Math.max(0, offset - 20))}
                      >
                        Précédent
                      </button>
                    )}
                    <span>Page {Math.floor(managedAccountsOffset / 20) + 1}</span>
                    {hasMoreManagedAccounts && (
                      <button
                        className={styles.cancelAction}
                        type="button"
                        disabled={isLoadingManagedAccounts}
                        onClick={() => setManagedAccountsOffset((offset) => offset + 20)}
                      >
                        Suivant
                      </button>
                    )}
                  </div>
                </section>
              ) : (
                <div>
                  <div className={styles.sectionTop}>
                    <div className={styles.sectionHeading}>
                      <span className={styles.sectionEyebrow}>Préférences</span>
                      <h2>Notifications</h2>
                      <p>Choisissez si vous souhaitez recevoir des nouvelles d’ENAFIM par e-mail.</p>
                    </div>
                  </div>
                  {isProfileLoading || !profile ? (
                    <p className={styles.accountLoading}>Chargement des préférences...</p>
                  ) : (
                    <div className={styles.notificationPreference}>
                      <div>
                        <h3>Notifications par e-mail</h3>
                        <p>Votre choix est conservé dans votre compte.</p>
                      </div>
                      <button type="button" role="switch" aria-checked={profile.email_notifications} aria-label="Notifications par e-mail" className={`${styles.notificationToggle} ${profile.email_notifications ? styles.notificationEnabled : ""}`} disabled={isSavingNotifications} onClick={handleNotificationsToggle}>
                        <span />
                      </button>
                      {notificationFeedback && (
                        <p
                          className={notificationFeedback.ok ? styles.profileFeedback : styles.profileFeedbackError}
                          role="status"
                        >
                          {notificationFeedback.text}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </section>

            <section className={styles.quick} aria-label="Accès rapide">
              <span className={styles.sectionEyebrow}>Accès rapide</span>
              <div className={styles.quickGrid}>
                <Link href="/annonces" className={styles.quickCard}>
                  <span className={styles.quickIcon}>
                    <SearchIcon size={22} aria-hidden="true" />
                  </span>
                  <span className={styles.quickText}>
                    <strong>Rechercher un bien</strong>
                    <small>Appartements, maisons, villas et terrains à Conakry</small>
                  </span>
                  <ArrowRight className={styles.quickArrow} size={18} aria-hidden="true" />
                </Link>
                <Link href="/multiservices" className={styles.quickCard}>
                  <span className={styles.quickIcon}>
                    <Wrench size={22} aria-hidden="true" />
                  </span>
                  <span className={styles.quickText}>
                    <strong>Nos multiservices</strong>
                    <small>Les services ENAFIM pour vos projets</small>
                  </span>
                  <ArrowRight className={styles.quickArrow} size={18} aria-hidden="true" />
                </Link>
                <button
                  type="button"
                  className={styles.quickCard}
                  onClick={() =>
                    openContact(
                      "Bonjour ENAFIM Guinée, je souhaite parler à un conseiller.",
                    )
                  }
                >
                  <span className={styles.quickIcon}>
                    <Phone size={22} aria-hidden="true" />
                  </span>
                  <span className={styles.quickText}>
                    <strong>Parler à un conseiller</strong>
                    <small>Appel ou WhatsApp, réponse rapide</small>
                  </span>
                  <ArrowRight className={styles.quickArrow} size={18} aria-hidden="true" />
                </button>
              </div>
            </section>
          </>
        ) : (
          <section className={styles.authPanel}>
            <AccountForms confirmationError={confirmationError} />
          </section>
        )}
      </div>
    </main>
  );
}