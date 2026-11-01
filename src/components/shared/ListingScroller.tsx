"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Listing } from "../../types";
import ListingCard from "./ListingCard";
import styles from "./ListingScroller.module.css";

export default function ListingScroller({
  listings,
  label,
}: {
  listings: Listing[];
  label: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateArrows = useCallback(() => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    setCanScrollPrev(track.scrollLeft > 4);
    setCanScrollNext(
      track.scrollLeft + track.clientWidth < track.scrollWidth - 4,
    );
  }, []);

  useEffect(() => {
    updateArrows();
    window.addEventListener("resize", updateArrows);

    return () => window.removeEventListener("resize", updateArrows);
  }, [updateArrows, listings.length]);

  const scrollByPage = (direction: 1 | -1) => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    track.scrollBy({
      left: direction * track.clientWidth * 0.85,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <div className={styles.scroller}>
      {canScrollPrev && (
        <button
          type="button"
          className={`${styles.arrow} ${styles.arrowPrev}`}
          aria-label="Annonces précédentes"
          onClick={() => scrollByPage(-1)}
        >
          <ChevronLeft size={22} aria-hidden="true" />
        </button>
      )}

      <div
        ref={trackRef}
        className={styles.track}
        role="list"
        aria-label={label}
        tabIndex={0}
        onScroll={updateArrows}
      >
        {listings.map((listing) => (
          <div key={listing.id} role="listitem" className={styles.item}>
            <ListingCard listing={listing} compact />
          </div>
        ))}
      </div>

      {canScrollNext && (
        <button
          type="button"
          className={`${styles.arrow} ${styles.arrowNext}`}
          aria-label="Annonces suivantes"
          onClick={() => scrollByPage(1)}
        >
          <ChevronRight size={22} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
