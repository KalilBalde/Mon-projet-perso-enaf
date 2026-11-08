"use client";

import { useEffect, useState } from "react";
import { Home, RotateCcw } from "lucide-react";
import HeroSection from "../components/home/HeroSection";
import StatsSection from "../components/home/StatsSection";
import FeaturesSection from "../components/home/FeaturesSection";
import ViewAllButton from "../components/shared/ViewAllButton";
import ListingsCarousel from "../components/shared/ListingsCarousel";
import ListingRecommendations from "../components/shared/ListingRecommendations";
import { RESET_LISTING_FILTERS_EVENT } from "../data/constants";
import { listingRepository } from "../lib/listings/repository";
import { fetchPublishedListings } from "../lib/listings/database";
import type { Listing, SearchFilters } from "../types";

const DEFAULT_FILTERS: SearchFilters = {
  type: "Tous types",
  quartier: "",
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
  const [databaseListings, setDatabaseListings] = useState<Listing[]>([]);

  useEffect(() => {
    let active = true;

    void fetchPublishedListings().then((listings) => {
      if (active) {
        setDatabaseListings(listings);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  const filteredListings = listingRepository.findAll({
    type: activeFilters.type,
    quartier: activeFilters.quartier.trim(),
    budgetMax: parseBudget(activeFilters.budgetMax),
  }, databaseListings);

  const hasActiveSearch =
    activeFilters.type !== "Tous types" ||
    activeFilters.quartier.trim() !== "" ||
    activeFilters.budgetMax.trim() !== "";

  const handleResetFilters = () => {
    setActiveFilters(DEFAULT_FILTERS);
    setResetVersion((currentVersion) => currentVersion + 1);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const resetFiltersFromLogo = () => {
      setActiveFilters(DEFAULT_FILTERS);
      setResetVersion((currentVersion) => currentVersion + 1);
    };

    window.addEventListener(RESET_LISTING_FILTERS_EVENT, resetFiltersFromLogo);
    return () => window.removeEventListener(RESET_LISTING_FILTERS_EVENT, resetFiltersFromLogo);
  }, []);

  return (
    <>
      <HeroSection
        key={resetVersion}
        onSearch={setActiveFilters}
      />

      <section
        id="listings"
        style={{
          padding: "32px 24px 48px",
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
            gap: 16px;
            margin-bottom: 22px;
          }

          .listings-heading-main {
            display: flex;
            flex: 1;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            min-width: 0;
          }

          .listings-heading-title {
            min-width: 0;
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

          @media (max-width: 768px) {
            #listings {
              padding-right: 16px !important;
              padding-left: 16px !important;
            }

            .listings-heading {
              flex-direction: column;
              align-items: stretch;
              gap: 10px;
              margin-bottom: 16px;
            }

            .listings-heading-main {
              width: 100%;
            }

            .listings-heading-actions {
              justify-content: flex-start;
              flex-wrap: wrap;
              gap: 5px;
              width: 100%;
            }

            .reset-filters-button {
              width: auto;
              min-height: 34px;
              padding: 0 8px;
              font-size: 10px;
            }

            .reset-filters-label {
              display: inline;
            }
          }
        `}</style>

        <div
          style={{
            width: "100%",
            maxWidth: 1440,
            margin: "0 auto",
          }}
        >
          <div className="listings-heading">
            <div className="listings-heading-main">
              <div className="listings-heading-title">
              <span
                style={{
                  display: "block",
                  marginBottom: 5,
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
                  fontSize: "clamp(22px, 4vw, 38px)",
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
                  : "Annonces en vedette"}
              </h2>
              </div>
              <ViewAllButton />
            </div>

            <div className="listings-heading-actions">
              {hasActiveSearch && (
                <>
                  <button
                    type="button"
                    className="reset-filters-button"
                    aria-label="Réinitialiser les filtres"
                    title="Réinitialiser les filtres"
                    onClick={handleResetFilters}
                  >
                    <RotateCcw size={14} />
                    <span className="reset-filters-label">Réinitialiser les filtres</span>
                  </button>
                  <button
                    type="button"
                    className="reset-filters-button"
                    aria-label="Retour à l’accueil"
                    title="Retour à l’accueil"
                    onClick={handleResetFilters}
                  >
                    <Home size={14} />
                    <span className="reset-filters-label">Retour à l’accueil</span>
                  </button>
                </>
              )}

            </div>
          </div>

          <ListingsCarousel
            listings={filteredListings}
            isFiltered={hasActiveSearch}
          />
        </div>
      </section>

      <StatsSection />
      <FeaturesSection />
      <ListingRecommendations
        listings={listingRepository.findAll({ limit: 10 }, databaseListings)}
        title="Annonces récentes"
      />
    </>
  );
}