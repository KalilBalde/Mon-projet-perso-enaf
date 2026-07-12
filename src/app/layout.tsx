import type { Metadata } from "next";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

export const metadata: Metadata = {
  title: "ENAFIM Guinée",
  description: "Entreprise Africaine de l'Immobilier et du Multiservices. Location, achat, vente et services a Conakry.",
};

const GLOBAL_CSS = `* { margin: 0; padding: 0; box-sizing: border-box; } .desktop-nav { display: flex !important; } .mobile-menu-btn { display: none !important; } .search-bar-inner { flex-wrap: nowrap; } @media (max-width: 768px) { .desktop-nav { display: none !important; } .mobile-menu-btn { display: flex !important; } .search-bar-inner { flex-direction: column !important; } .listings-grid { grid-template-columns: 1fr !important; } } @media (min-width: 769px) and (max-width: 1024px) { .listings-grid { grid-template-columns: repeat(2, 1fr) !important; } } input::placeholder { color: #b0bec5; font-weight: 400; } input:focus { border-color: #1a6dd4 !important; outline: none; }`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
      </head>
      <body style={{ minHeight: "100vh", background: "#fff" }}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
