"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { MessageCircle, Phone, X } from "lucide-react";
import {
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
  CONTACT_PHONE_WHATSAPP,
  CONTACT_WHATSAPP_MESSAGE,
} from "../../data/constants";

interface ContactModalContextValue {
  openContact: (message?: string) => void;
}

const ContactModalContext =
  createContext<ContactModalContextValue | null>(null);

export function useContactModal(): ContactModalContextValue {
  const context = useContext(ContactModalContext);

  if (!context) {
    throw new Error(
      "useContactModal doit être utilisé dans ContactModalProvider",
    );
  }

  return context;
}

export function ContactModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState(CONTACT_WHATSAPP_MESSAGE);

  const openContact = (customMessage?: string) => {
    setMessage(customMessage ?? CONTACT_WHATSAPP_MESSAGE);
    setIsOpen(true);
  };

  const closeContact = () => setIsOpen(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () =>
      window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const whatsappHref = `https://wa.me/${CONTACT_PHONE_WHATSAPP}?text=${encodeURIComponent(
    message,
  )}`;

  return (
    <ContactModalContext.Provider value={{ openContact }}>
      {children}

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Nous contacter"
          onClick={closeContact}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
            background: "rgba(8,31,61,0.55)",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            style={{
              position: "relative",
              width: "100%",
              maxWidth: 420,
              padding: "22px 20px 24px",
              borderRadius: 18,
              background: "#fff",
              boxShadow: "0 18px 50px rgba(8,31,61,0.35)",
            }}
          >
            <button
              type="button"
              aria-label="Fermer"
              onClick={closeContact}
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 34,
                height: 34,
                border: "none",
                borderRadius: 9,
                background: "#f2f5f9",
                color: "#53657b",
                cursor: "pointer",
              }}
            >
              <X size={18} />
            </button>

            <h2
              style={{
                margin: "0 0 4px",
                color: "#0a2e5c",
                fontFamily: "'Playfair Display', serif",
                fontSize: 22,
                fontWeight: 700,
              }}
            >
              Nous contacter
            </h2>

            <p
              style={{
                margin: "0 0 18px",
                color: "#718198",
                fontSize: 13,
                lineHeight: 1.5,
              }}
            >
              Choisissez comment joindre ENAFIM Guinée.
            </p>

            <a
              href={`tel:${CONTACT_PHONE_TEL}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 10,
                padding: "14px 15px",
                borderRadius: 12,
                border: "1px solid #dce5ef",
                background: "#f7f9fc",
                color: "#0a2e5c",
                textDecoration: "none",
              }}
            >
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 42,
                  height: 42,
                  flexShrink: 0,
                  borderRadius: 11,
                  background: "#e8f0fb",
                  color: "#1a6dd4",
                }}
              >
                <Phone size={20} />
              </span>

              <span style={{ minWidth: 0 }}>
                <span
                  style={{
                    display: "block",
                    fontSize: 15,
                    fontWeight: 700,
                  }}
                >
                  Appeler
                </span>
                <span
                  style={{
                    display: "block",
                    color: "#718198",
                    fontSize: 12,
                  }}
                >
                  {CONTACT_PHONE_DISPLAY}
                </span>
              </span>
            </a>

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "14px 15px",
                borderRadius: 12,
                border: "1px solid #cdebd6",
                background: "#eafaf0",
                color: "#0a2e5c",
                textDecoration: "none",
              }}
            >
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 42,
                  height: 42,
                  flexShrink: 0,
                  borderRadius: 11,
                  background: "#25D366",
                  color: "#fff",
                }}
              >
                <MessageCircle size={20} />
              </span>

              <span style={{ minWidth: 0 }}>
                <span
                  style={{
                    display: "block",
                    fontSize: 15,
                    fontWeight: 700,
                  }}
                >
                  Contacter sur WhatsApp
                </span>
                <span
                  style={{
                    display: "block",
                    color: "#4f7a63",
                    fontSize: 12,
                  }}
                >
                  Réponse rapide par message
                </span>
              </span>
            </a>
          </div>
        </div>
      )}
    </ContactModalContext.Provider>
  );
}