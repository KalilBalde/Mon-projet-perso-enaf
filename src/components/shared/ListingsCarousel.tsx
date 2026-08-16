"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Listing } from "../../types";
import ListingCard from "./ListingCard";

interface ListingsCarouselProps {
  listings: Listing[];
}

type ListingSlot = Listing | null;

function splitListings(
  listings: Listing[],
  groupSize: number,
): ListingSlot[][] {
  const groups: ListingSlot[][] = [];

  for (let index = 0; index < listings.length; index += groupSize) {
    const group = listings.slice(index, index + groupSize) as ListingSlot[];

    while (group.length < groupSize) {
      group.push(null);
    }

    groups.push(group);
  }

  return groups;
}

export default function ListingsCarousel({
  listings,
}: ListingsCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const listingGroups = splitListings(listings, 6);

  const moveCarousel = (direction: "previous" | "next") => {
    const carousel = carouselRef.current;

    if (!carousel) {
      return;
    }

    carousel.scrollBy({
      left:
        direction === "next"
          ? carousel.clientWidth * 0.86
          : -carousel.clientWidth * 0.86,
      behavior: "smooth",
    });
  };

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

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <style suppressHydrationWarning>{`
        .listings-carousel-viewport {
          width: 100%;
          overflow-x: auto;
          overflow-y: hidden;
          scroll-behavior: smooth;
          scroll-snap-type: x mandatory;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
        }

        .listings-carousel-viewport::-webkit-scrollbar {
          display: none;
        }

        .listings-groups {
          display: flex;
          align-items: stretch;
          gap: 20px;
          width: max-content;
          padding: 2px 2px 12px;
        }

        .listings-group {
          display: grid;
          flex: 0 0 calc(100vw - 52px);
          grid-template-columns: repeat(3, minmax(0, 1fr));
          grid-template-rows: repeat(2, minmax(0, 1fr));
          gap: 16px;
          width: calc(100vw - 52px);
          max-width: 1144px;
          scroll-snap-align: start;
        }

        .listing-group-item {
          display: flex;
          min-width: 0;
          width: 100%;
          min-height: 0;
        }

        .listing-group-item > article {
          width: 100%;
        }

        .listing-group-item-empty {
          visibility: hidden;
          pointer-events: none;
        }

        .listings-carousel-button {
          position: absolute;
          top: 50%;
          z-index: 5;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
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

        @media (min-width: 1200px) {
          .listings-group {
            flex-basis: 1144px;
            width: 1144px;
          }
        }

        @media (max-width: 768px) {
          .listings-groups {
            gap: 14px;
          }

          .listings-group {
            display: flex;
            flex: 0 0 auto;
            gap: 14px;
            width: max-content;
            max-width: none;
          }

          .listing-group-item {
            flex: 0 0 84vw;
            width: 84vw;
            max-width: 340px;
          }

          .listing-group-item-empty {
            display: none;
          }

          .listings-carousel-button {
            width: 36px;
            height: 36px;
          }

          .listings-carousel-button-left {
            left: 0;
          }

          .listings-carousel-button-right {
            right: 0;
          }
        }
      `}</style>

      <div
        ref={carouselRef}
        className="listings-carousel-viewport"
      >
        <div className="listings-groups">
          {listingGroups.map((group, groupIndex) => (
            <div
              className="listings-group"
              key={`listing-group-${groupIndex}`}
            >
              {group.map((listing, listingIndex) => {
                if (!listing) {
                  return (
                    <div
                      key={`empty-slot-${groupIndex}-${listingIndex}`}
                      className="listing-group-item listing-group-item-empty"
                      aria-hidden="true"
                    />
                  );
                }

                return (
                  <div
                    className="listing-group-item"
                    key={listing.id}
                  >
                    <ListingCard listing={listing} />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {listings.length > 6 && (
        <>
          <button
            type="button"
            className="listings-carousel-button listings-carousel-button-left"
            aria-label="Afficher les annonces précédentes"
            onClick={() => moveCarousel("previous")}
          >
            <ChevronLeft size={21} />
          </button>

          <button
            type="button"
            className="listings-carousel-button listings-carousel-button-right"
            aria-label="Afficher les annonces suivantes"
            onClick={() => moveCarousel("next")}
          >
            <ChevronRight size={21} />
          </button>
        </>
      )}
    </div>
  );
}