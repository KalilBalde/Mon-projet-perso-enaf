"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import { LOGO_SRC } from "../../data/constants";
import { useContactModal } from "../contact/ContactModal";

const FOOTER_LINKS = [
  { label: "Accueil", href: "/" },
  { label: "Acheter", href: "#acheter" },
  { label: "Louer", href: "#louer" },
  { label: "Vendre", href: "#vendre" },
  { label: "Multiservices", href: "/multiservices" },
];

export default function Footer() {
  const { openContact } = useContactModal();

  return (
    <footer
      style={{
        background: "#081f3d",
        color: "#fff",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <style suppressHydrationWarning>{`
        .compact-footer-main {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 32px;
          max-width: 1180px;
          margin: 0 auto;
          padding: 28px 24px;
        }

        .compact-footer-brand {
          display: flex;
          flex-shrink: 0;
          align-items: center;
          gap: 10px;
        }

        .compact-footer-nav {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 22px;
          flex-wrap: wrap;
        }

        .compact-footer-nav a,
        .compact-footer-contact a {
          color: rgba(255,255,255,0.72);
          font-size: 15px;
          text-decoration: none;
          white-space: nowrap;
        }

        .compact-footer-nav a:hover,
        .compact-footer-contact a:hover {
          color: #7bb7ff;
        }

        .compact-footer-contact {
          display: flex;
          flex-shrink: 0;
          align-items: center;
          gap: 18px;
        }

        .compact-footer-contact-item {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 15px;
          color: rgba(255,255,255,0.72);
        }

        .compact-footer-bottom {
          padding: 14px 18px;
          border-top: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.5);
          font-size: 13px;
          text-align: center;
        }

        @media (min-width: 851px) {
          .compact-footer-main {
            display: grid;
            grid-template-columns: 0.55fr auto 1.45fr;
            align-items: center;
            gap: 24px;
            max-width: none;
            padding: 26px 48px;
          }

          .compact-footer-brand {
            justify-self: start;
          }

          .compact-footer-nav {
            justify-self: start;
            flex-wrap: nowrap;
            gap: 44px;
          }

          .compact-footer-contact {
            justify-self: end;
          }
        }

        @media (max-width: 850px) {
          .compact-footer-main {
            gap: 18px;
            padding: 20px 16px;
          }

          .compact-footer-nav {
            gap: 10px 14px;
          }

          .compact-footer-contact {
            gap: 9px;
          }

          .compact-footer-nav a,
          .compact-footer-contact a,
          .compact-footer-contact-item {
            font-size: 13px;
          }

          .compact-footer-contact-item span {
            display: none;
          }
        }

        @media (max-width: 620px) {
          .compact-footer-main {
            display: grid;
            grid-template-columns: auto 1fr;
            align-items: center;
            gap: 18px;
          }

          .compact-footer-brand {
            grid-row: span 2;
          }

          .compact-footer-nav {
            justify-content: flex-start;
            gap: 8px 13px;
          }

          .compact-footer-contact {
            justify-content: flex-start;
          }

          .compact-footer-contact-item span {
            display: inline;
            font-size: 12px;
          }
        }

        @media (max-width: 430px) {
          .compact-footer-main {
            grid-template-columns: 1fr;
            gap: 14px;
            padding: 18px 14px;
          }

          .compact-footer-brand {
            justify-content: center;
          }

          .compact-footer-nav,
          .compact-footer-contact {
            justify-content: center;
          }

          .compact-footer-contact {
            flex-wrap: wrap;
          }
        }
      `}</style>

      <div className="compact-footer-main">
        <a
          href="/"
          className="compact-footer-brand"
          aria-label="Retour à l'accueil ENAFIM Guinée"
          style={{
            color: "#fff",
            textDecoration: "none",
          }}
        >
          <img
            src={LOGO_SRC}
            alt="ENAFIM Guinée"
            style={{
              width: 40,
              height: 40,
              padding: 2,
              borderRadius: 6,
              background: "#fff",
              objectFit: "contain",
            }}
          />

          <span
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 21,
              fontWeight: 700,
              whiteSpace: "nowrap",
            }}
          >
            ENAFIM{" "}
            <span style={{ color: "#7bb7ff" }}>
              Guinée
            </span>
          </span>
        </a>

        <nav
          className="compact-footer-nav"
          aria-label="Navigation du pied de page"
        >
          {FOOTER_LINKS.map((link) => (
            <a key={link.label} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="compact-footer-contact">
          <button
            type="button"
            className="compact-footer-contact-item"
            aria-label="Contacter ENAFIM"
            onClick={() => openContact()}
            style={{
              border: "none",
              background: "none",
              cursor: "pointer",
              font: "inherit",
            }}
          >
            <Phone size={16} color="#7bb7ff" />
            <span>+224 627 04 02 80</span>
          </button>

          <a
            href="mailto:enafimgn0225@gmail.com"
            className="compact-footer-contact-item"
            aria-label="Envoyer un email à ENAFIM"
          >
            <Mail size={16} color="#7bb7ff" />
            <span>enafimgn0225@gmail.com</span>
          </a>

          <span className="compact-footer-contact-item">
            <MapPin size={16} color="#7bb7ff" />
            <span>Conakry, Station Shell, Rond-Point T5</span>
          </span>
        </div>
      </div>

      <div className="compact-footer-bottom">
        © 2026 ENAFIM Guinée - Tous droits réservés.
      </div>
    </footer>
  );
}