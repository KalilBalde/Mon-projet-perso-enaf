"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";
import {
  Bell,
  Building2,
  ClipboardCheck,
  ChevronRight,
  Heart,
  LogOut,
  MessageCircle,
  Plus,
  ShieldCheck,
  UserCog,
  UserRound,
  X,
  type LucideIcon,
} from "lucide-react";
import { LOGO_SRC } from "../../data/constants";
import { getFavoriteIds } from "../../lib/favorites/storage";
import {
  getProfile,
  listPendingLandlordRequests,
} from "../../lib/profiles/repository";
import {
  hasPermission,
  USER_ROLE_LABELS,
  type UserRole,
} from "../../lib/auth/permissions";
import { createClient } from "../../lib/supabase/client";
import AccountForms from "../../app/mon-espace/AccountForms";
import { useContactModal } from "../contact/ContactModal";
import styles from "./AccountModal.module.css";

export default function AccountModal({
  isOpen,
  onClose,
  user,
  authReady,
}: {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  authReady: boolean;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const { openContact } = useContactModal();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState("");
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [pendingLandlordCount, setPendingLandlordCount] = useState<number | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const firstNames =
    (user?.user_metadata?.first_names as string | undefined) ?? "";
  const lastName =
    (user?.user_metadata?.last_name as string | undefined) ?? "";
  const fullName = user?.user_metadata?.full_name as string | undefined;
  const greetingName =
    firstNames.split(/\s+/)[0] || fullName || user?.email || "Membre ENAFIM";
  const initials =
    `${firstNames.charAt(0)}${lastName.charAt(0)}`.toUpperCase() ||
    user?.email?.charAt(0).toUpperCase() ||
    "E";

  const openAccountSection = (
    section:
      | "favorites"
      | "profile"
      | "notifications"
      | "my_listings"
      | "submit_listing"
      | "listing_review"
      | "landlord_requests"
      | "role_management",
  ) => {
    onClose();
    router.push(`/mon-espace?section=${section}`);
  };

  const openAgencyContact = () => {
    onClose();
    window.setTimeout(() => {
      openContact("Bonjour ENAFIM Guinée, je vous contacte depuis mon espace personnel.");
    }, 100);
  };

  const menuItems: {
    Icon: LucideIcon;
    label: string;
    hint: string;
    count?: number;
    onSelect: () => void;
  }[] = [
    {
      Icon: Heart,
      label: "Mes favoris",
      hint: "Vos annonces enregistrées",
      count: favoritesCount,
      onSelect: () => openAccountSection("favorites"),
    },
    {
      Icon: MessageCircle,
      label: "Écrire à l’agence",
      hint: "Appel ou WhatsApp",
      onSelect: openAgencyContact,
    },
    {
      Icon: UserRound,
      label: "Profil",
      hint: "Vos coordonnées",
      onSelect: () => openAccountSection("profile"),
    },
    {
      Icon: Bell,
      label: "Notifications",
      hint: "Préférences e-mail",
      onSelect: () => openAccountSection("notifications"),
    },
    ...(userRole && hasPermission(userRole, "manage_own_listings")
      ? [
          {
            Icon: Building2,
            label: "Mes annonces",
            hint: "Suivre mes dépôts",
            onSelect: () => openAccountSection("my_listings"),
          },
          {
            Icon: Plus,
            label: "Ajouter une annonce",
            hint: "Présenter un nouveau bien",
            onSelect: () => openAccountSection("submit_listing"),
          },
        ]
      : []),
    ...(userRole && hasPermission(userRole, "review_listings")
      ? [
          {
            Icon: ClipboardCheck,
            label: "Annonces à valider",
            hint: "Examiner les soumissions",
            onSelect: () => openAccountSection("listing_review"),
          },
        ]
      : []),
    ...(userRole && hasPermission(userRole, "manage_users")
      ? [
          {
            Icon: ShieldCheck,
            label: "Demandes Bailleur",
            hint: "Valider les demandes",
            count: pendingLandlordCount ?? undefined,
            onSelect: () => openAccountSection("landlord_requests"),
          },
        ]
      : []),
    ...(userRole && hasPermission(userRole, "manage_roles")
      ? [
          {
            Icon: UserCog,
            label: "Gestion des rôles",
            hint: "Promouvoir un compte Admin",
            onSelect: () => openAccountSection("role_management"),
          },
        ]
      : []),
  ];

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    if (!isOpen) {
      if (dialog.open) {
        dialog.close();
      }
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();

    return () => {
      document.body.style.overflow = previousOverflow;
      if (dialog.open) {
        dialog.close();
      }
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setFavoritesCount(getFavoriteIds().length);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !user) {
      setUserRole(null);
      return;
    }

    let active = true;

    void getProfile(createClient(), user.id)
      .then((profile) => {
        if (active) {
          setUserRole(profile?.role ?? null);
        }
      })
      .catch(() => {
        if (active) {
          setUserRole(null);
        }
      });

    return () => {
      active = false;
    };
  }, [isOpen, user]);

  useEffect(() => {
    if (
      !isOpen ||
      !user ||
      !userRole ||
      !hasPermission(userRole, "manage_users")
    ) {
      setPendingLandlordCount(null);
      return;
    }

    let active = true;

    void listPendingLandlordRequests(createClient())
      .then((requests) => {
        if (active) {
          setPendingLandlordCount(requests.length);
        }
      })
      .catch(() => {
        if (active) {
          setPendingLandlordCount(null);
        }
      });

    return () => {
      active = false;
    };
  }, [isOpen, user, userRole]);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    setSignOutError("");

    try {
      const { error } = await createClient().auth.signOut();

      if (error) {
        setSignOutError("La déconnexion n’a pas abouti. Réessaie.");
      } else {
        onClose();
        router.refresh();
      }
    } catch {
      setSignOutError("La déconnexion n’a pas abouti. Réessaie.");
    } finally {
      setIsSigningOut(false);
    }
  };
  return (
    <dialog
      ref={dialogRef}
      id="account-dialog"
      className={styles.dialog}
      aria-labelledby="account-dialog-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      {authReady && user ? (
        <header className={styles.memberHeader}>
          <button
            className={`${styles.closeButton} ${styles.closeButtonMember}`}
            type="button"
            aria-label="Fermer la fenêtre"
            onClick={onClose}
          >
            <X size={20} aria-hidden="true" />
          </button>
          <span className={styles.avatar} aria-hidden="true">
            {initials}
          </span>
          <span className={styles.status}>
            <i /> Connecté
          </span>
          {userRole && (
            <span className={styles.roleBadge}>
              {USER_ROLE_LABELS[userRole]}
            </span>
          )}
          <h1 id="account-dialog-title">Bonjour, {greetingName}</h1>
          <p>{user.email}</p>
        </header>
      ) : (
        <header className={styles.header}>
          <div className={styles.brand}>
            <img src={LOGO_SRC} alt="ENAFIM Guinée" />
          </div>
          <button
            className={styles.closeButton}
            type="button"
            aria-label="Fermer la fenêtre"
            onClick={onClose}
          >
            <X size={20} aria-hidden="true" />
          </button>
        </header>
      )}

      <div className={authReady && user ? styles.contentMember : styles.content}>
        {!authReady ? (
          <section className={styles.sessionCheck} aria-live="polite">
            <h1 id="account-dialog-title">Vérification de votre compte</h1>
            <p>Un instant, nous vérifions votre session.</p>
          </section>
        ) : user ? (
          <section className={styles.memberPanel}>
            <nav className={styles.menu} aria-label="Actions du compte">
              {menuItems.map(({ Icon, label, hint, count, onSelect }) => (
                <button
                  key={label}
                  className={styles.menuItem}
                  type="button"
                  onClick={onSelect}
                >
                  <span className={styles.menuIcon}>
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <span className={styles.menuText}>
                    <strong>{label}</strong>
                    <small>{hint}</small>
                  </span>
                  {count !== undefined ? (
                    <span className={styles.badge}>{count}</span>
                  ) : null}
                  <ChevronRight
                    className={styles.menuChevron}
                    size={18}
                    aria-hidden="true"
                  />
                </button>
              ))}
            </nav>
            {signOutError && (
              <p className={styles.signOutError} role="alert">
                {signOutError}
              </p>
            )}
            <button
              className={styles.signOutButton}
              type="button"
              disabled={isSigningOut}
              onClick={handleSignOut}
            >
              <LogOut size={17} aria-hidden="true" />
              {isSigningOut ? "Déconnexion..." : "Se déconnecter"}
            </button>
          </section>
        ) : (
          <AccountForms
            confirmationError={false}
            onAuthenticated={onClose}
            variant="modal"
          />
        )}
      </div>
    </dialog>
  );
}