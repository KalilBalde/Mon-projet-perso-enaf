import HeroSection from "../components/home/HeroSection";
import StatsSection from "../components/home/StatsSection";
import FeaturesSection from "../components/home/FeaturesSection";
import CtaSection from "../components/home/CtaSection";
import ListingCard from "../components/shared/ListingCard";
import ViewAllButton from "../components/shared/ViewAllButton";
import { LISTINGS } from "../data/listings";

/* ═══════════════════ PAGE D'ACCUEIL ═══════════════════ */

export default function HomePage() {
  return (
    <>
      <HeroSection />

      {/* ═══ DERNIERES ANNONCES - colle a la recherche ═══ */}
      <section style={{ padding: "24px 24px 48px", fontFamily: "'DM Sans', sans-serif", background: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
            <div>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#1a6dd4", textTransform: "uppercase", letterSpacing: "2px", display: "block", marginBottom: 6 }}>Decouvrir</span>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 700, color: "#0a2e5c" }}>Dernieres annonces</h2>
            </div>
            <ViewAllButton />
          </div>
          <div className="listings-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28 }}>
            {LISTINGS.map((l) => <ListingCard key={l.id} listing={l} />)}
          </div>
        </div>
      </section>

      <StatsSection />
      <FeaturesSection />
      <CtaSection />
    </>
  );
}
