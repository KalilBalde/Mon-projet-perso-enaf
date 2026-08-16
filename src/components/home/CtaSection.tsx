"use client";

import { ArrowRight, Phone } from "lucide-react";

export default function CtaSection() {
  return (
    <section
      style={{
        padding: "24px 16px 32px",
        background: "#fff",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div
        className="cta-panel"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 28,
          maxWidth: 1180,
          margin: "0 auto",
          padding: "25px 30px",
          borderRadius: 16,
          background:
            "linear-gradient(115deg, #0a2e5c 0%, #123f78 100%)",
          color: "#fff",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 14,
            minWidth: 0,
          }}
        >
          <div
            className="cta-icon"
            style={{
              display: "flex",
              flexShrink: 0,
              alignItems: "center",
              justifyContent: "center",
              width: 42,
              height: 42,
              borderRadius: 11,
              background: "rgba(255,255,255,0.12)",
              color: "#7bb7ff",
            }}
          >
            <Phone size={20} />
          </div>

          <div style={{ minWidth: 0 }}>
            <span
              style={{
                display: "block",
                marginBottom: 4,
                color: "#7bb7ff",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
              }}
            >
              Votre projet immobilier
            </span>

            <h2
              style={{
                margin: 0,
                color: "#fff",
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(21px, 4vw, 32px)",
                lineHeight: 1.15,
              }}
            >
              Vous vendez votre bien ?
            </h2>

            <p
              style={{
                margin: "7px 0 0",
                color: "rgba(255,255,255,0.7)",
                fontSize: 13,
                lineHeight: 1.5,
              }}
            >
              Confiez votre bien à une équipe qui connaît le marché local.
            </p>
          </div>
        </div>

        <a
          href="tel:+224620417563"
          style={{
            display: "inline-flex",
            flexShrink: 0,
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            minHeight: 42,
            padding: "10px 16px",
            borderRadius: 9,
            background: "#fff",
            color: "#0a2e5c",
            textDecoration: "none",
            fontSize: 13,
            fontWeight: 700,
            whiteSpace: "nowrap",
          }}
        >
          Nous contacter
          <ArrowRight size={15} />
        </a>
      </div>

      <style suppressHydrationWarning>{`
        .cta-panel a {
          transition: background 0.2s ease, color 0.2s ease;
        }

        .cta-panel a:hover {
          background: #dcecff !important;
          color: #1a6dd4 !important;
        }

        @media (max-width: 600px) {
          .cta-panel {
            align-items: flex-start !important;
            flex-direction: column !important;
            gap: 18px !important;
            padding: 20px !important;
          }

          .cta-panel a {
            width: 100%;
          }
        }

        @media (max-width: 360px) {
          .cta-icon {
            display: none !important;
          }

          .cta-panel {
            padding: 18px !important;
          }
        }
      `}</style>
    </section>
  );
}