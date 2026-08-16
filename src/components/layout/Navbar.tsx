// ============================================================
// FICHIER : src/components/layout/Navbar.tsx
// ============================================================

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Info, Menu, Phone, User, Wrench, X } from "lucide-react";
import { LOGO_SRC, NAV_LINKS } from "../../data/constants";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
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
          <a href="tel:+224620417563" className="navbar-phone">
            <Phone size={14} />
            <span>+224 620 41 75 63</span>
          </a>

          <Link
            href="#nous-connaitre"
            className="navbar-outline-button"
          >
            <Info size={14} />
            <span>Nous connaître</span>
          </Link>

          <Link
            href="#espace-personnel"
            className="navbar-account-button"
          >
            <User size={14} />
            <span>Mon espace</span>
          </Link>
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

          <Link
            href="#espace-personnel"
            className="mobile-quick-link mobile-space-link"
            aria-label="Ouvrir mon espace personnel"
            title="Mon espace"
            onClick={closeMobileMenu}
          >
            <User size={17} />
            <span>Mon espace</span>
          </Link>

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

          <a
            href="tel:+224620417563"
            className="mobile-menu-primary-button"
            onClick={closeMobileMenu}
          >
            <Phone size={16} />
            Appeler ENAFIM
          </a>
        </div>
      )}
    </nav>
  );
}