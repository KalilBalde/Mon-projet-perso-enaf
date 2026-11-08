"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Listing } from "../../types";
import ListingCard from "./ListingCard";

interface ListingsCarouselProps {
  listings: Listing[];
  isFiltered?: boolean;
}

interface ListingColumn {
  top: Listing;
  bottom: Listing;
}

const DESKTOP_VISIBLE_COLUMNS = 4;
const DESKTOP_CARDS_PER_COLUMN = 2;

function getCircularListing(listings: Listing[], index: number): Listing {
  const safeIndex = ((index % listings.length) + listings.length) % listings.length;
  return listings[safeIndex];
}

function getVisibleColumns(listings: Listing[], startCardIndex: number): ListingColumn[] {
  return Array.from({ length: DESKTOP_VISIBLE_COLUMNS + 1 }, (_, columnIndex) => {
    const topIndex = startCardIndex + columnIndex * DESKTOP_CARDS_PER_COLUMN;

    return {
      top: getCircularListing(listings, topIndex),
      bottom: getCircularListing(listings, topIndex + 1),
    };
  });
}

export default function ListingsCarousel({
  listings,
  isFiltered = false,
}: ListingsCarouselProps) {
  const mobileViewRef = useRef<HTMLDivElement>(null);
  const [desktopCardIndex, setDesktopCardIndex] = useState(0);

  if (listings.length === 0) {
    return (
      <div
        style={{
          padding: "30px 18px",
          border: "1px solid #e4eaf0",
          borderRadius: 14,
          background: "#f7f9fc",
          color: "#718198",
          textAlign: "center",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 14,
        }}
      >
        Aucune annonce disponible pour le moment.
      </div>
    );
  }

  const showDesktopCarousel = !isFiltered;
  const visibleColumns = showDesktopCarousel
    ? getVisibleColumns(listings, desktopCardIndex)
    : [];

  const scrollMobile = (direction: "previous" | "next") => {
    const view = mobileViewRef.current;

    if (!view) {
      return;
    }

    const step = view.clientWidth * 0.88;
    const maxScroll = view.scrollWidth - view.clientWidth;
    const atStart = view.scrollLeft <= 4;
    const atEnd = view.scrollLeft >= maxScroll - 4;

    if (direction === "next") {
      view.scrollTo({
        left: atEnd ? 0 : view.scrollLeft + step,
        behavior: "smooth",
      });
      return;
    }

    view.scrollTo({
      left: atStart ? maxScroll : view.scrollLeft - step,
      behavior: "smooth",
    });
  };

  const moveNext = () => {
    setDesktopCardIndex(
      (currentIndex) =>
        (currentIndex + DESKTOP_CARDS_PER_COLUMN) % listings.length,
    );
    scrollMobile("next");
  };

  const movePrevious = () => {
    setDesktopCardIndex(
      (currentIndex) =>
        (currentIndex - DESKTOP_CARDS_PER_COLUMN + listings.length) % listings.length,
    );
    scrollMobile("previous");
  };

  return (
    <div
      className={`listings-carousel${isFiltered ? " listings-carousel-filtered" : ""}`}
    >
      <style suppressHydrationWarning>{`
        .listings-carousel {
          position: relative;
          width: 100%;
        }

        .desktop-listings-view {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr)) minmax(0, 0.10fr);
          gap: 18px;
          width: 100%;
          overflow: hidden;
        }

        .desktop-listings-view-filtered {
          grid-template-columns: repeat(4, minmax(0, 1fr));
          overflow: visible;
        }

        .desktop-listing-column {
          display: grid;
          grid-template-rows: repeat(2, auto);
          gap: 18px;
          min-width: 0;
        }

        .desktop-listing-slot {
          display: flex;
          align-items: flex-start;
          min-width: 0;
        }

        .desktop-listing-slot > article {
          width: 100%;
        }

        .desktop-listing-column-preview {
          overflow: hidden;
          opacity: 0.18;
          pointer-events: none;
        }

        .mobile-listings-view {
          display: none;
        }

        .listings-carousel-button {
          position: absolute;
          top: 50%;
          z-index: 5;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          padding: 0;
          border: 1px solid #dce5ef;
          border-radius: 50%;
          background: #fff;
          color: #0a2e5c;
          cursor: pointer;
          box-shadow: 0 8px 22px rgba(10, 46, 92, 0.18);
          transform: translateY(-50%);
        }

        .listings-carousel-button:hover {
          background: #1a6dd4;
          color: #fff;
        }

        .listings-carousel-button-left {
          left: -14px;
        }

        .listings-carousel-button-right {
          right: -14px;
        }

        @media (min-width: 901px) {
          .listings-carousel-filtered .listings-carousel-button {
            display: none;
          }
        }

        @media (max-width: 1100px) and (min-width: 769px) {
          .desktop-listings-view {
            grid-template-columns: repeat(3, minmax(0, 1fr)) minmax(0, 0.10fr);
          }

          .desktop-listings-view-filtered {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (max-width: 900px) {
          .desktop-listings-view {
            display: none;
          }

          .mobile-listings-view {
            display: flex;
            gap: 12px;
            width: 100%;
            overflow-x: auto;
            overflow-y: hidden;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
            padding: 2px 4px 12px 2px;
          }

          .mobile-listings-view::-webkit-scrollbar {
            display: none;
          }

          .mobile-listing-card {
            flex: 0 0 88vw;
            width: 88vw;
            max-width: 340px;
            scroll-snap-align: center;
          }

          .listings-carousel-button {
            top: 32%;
            width: 34px;
            height: 34px;
          }

          .listings-carousel-button-left {
            left: -16px;
          }

          .listings-carousel-button-right {
            right: -16px;
          }
        }
      `}</style>

      <div
        className={`desktop-listings-view${isFiltered ? " desktop-listings-view-filtered" : ""}`}
        style={isFiltered && listings.length <= 4 ? {
          gridTemplateColumns: `repeat(${listings.length}, minmax(0, 1fr))`,
          maxWidth: `min(100%, ${listings.length * 320}px)`,
        } : undefined}
      >
        {showDesktopCarousel
          ? visibleColumns.map((column, columnIndex) => (
              <div
                key={`${column.top.id}-${column.bottom.id}-${columnIndex}`}
                className={`desktop-listing-column${columnIndex === DESKTOP_VISIBLE_COLUMNS ? " desktop-listing-column-preview" : ""}`}
              >
                <div className="desktop-listing-slot">
                  <ListingCard listing={column.top} />
                </div>
                <div className="desktop-listing-slot">
                  <ListingCard listing={column.bottom} />
                </div>
              </div>
            ))
          : listings.map((listing) => (
              <div className="desktop-listing-slot" key={listing.id}>
                <ListingCard listing={listing} />
              </div>
            ))}
      </div>

      <div className="mobile-listings-view" ref={mobileViewRef}>
        {listings.map((listing) => (
          <div key={listing.id} className="mobile-listing-card">
            <ListingCard listing={listing} />
          </div>
        ))}
      </div>

      {listings.length > 1 && (
        <>
          <button
            type="button"
            className="listings-carousel-button listings-carousel-button-left"
            aria-label="Afficher les annonces précédentes"
            onClick={movePrevious}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            className="listings-carousel-button listings-carousel-button-right"
            aria-label="Afficher les annonces suivantes"
            onClick={moveNext}
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}
    </div>
  );
}
