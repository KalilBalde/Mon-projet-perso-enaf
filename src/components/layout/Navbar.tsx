// ============================================================
// FICHIER : src/components/layout/Navbar.tsx
// ============================================================

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Info, Menu, Phone, User, Wrench, X } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { LOGO_SRC, NAV_LINKS } from "../../data/constants";
import { createClient } from "../../lib/supabase/client";
import AccountModal from "./AccountModal";
import { useContactModal } from "../contact/ContactModal";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<SupabaseUser | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const { openContact } = useContactModal();

  const firstName = currentUser?.user_metadata?.first_names
    ?.split(/\s+/)[0];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    let active = true;

    try {
      const supabase = createClient();
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        if (active) {
          setCurrentUser(session?.user ?? null);
          setAuthReady(true);
        }
      });

      supabase.auth.getUser().then(({ data }) => {
        if (active) {
          setCurrentUser(data.user);
          setAuthReady(true);
        }
      }).catch(() => {
        if (active) {
          setCurrentUser(null);
          setAuthReady(true);
        }
      });

      return () => {
        active = false;
        subscription.unsubscribe();
      };
    } catch {
      setAuthReady(true);
    }
  }, []);

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        left: 0,
        zIndex: 1000,
        borderBottom: "1px solid #e5ebf2",
        background: "#fff",
        boxShadow: scrolled
          ? "0 3px 18px rgba(10,46,92,0.10)"
          : "0 1px 5px rgba(10,46,92,0.04)",
        transition: "box-shadow 0.25s ease",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div className="navbar-inner">
        <Link
          href="/"
          className="navbar-brand"
          aria-label="Retour à l'accueil ENAFIM Guinée"
          onClick={closeMobileMenu}
        >
          <img
            src={LOGO_SRC}
            alt="ENAFIM Guinée"
            className="navbar-logo"
          />

          <span className="navbar-brand-text">
            <strong>ENAFIM</strong>
            <small>Guinée</small>
          </span>
        </Link>

        <div className="desktop-nav navbar-navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="navbar-link"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="desktop-nav navbar-actions">
          <button
            type="button"
            className="navbar-phone"
            onClick={() => openContact()}
            style={{
              border: "none",
              background: "none",
              cursor: "pointer",
              font: "inherit",
            }}
          >
            <Phone size={14} />
            <span>+224 627 04 02 80</span>
          </button>

          <Link
            href="#nous-connaitre"
            className="navbar-outline-button"
          >
            <Info size={14} />
            <span>Nous connaître</span>
          </Link>

          <button
            type="button"
            className={`navbar-account-button${currentUser ? " navbar-authenticated" : ""}`}
            aria-haspopup="dialog"
            aria-controls="account-dialog"
            aria-expanded={accountOpen}
            aria-label={currentUser ? "Mon compte, connecté" : "Mon espace"}
            onClick={() => setAccountOpen(true)}
            style={{ border: "none", cursor: "pointer", font: "inherit" }}
          >
            <User size={14} />
            <span>{currentUser ? firstName || "Mon compte" : "Mon espace"}</span>
            {currentUser && <span className="navbar-auth-status">Connecté</span>}
          </button>
        </div>

        <div className="mobile-navbar-actions">
          <Link
            href="/multiservices"
            className="mobile-quick-link mobile-services-link"
            aria-label="Ouvrir les multiservices"
            title="Multiservices"
            onClick={closeMobileMenu}
          >
            <Wrench size={17} />
            <span>Services</span>
          </Link>

          <button
            type="button"
            className={`mobile-quick-link mobile-space-link${currentUser ? " mobile-space-authenticated" : ""}`}
            aria-label={currentUser ? "Ouvrir mon compte, connecté" : "Ouvrir mon espace personnel"}
            title="Mon espace"
            aria-haspopup="dialog"
            aria-controls="account-dialog"
            aria-expanded={accountOpen}
            onClick={() => {
              closeMobileMenu();
              setAccountOpen(true);
            }}
            style={{ border: "none", cursor: "pointer", font: "inherit" }}
          >
            <User size={17} />
            <span>{currentUser ? "Compte" : "Mon espace"}</span>
            {currentUser && <span className="mobile-auth-dot" aria-label="Connecté" />}
          </button>

          <button
            type="button"
            className="mobile-menu-btn"
            aria-label={
              mobileOpen ? "Fermer le menu" : "Ouvrir le menu"
            }
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((isOpen) => !isOpen)}
          >
            {mobileOpen ? (
              <X size={22} color="#0a2e5c" />
            ) : (
              <Menu size={22} color="#0a2e5c" />
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="mobile-menu-panel">
          <Link
            href="/"
            className="mobile-menu-link mobile-menu-home"
            onClick={closeMobileMenu}
          >
            Accueil
          </Link>

          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="mobile-menu-link"
              onClick={closeMobileMenu}
            >
              {link.label}
            </Link>
          ))}

          <a
            href="#nous-connaitre"
            className="mobile-menu-secondary-button"
            onClick={closeMobileMenu}
          >
            Nous connaître
          </a>

          <button
            type="button"
            className="mobile-menu-primary-button"
            style={{
              border: "none",
              cursor: "pointer",
              font: "inherit",
            }}
            onClick={() => {
              closeMobileMenu();
              openContact();
            }}
          >
            <Phone size={16} />
            Nous contacter
          </button>
        </div>
      )}

      <AccountModal
        isOpen={accountOpen}
        onClose={() => setAccountOpen(false)}
        user={currentUser}
        authReady={authReady}
      />
    </nav>
  );
}