"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Listing } from "../../types";
import ListingCard from "./ListingCard";

interface ListingsCarouselProps {
  listings: Listing[];
}

interface ListingColumn {
  top: Listing;
  bottom: Listing;
}

const DESKTOP_VISIBLE_COLUMNS = 4;
const DESKTOP_CARDS_PER_COLUMN = 2;

function getCircularListing(
  listings: Listing[],
  index: number,
): Listing {
  const length = listings.length;
  const safeIndex = ((index % length) + length) % length;

  return listings[safeIndex];
}

function getVisibleColumns(
  listings: Listing[],
  startCardIndex: number,
): ListingColumn[] {
  const columns: ListingColumn[] = [];

  for (
    let column = 0;
    column < DESKTOP_VISIBLE_COLUMNS + 1;
    column += 1
  ) {
    const topIndex =
      startCardIndex + column * DESKTOP_CARDS_PER_COLUMN;

    columns.push({
      top: getCircularListing(listings, topIndex),
      bottom: getCircularListing(listings, topIndex + 1),
    });
  }

  return columns;
}

export default function ListingsCarousel({
  listings,
}: ListingsCarouselProps) {
  const [desktopCardIndex, setDesktopCardIndex] = useState(0);
  const mobileViewRef = useRef<HTMLDivElement>(null);

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

  const visibleColumns = getVisibleColumns(
    listings,
    desktopCardIndex,
  );

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
        (currentIndex + DESKTOP_CARDS_PER_COLUMN) %
        listings.length,
    );

    scrollMobile("next");
  };

  const movePrevious = () => {
    setDesktopCardIndex(
      (currentIndex) =>
        (currentIndex -
          DESKTOP_CARDS_PER_COLUMN +
          listings.length) %
        listings.length,
    );

    scrollMobile("previous");
  };

  return (
    <div className="listings-carousel">
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

        .desktop-listing-column {
          display: grid;
          grid-template-rows: repeat(2, minmax(0, 1fr));
          gap: 18px;
          min-width: 0;
        }

        .desktop-listing-slot {
          display: flex;
          min-width: 0;
          min-height: 0;
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

        @media (max-width: 1100px) and (min-width: 769px) {
          .desktop-listings-view {
            grid-template-columns: repeat(3, minmax(0, 1fr)) minmax(0, 0.10fr);
          }
        }

        @media (max-width: 768px) {
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
            width: 34px;
            height: 34px;
          }

          .listings-carousel-button-left {
            left: 0;
          }

          .listings-carousel-button-right {
            right: 0;
          }
        }
      `}</style>

      <div className="desktop-listings-view">
        {visibleColumns.map((column, columnIndex) => {
          const isPreview =
            columnIndex === DESKTOP_VISIBLE_COLUMNS;

          return (
            <div
              key={`${column.top.id}-${column.bottom.id}-${columnIndex}`}
              className={`desktop-listing-column ${
                isPreview
                  ? "desktop-listing-column-preview"
                  : ""
              }`}
            >
              <div className="desktop-listing-slot">
                <ListingCard listing={column.top} />
              </div>

              <div className="desktop-listing-slot">
                <ListingCard listing={column.bottom} />
              </div>
            </div>
          );
        })}
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