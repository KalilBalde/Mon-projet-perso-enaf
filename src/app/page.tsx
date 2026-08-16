// ============================================================
// FICHIER : src/app/page.tsx
// ============================================================

"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import HeroSection from "../components/home/HeroSection";
import StatsSection from "../components/home/StatsSection";
import FeaturesSection from "../components/home/FeaturesSection";
import CtaSection from "../components/home/CtaSection";
import ViewAllButton from "../components/shared/ViewAllButton";
import ListingsCarousel from "../components/shared/ListingsCarousel";
import { listingRepository } from "../lib/listings/repository";
import type { SearchFilters } from "../types";

const DEFAULT_FILTERS: SearchFilters = {
  type: "Tous types",
  quartier: "Tous les quartiers",
  budgetMax: "",
};

function parseBudget(value: string): number | undefined {
  const digitsOnly = value.replace(/[^\d]/g, "");

  if (!digitsOnly) {
    return undefined;
  }

  const budget = Number(digitsOnly);

  return Number.isFinite(budget) && budget > 0 ? budget : undefined;
}

export default function HomePage() {
  const [activeFilters, setActiveFilters] =
    useState<SearchFilters>(DEFAULT_FILTERS);

  const [resetVersion, setResetVersion] = useState(0);

  const filteredListings = listingRepository.findAll({
    type: activeFilters.type,
    quartier: activeFilters.quartier,
    budgetMax: parseBudget(activeFilters.budgetMax),
  });

  const hasActiveSearch =
    activeFilters.type !== "Tous types" ||
    activeFilters.quartier !== "Tous les quartiers" ||
    activeFilters.budgetMax.trim() !== "";

  const handleResetFilters = () => {
    setActiveFilters(DEFAULT_FILTERS);
    setResetVersion((currentVersion) => currentVersion + 1);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <HeroSection
        key={resetVersion}
        onSearch={setActiveFilters}
      />

      <section
        id="listings"
        style={{
          padding: "24px 16px 38px",
          background: "#fff",
          fontFamily: "'DM Sans', sans-serif",
          scrollMarginTop: 82,
        }}
      >
        <style suppressHydrationWarning>{`
          .listings-heading {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            margin-bottom: 16px;
          }

          .listings-heading-actions {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            gap: 8px;
            flex-shrink: 0;
          }

          .reset-filters-button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 5px;
            min-height: 36px;
            padding: 8px 10px;
            border: 1px solid #dce5ef;
            border-radius: 8px;
            background: #f7f9fc;
            color: #53657b;
            cursor: pointer;
            font-family: "DM Sans", sans-serif;
            font-size: 11px;
            font-weight: 700;
            white-space: nowrap;
          }

          .reset-filters-button:hover {
            border-color: #1a6dd4;
            background: #edf5ff;
            color: #1a6dd4;
          }

          @media (max-width: 560px) {
            .listings-heading {
              align-items: flex-start;
              gap: 8px;
            }

            .listings-heading-actions {
              gap: 5px;
            }

            .reset-filters-button {
              width: 36px;
              padding: 0;
            }

            .reset-filters-label {
              display: none;
            }
          }
        `}</style>

        <div
          style={{
            width: "100%",
            maxWidth: 1180,
            margin: "0 auto",
          }}
        >
          <div className="listings-heading">
            <div style={{ minWidth: 0 }}>
              <span
                style={{
                  display: "block",
                  marginBottom: 4,
                  color: "#1a6dd4",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                }}
              >
                {hasActiveSearch ? "Résultats" : "Découvrir"}
              </span>

              <h2
                style={{
                  margin: 0,
                  overflow: "hidden",
                  color: "#0a2e5c",
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(22px, 6vw, 38px)",
                  lineHeight: 1.1,
                  fontWeight: 700,
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {hasActiveSearch
                  ? `${filteredListings.length} bien${
                      filteredListings.length > 1 ? "s" : ""
                    } trouvé${
                      filteredListings.length > 1 ? "s" : ""
                    }`
                  : "Dernières annonces"}
              </h2>
            </div>

            <div className="listings-heading-actions">
              {hasActiveSearch && (
                <button
                  type="button"
                  className="reset-filters-button"
                  aria-label="Réinitialiser les filtres"
                  title="Réinitialiser les filtres"
                  onClick={handleResetFilters}
                >
                  <RotateCcw size={14} />
                  <span className="reset-filters-label">
                    Réinitialiser la recherche
                  </span>
                </button>
              )}

              <ViewAllButton />
            </div>
          </div>

          <ListingsCarousel listings={filteredListings} />
        </div>
      </section>

      <StatsSection />
      <FeaturesSection />
      <CtaSection />
    </>
  );
}