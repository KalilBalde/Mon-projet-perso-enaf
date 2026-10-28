import type { Metadata } from "next";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { ContactModalProvider } from "../components/contact/ContactModal";

export const metadata: Metadata = {
  title: "ENAFIM Guinée",
  description:
    "Entreprise Africaine de l'Immobilier et du Multiservices. Location, achat, vente et services à Conakry.",
};

const GLOBAL_CSS = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    overflow-x: hidden;
  }

  body {
    min-width: 320px;
    overflow-x: hidden;
  }

  .desktop-nav {
    display: flex !important;
  }

  .mobile-navbar-actions {
    display: none;
  }

  .mobile-menu-btn {
    display: none;
  }

  .navbar-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    width: 100%;
    max-width: 1280px;
    height: 78px;
    margin: 0 auto;
    padding: 0 22px;
  }

  .navbar-brand {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    gap: 11px;
    color: #0a2e5c;
    text-decoration: none;
  }

  .navbar-logo {
    width: auto;
    height: 48px;
    border-radius: 7px;
    object-fit: contain;
  }

  .navbar-brand-text {
    display: flex;
    flex-direction: column;
    line-height: 1.05;
  }

  .navbar-brand-text strong {
    color: #0a2e5c;
    font-family: "Playfair Display", serif;
    font-size: 23px;
    font-weight: 800;
  }

  .navbar-brand-text small {
    margin-top: 3px;
    color: #78889c;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  .navbar-navigation {
    display: flex !important;
    align-items: center;
    gap: 3px;
  }

  .navbar-link {
    padding: 9px 13px;
    border-radius: 8px;
    color: #0a2e5c;
    font-size: 13px;
    font-weight: 600;
    text-decoration: none;
    white-space: nowrap;
  }

  .navbar-link:hover {
    background: #f0f6ff;
    color: #1a6dd4;
  }

  .navbar-actions {
    display: flex !important;
    align-items: center;
    gap: 9px;
  }

  .navbar-phone,
  .navbar-outline-button,
  .navbar-account-button {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    white-space: nowrap;
    text-decoration: none;
  }

  .navbar-phone {
    color: #66788e;
    font-size: 12px;
  }

  .navbar-outline-button {
    padding: 9px 12px;
    border: 1px solid #d0dbe8;
    border-radius: 9px;
    color: #0a2e5c;
    font-size: 12px;
    font-weight: 700;
  }

  .navbar-account-button {
    padding: 10px 13px;
    border-radius: 9px;
    background: #0a2e5c;
    color: #fff;
    font-size: 12px;
    font-weight: 700;
  }

  .mobile-menu-panel {
    display: none;
  }

  @media (max-width: 1050px) and (min-width: 769px) {
    .navbar-inner {
      gap: 12px;
      padding: 0 16px;
    }

    .navbar-link {
      padding-right: 8px;
      padding-left: 8px;
      font-size: 12px;
    }

    .navbar-phone {
      display: none;
    }
  }

  @media (max-width: 768px) {
    .desktop-nav {
      display: none !important;
    }

    .navbar-inner {
      height: 82px;
      gap: 10px;
      padding: 0 12px 0 10px;
    }

    .navbar-brand {
      min-width: 0;
      gap: 9px;
    }

    .navbar-logo {
      width: 60px;
      height: 60px;
      border-radius: 9px;
    }

    .navbar-brand-text strong {
      font-size: 21px;
      line-height: 1;
    }

    .navbar-brand-text small {
      margin-top: 4px;
      font-size: 9.5px;
      letter-spacing: 1px;
    }

    .mobile-navbar-actions {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-left: auto;
    }

    .mobile-quick-link {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      min-height: 38px;
      padding: 8px 9px;
      border: 1px solid #dce5ef;
      border-radius: 9px;
      background: #fff;
      color: #0a2e5c;
      font-size: 10px;
      font-weight: 700;
      text-decoration: none;
      white-space: nowrap;
    }

    .mobile-services-link {
      border-color: #c8def5;
      background: #f1f7ff;
      color: #1a6dd4;
    }

    .mobile-space-link {
      background: #0a2e5c;
      color: #fff;
    }

    .mobile-menu-btn {
      display: flex !important;
      align-items: center;
      justify-content: center;
      width: 38px;
      height: 38px;
      padding: 0;
      border: 1px solid #dce5ef;
      border-radius: 9px;
      background: #fff;
      cursor: pointer;
    }

    .mobile-menu-panel {
      display: block;
      padding: 8px 16px 18px;
      border-top: 1px solid #eef2f6;
      background: #fff;
    }

    .mobile-menu-link {
      display: block;
      padding: 13px 2px;
      border-bottom: 1px solid #f0f3f7;
      color: #0a2e5c;
      font-size: 14px;
      font-weight: 600;
      text-decoration: none;
    }

    .mobile-menu-home {
      color: #1a6dd4;
    }

    .mobile-menu-secondary-button,
    .mobile-menu-primary-button {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 7px;
      width: 100%;
      margin-top: 10px;
      padding: 12px;
      border-radius: 9px;
      font-size: 13px;
      font-weight: 700;
      text-align: center;
      text-decoration: none;
    }

    .mobile-menu-secondary-button {
      background: #f0f6ff;
      color: #0a2e5c;
    }

    .mobile-menu-primary-button {
      background: #0a2e5c;
      color: #fff;
    }
  }

  @media (max-width: 390px) {
    .navbar-inner {
      height: 78px;
      gap: 7px;
      padding-right: 8px;
      padding-left: 7px;
    }

    .navbar-logo {
      width: 56px;
      height: 56px;
    }

    .navbar-brand {
      gap: 7px;
    }

    .navbar-brand-text strong {
      font-size: 19px;
    }

    .navbar-brand-text small {
      font-size: 8.5px;
    }

    .mobile-navbar-actions {
      gap: 4px;
    }

    .mobile-quick-link {
      gap: 3px;
      min-height: 36px;
      padding: 7px 6px;
      font-size: 9px;
    }

    .mobile-menu-btn {
      width: 36px;
      height: 36px;
    }
  }
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&family=DM+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />

        <style
          dangerouslySetInnerHTML={{
            __html: GLOBAL_CSS,
          }}
        />
      </head>

      <body>
        <ContactModalProvider>
          <Navbar />
          {children}
          <Footer />
        </ContactModalProvider>
      </body>
    </html>
  );
}