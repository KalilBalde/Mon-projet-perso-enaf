"use client";

import { useState, type FormEvent } from "react";
import { ChevronUp, MapPin, SlidersHorizontal } from "lucide-react";
import { PROPERTY_TYPES } from "../../data/constants";
import type { Listing, ListingOfferType } from "../../types";
import type { ListingFilters } from "../../lib/listings/repository";
import { listingRepository } from "../../lib/listings/repository";
import ListingCard from "./ListingCard";
import styles from "./ListingsCatalog.module.css";

interface CatalogFilterValues {
  quartier: string;
  type: string;
  offerType: ListingOfferType | "";
  kitchen: "internal" | "external" | "";
  budgetMax: string;
  surfaceMin: string;
  bedroomsMin: string;
  showersMin: string;
}

const INITIAL_FILTERS: CatalogFilterValues = {
  quartier: "",
  type: "",
  offerType: "",
  kitchen: "",
  budgetMax: "",
  surfaceMin: "",
  bedroomsMin: "",
  showersMin: "",
};

function parseNumber(value: string): number | undefined {
  if (!value.trim()) return undefined;
  const parsed = Number(value.replace(",", "."));
  return Number.isFinite(parsed) ? parsed : undefined;
}

export default function ListingsCatalog({ listings }: { listings: Listing[] }) {
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const listingFilters: ListingFilters = {
    quartier: filters.quartier.trim() || undefined,
    type: filters.type || undefined,
    offerType: filters.offerType || undefined,
    kitchen: filters.kitchen || undefined,
    budgetMax: parseNumber(filters.budgetMax),
    surfaceMin: parseNumber(filters.surfaceMin),
    bedroomsMin: parseNumber(filters.bedroomsMin),
    showersMin: parseNumber(filters.showersMin),
  };
  const filteredListings = listingRepository.findAll(listingFilters, listings);
  const activeFilterCount = Object.values(filters).filter((value) => value !== "").length;

  const updateFilter = <Key extends keyof CatalogFilterValues>(
    key: Key,
    value: CatalogFilterValues[Key],
  ) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const scrollToResults = () => {
    document.getElementById("catalog-results")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsFiltersOpen(false);
    scrollToResults();
  };

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.toolbar}>
          <label className={styles.searchField}>
            <MapPin size={17} aria-hidden="true" />
            <span className={styles.searchInputScale}>
              <input
                type="search"
                value={filters.quartier}
                onChange={(event) => updateFilter("quartier", event.target.value)}
                placeholder="Ex. Kagbelen"
                aria-label="Rechercher un quartier"
              />
            </span>
          </label>

          <details
            className={styles.details}
            open={isFiltersOpen}
            onToggle={(event) => setIsFiltersOpen(event.currentTarget.open)}
          >
            <summary className={styles.summary}>
              <SlidersHorizontal size={16} aria-hidden="true" />
              Filtres
              {activeFilterCount > 0 && (
                <span className={styles.filterCount}>{activeFilterCount}</span>
              )}
            </summary>

            <div className={styles.panel}>
              <label className={styles.field}>
                Type de bien
                <span className={styles.scaledControl}>
                  <select
                    value={filters.type}
                    onChange={(event) => updateFilter("type", event.target.value)}
                  >
                    <option value="">Indifférent</option>
                    {PROPERTY_TYPES.filter((type) => type !== "Tous types").map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </span>
              </label>

              <label className={styles.field}>
                Type d’offre
                <span className={styles.scaledControl}>
                  <select
                    value={filters.offerType}
                    onChange={(event) => updateFilter(
                      "offerType",
                      event.target.value as CatalogFilterValues["offerType"],
                    )}
                  >
                    <option value="">Indifférent</option>
                    <option value="rent">À louer</option>
                    <option value="sale">À vendre</option>
                  </select>
                </span>
              </label>

              <label className={styles.field}>
                Cuisine
                <span className={styles.scaledControl}>
                  <select
                    value={filters.kitchen}
                    onChange={(event) => updateFilter(
                      "kitchen",
                      event.target.value as CatalogFilterValues["kitchen"],
                    )}
                  >
                    <option value="">Indifférent</option>
                    <option value="internal">Interne</option>
                    <option value="external">Externe</option>
                  </select>
                </span>
              </label>

              <label className={styles.field}>
                Budget maximum (GNF)
                <span className={styles.scaledControl}>
                  <input
                    type="number"
                    min="0"
                    inputMode="numeric"
                    value={filters.budgetMax}
                    onChange={(event) => updateFilter("budgetMax", event.target.value)}
                    placeholder="Indifférent"
                    aria-label="Budget maximum en GNF"
                  />
                </span>
              </label>

              <label className={styles.field}>
                Surface minimale (m²)
                <span className={styles.scaledControl}>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={filters.surfaceMin}
                    onChange={(event) => updateFilter("surfaceMin", event.target.value)}
                    placeholder="Indifférent"
                    aria-label="Surface minimale en mètres carrés"
                  />
                </span>
              </label>

              <label className={styles.field}>
                Chambres minimum
                <span className={styles.scaledControl}>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={filters.bedroomsMin}
                    onChange={(event) => updateFilter("bedroomsMin", event.target.value)}
                    placeholder="Indifférent"
                  />
                </span>
              </label>

              <label className={styles.field}>
                Douches minimum
                <span className={styles.scaledControl}>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={filters.showersMin}
                    onChange={(event) => updateFilter("showersMin", event.target.value)}
                    placeholder="Indifférent"
                  />
                </span>
              </label>

              <div className={styles.actions}>
                <button
                  className={styles.reset}
                  type="button"
                  onClick={() => setFilters(INITIAL_FILTERS)}
                >
                  Effacer les filtres
                </button>
                <span className={styles.actionButtons}>
                  <button className={styles.apply} type="submit">
                    Afficher {filteredListings.length} bien{filteredListings.length === 1 ? "" : "s"}
                  </button>
                  <button
                    className={styles.closeFilters}
                    type="button"
                    onClick={() => setIsFiltersOpen(false)}
                    aria-label="Fermer les filtres"
                    title="Fermer les filtres"
                  >
                    <ChevronUp size={18} aria-hidden="true" />
                  </button>
                </span>
              </div>
            </div>
          </details>
        </div>
      </form>

      <p className={styles.resultsCount} id="catalog-results" aria-live="polite">
        {filteredListings.length} annonce{filteredListings.length === 1 ? "" : "s"}
      </p>

      {filteredListings.length > 0 ? (
        <div className="all-listings-grid">
          {filteredListings.map((listing) => (
            <div className="all-listings-item" key={listing.id}>
              <ListingCard listing={listing} mobileCompact />
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          Aucune annonce ne correspond à ces filtres.
        </div>
      )}
    </>
  );
}