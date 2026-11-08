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
    /* clip, not hidden: hidden makes body a scroll container and breaks position: sticky. */
    overflow-x: clip;
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

  .navbar-authenticated {
    background: #123954;
  }

  .navbar-auth-status {
    padding-left: 7px;
    border-left: 1px solid rgba(255, 255, 255, 0.35);
    color: #b7ead7;
    font-size: 10px;
    font-weight: 800;
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

  @media (max-width: 900px) {
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

    .mobile-space-authenticated {
      border-color: #b9ded5;
      background: #123954;
    }

    .mobile-auth-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #6bd0a7;
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

  @media (max-width: 900px) and (orientation: landscape) {
    .navbar-inner {
      height: 68px;
      gap: 8px;
      padding: 0 12px;
    }

    .navbar-brand {
      gap: 7px;
    }

    .navbar-logo {
      width: 48px;
      height: 48px;
    }

    .navbar-brand-text strong {
      font-size: 19px;
    }

    .navbar-brand-text small {
      font-size: 8.5px;
    }

    .desktop-nav.navbar-navigation {
      display: flex !important;
      flex: 1 1 auto;
      justify-content: center;
      gap: 0;
      min-width: 0;
    }

    .desktop-nav.navbar-actions {
      display: flex !important;
      flex: 0 0 auto;
      gap: 6px;
    }

    .navbar-link {
      padding: 8px 7px;
      font-size: 11px;
    }

    .mobile-navbar-actions {
      display: none !important;
    }

    .navbar-outline-button {
      padding: 8px;
      font-size: 11px;
    }

    .navbar-account-button {
      padding: 8px 10px;
      font-size: 11px;
    }

    .navbar-auth-status {
      padding-left: 5px;
      font-size: 9px;
    }
  }

  @media (max-width: 390px) {
    .navbar-inner {
      height: 78px;
      gap: 4px;
      padding-right: 7px;
      padding-left: 7px;
    }

    .navbar-logo {
      width: 48px;
      height: 48px;
    }

    .navbar-brand {
      flex: 0 1 auto;
      gap: 5px;
    }

    .navbar-brand-text strong {
      font-size: 17px;
    }

    .navbar-brand-text small {
      font-size: 8px;
    }

    .mobile-navbar-actions {
      gap: 4px;
      flex: 0 0 auto;
    }

    .mobile-services-link {
      display: none !important;
    }

    .mobile-quick-link {
      gap: 3px;
      min-height: 34px;
      padding: 6px;
      font-size: 9px;
    }

    .mobile-space-link {
      min-width: 0;
      max-width: calc(100vw - 205px);
    }

    .mobile-space-link > span:first-of-type {
      max-width: calc(100vw - 245px);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .mobile-space-link > svg {
      width: 15px;
      height: 15px;
    }

    .mobile-menu-btn {
      flex: 0 0 36px;
      width: 36px;
      height: 36px;
    }
  }

  @media (max-width: 760px) and (orientation: landscape) {
    .navbar-inner {
      height: 62px;
      gap: 6px;
      padding: 0 8px;
    }

    .navbar-logo {
      width: 42px;
      height: 42px;
    }

    .navbar-brand {
      gap: 6px;
    }

    .navbar-brand-text strong {
      font-size: 17px;
    }

    .navbar-brand-text small {
      font-size: 8px;
    }

    .desktop-nav.navbar-navigation,
    .desktop-nav.navbar-actions {
      display: none !important;
    }

    .mobile-navbar-actions {
      display: flex !important;
      flex: 0 0 auto;
      gap: 6px;
      margin-left: auto;
    }

    .mobile-services-link {
      display: none !important;
    }

    .mobile-space-link {
      min-height: 36px;
      min-width: 102px;
      max-width: calc(100vw - 170px);
      gap: 5px;
      padding: 6px 8px;
      border-radius: 8px;
      font-size: 10px;
    }

    .mobile-space-link > span:first-of-type {
      display: block;
      max-width: calc(100vw - 230px);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .mobile-space-link > svg {
      width: 15px;
      height: 15px;
    }

    .mobile-menu-btn {
      display: flex !important;
      width: 36px;
      height: 36px;
    }

    .mobile-menu-panel {
      position: absolute;
      top: 100%;
      right: 8px;
      width: min(260px, calc(100vw - 16px));
      max-height: calc(100svh - 72px);
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      column-gap: 12px;
      overflow-y: auto;
      overscroll-behavior: contain;
      padding: 4px 12px 8px;
      border: 1px solid #e5ebf2;
      border-top: 0;
      border-radius: 0 0 12px 12px;
      box-shadow: 0 12px 28px rgba(10, 46, 92, 0.16);
    }

    .mobile-menu-link {
      padding: 5px 2px;
      font-size: 11px;
      line-height: 1.2;
    }

    .mobile-menu-secondary-button,
    .mobile-menu-primary-button {
      grid-column: 1 / -1;
      min-height: 30px;
      margin-top: 4px;
      padding: 5px 8px;
      font-size: 10px;
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