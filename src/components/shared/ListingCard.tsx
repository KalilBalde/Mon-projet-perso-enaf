// ============================================================
// FILE: src/components/shared/ListingCard.tsx
// ============================================================

"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  Bath,
  BedDouble,
  Eye,
  Heart,
  LandPlot,
  MapPin,
  Maximize,
  Sofa,
} from "lucide-react";
import type { Listing } from "../../types";
import { getFavoriteIds, toggleFavorite } from "../../lib/favorites/storage";
import { listingRepository } from "../../lib/listings/repository";
import { formatListingPrice } from "../../utils/format";
import styles from "./ListingCard.module.css";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&h=600&fit=crop";

interface StatusBadge {
  label: string;
  background: string;
  color: string;
}

function getStatusBadge(listing: Listing): StatusBadge | null {
  if (listing.cardBadge === null) {
    return null;
  }

  if (listing.cardBadge === "sold") {
    return { label: "Vendu", background: "#c0392b", color: "#fff" };
  }

  if (listing.cardBadge === "rented") {
    return { label: "Déjà loué", background: "#c0392b", color: "#fff" };
  }

  if (listing.cardBadge === "new") {
    return { label: "Nouveau", background: "#1a6dd4", color: "#fff" };
  }

  if (listing.cardBadge === "title_deed") {
    return { label: "Titre foncier", background: "#1a6dd4", color: "#fff" };
  }

  if (listing.status === "sold") {
    return { label: "Vendu", background: "#c0392b", color: "#fff" };
  }

  if (listing.status === "rented") {
    return { label: "Déjà loué", background: "#e67e22", color: "#fff" };
  }

  if (listing.isNew) {
    return { label: "Nouveau", background: "#1a6dd4", color: "#fff" };
  }

  return null;
}

function getUniqueListingImages(listing: Listing): string[] {
  const images = new Map<string, string>();

  for (const image of [listing.image, ...(listing.images ?? [])]) {
    try {
      const url = new URL(image);
      const identity = `${url.origin}${url.pathname}`;

      if (!images.has(identity)) {
        images.set(identity, image);
      }
    } catch {
      if (!images.has(image)) {
        images.set(image, image);
      }
    }
  }

  return [...images.values()];
}

export default function ListingCard({
  listing,
  compact = false,
}: {
  listing: Listing;
  compact?: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const imageTouchStartXRef = useRef<number | null>(null);
  const ignoreImageClickUntilRef = useRef(0);

  useEffect(() => {
    setIsFavorite(getFavoriteIds().includes(listing.id));
  }, [listing.id]);

  const isTerrain = listing.type === "Terrain-Vide";
  const statusBadge = getStatusBadge(listing);
  const listingSlug = listingRepository.getSlug(listing);
  const listingImages = getUniqueListingImages(listing);
  const offerLabel =
    listing.offerType === "rent"
      ? "À louer"
      : listing.offerType === "sale"
        ? "À vendre"
        : null;

    const handleImageTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
      event.stopPropagation();
      imageTouchStartXRef.current = event.touches[0]?.clientX ?? null;
    };

    const handleImageTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
      event.stopPropagation();
      const startX = imageTouchStartXRef.current;
      const endX = event.changedTouches[0]?.clientX;
      imageTouchStartXRef.current = null;

      if (startX === null || endX === undefined || listingImages.length < 2) {
        return;
      }

      const deltaX = endX - startX;

      if (Math.abs(deltaX) < 30) {
        return;
      }

      ignoreImageClickUntilRef.current = Date.now() + 500;
      setActiveImageIndex((currentIndex) =>
        deltaX < 0
          ? (currentIndex + 1) % listingImages.length
          : (currentIndex - 1 + listingImages.length) % listingImages.length,
      );
    };

  return (
    <article
      className={compact ? styles.compact : undefined}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "auto",
        overflow: "hidden",
        border: "1px solid #e7edf4",
        borderRadius: 14,
        background: "#fff",
        boxShadow: isHovered
          ? "0 14px 30px rgba(10,46,92,0.14)"
          : "0 5px 16px rgba(10,46,92,0.06)",
        transform: isHovered ? "translateY(-3px)" : "translateY(0)",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
        fontFamily: "'DM Sans', sans-serif",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        style={{
          position: "relative",
          flexShrink: 0,
          height: compact ? "var(--compact-image-height, 132px)" : 180,
          overflow: "hidden",
          background: "#eaf0f6",
          touchAction: "pan-y",
        }}
        onTouchStart={handleImageTouchStart}
        onTouchEnd={handleImageTouchEnd}
        onTouchCancel={() => {
          imageTouchStartXRef.current = null;
        }}
      >
        <Link
          href={`/annonces/${listingSlug}`}
          aria-label={`Voir l’annonce ${listing.title}`}
          onClick={(event) => {
            if (Date.now() < ignoreImageClickUntilRef.current) {
              event.preventDefault();
              ignoreImageClickUntilRef.current = 0;
            }
          }}
          style={{
            position: "absolute",
            inset: 0,
            display: "block",
            color: "inherit",
            textDecoration: "none",
          }}
        >
          <img
            src={listingImages[activeImageIndex] ?? FALLBACK_IMAGE}
            alt={`${listing.title} - photo ${activeImageIndex + 1}`}
            loading="lazy"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = FALLBACK_IMAGE;
            }}
            style={{
              display: "block",
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: isHovered ? "scale(1.04)" : "scale(1)",
              transition: "transform 0.45s ease",
            }}
          />

          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(10,46,92,0.02) 45%, rgba(10,46,92,0.62) 100%)",
            }}
          />

          {statusBadge && (
            <span
              style={{
                position: "absolute",
                top: "var(--card-badge-offset, 12px)",
                left: "var(--card-badge-offset, 12px)",
                padding: "var(--card-status-padding, 5px 9px)",
                borderRadius: 7,
                background: statusBadge.background,
                color: statusBadge.color,
                fontSize: "var(--card-status-size, 10px)",
                fontWeight: 700,
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              {statusBadge.label}
            </span>
          )}

          <span
            style={{
              position: "absolute",
              bottom: "var(--card-badge-offset, 12px)",
              left: "var(--card-badge-offset, 12px)",
              padding: "var(--card-price-padding, 7px 10px)",
              borderRadius: 8,
              background: "rgba(10,46,92,0.9)",
              color: "#fff",
              fontSize: "var(--card-price-size, 14px)",
              fontWeight: 800,
            }}
          >
            {formatListingPrice(listing.price, listing.offerType)}
          </span>
        </Link>

        {listingImages.length > 1 && (
          <div
            role="group"
            aria-label="Photos de l’annonce"
            style={{
              position: "absolute",
              right: 12,
              bottom: 12,
              zIndex: 3,
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "5px 7px",
              borderRadius: 999,
              background: "rgba(10, 46, 92, 0.62)",
              backdropFilter: "blur(6px)",
            }}
          >
            {listingImages.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                aria-label={`Afficher la photo ${index + 1} sur ${listingImages.length}`}
                aria-pressed={activeImageIndex === index}
                onClick={() => setActiveImageIndex(index)}
                style={{
                  width: activeImageIndex === index ? 12 : 7,
                  height: 7,
                  padding: 0,
                  border: 0,
                  borderRadius: 999,
                  background: activeImageIndex === index
                    ? "#fff"
                    : "rgba(255, 255, 255, 0.55)",
                  cursor: "pointer",
                  transition: "width 0.18s ease, background 0.18s ease",
                }}
              />
            ))}
          </div>
        )}
      </div>

      <Link
        href={`/annonces/${listingSlug}`}
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minWidth: 0,
          color: "inherit",
          textDecoration: "none",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            padding: "var(--card-body-padding, 14px 15px 15px)",
          }}
        >
          <h3
            style={{
              display: "-webkit-box",
              overflow: "hidden",
              margin: 0,
              color: "#0a2e5c",
              fontSize: "var(--card-title-size, 15px)",
              fontWeight: 700,
              lineHeight: 1.35,
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: compact ? 1 : 2,
            }}
          >
            {listing.title}
          </h3>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 6,
              minWidth: 0,
              marginTop: 4,
            }}
          >
            <span
              className={styles.typeTag}
              style={{
                flex: "0 1 auto",
                minWidth: 0,
                maxWidth: "calc(100% - 48px)",
                overflow: "hidden",
                padding: "3px 7px",
                borderRadius: 6,
                background: "#f0f6ff",
                color: "#1a5da8",
                fontSize: "var(--card-type-size, 10px)",
                fontWeight: 700,
                lineHeight: 1.25,
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {listing.type}{offerLabel ? ` · ${offerLabel}` : ""}
            </span>

            <span
              title={`${listing.viewCount ?? 0} vues`}
              aria-label={`${listing.viewCount ?? 0} vues`}
              style={{
                display: "inline-flex",
                flex: "0 0 auto",
                alignItems: "center",
                gap: 4,
                color: "#718198",
                fontSize: "var(--card-meta-size, 11px)",
                fontWeight: 600,
                whiteSpace: "nowrap",
              }}
            >
              <Eye size={13} aria-hidden="true" />
              {listing.viewCount ?? 0} vues
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              marginTop: "var(--card-meta-gap, 7px)",
              color: "#7d8da3",
              fontSize: "var(--card-meta-size, 12px)",
              whiteSpace: "nowrap",
            }}
          >
            <MapPin size={13} color="#1a6dd4" />
            <span>{listing.quartier}, Conakry</span>
          </div>

          <div
            className={styles.featureBadges}
            style={{
              display: "flex",
              flexWrap: "nowrap",
              gap: 5,
              overflowX: "auto",
              overflowY: "hidden",
              marginTop: "var(--card-chips-margin-top, 18px)",
              paddingTop: "var(--card-chips-pad-top, 7px)",
              borderTop: "1px solid #eef2f6",
            }}
          >
            <FeatureBadge
              icon={<Maximize size={13} />}
              label={`${listing.surface} m²`}
            />

            {!isTerrain && listing.bedrooms > 0 && (
              <FeatureBadge
                icon={<BedDouble size={13} />}
                label={`${listing.bedrooms} chambre${listing.bedrooms > 1 ? "s" : ""}`}
              />
            )}

            {!isTerrain && listing.livingRooms > 0 && (
              <FeatureBadge
                icon={<Sofa size={13} />}
                label={`${listing.livingRooms} salon${listing.livingRooms > 1 ? "s" : ""}`}
              />
            )}

            {!isTerrain && listing.showers > 0 && (
              <span className={styles.extraChip}>
                <FeatureBadge
                  icon={<Bath size={13} />}
                  label={`${listing.showers} douche${listing.showers > 1 ? "s" : ""}`}
                />
              </span>
            )}

            {isTerrain && (
              <FeatureBadge
                icon={<LandPlot size={13} />}
                label="Terrain"
              />
            )}
          </div>
        </div>
      </Link>

      <button
        type="button"
        aria-label={
          isFavorite
            ? `Retirer ${listing.title} des favoris`
            : `Ajouter ${listing.title} aux favoris`
        }
        onClick={() => setIsFavorite(toggleFavorite(listing.id))}
        style={{
          position: "absolute",
          top: "var(--card-heart-offset, 10px)",
          right: "var(--card-heart-offset, 10px)",
          zIndex: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "var(--card-heart-size, 34px)",
          height: "var(--card-heart-size, 34px)",
          padding: 0,
          border: "none",
          borderRadius: 9,
          background: isFavorite
            ? "#1a6dd4"
            : "rgba(255,255,255,0.94)",
          color: isFavorite ? "#fff" : "#1a6dd4",
          cursor: "pointer",
        }}
      >
        <Heart
          size={16}
          fill={isFavorite ? "currentColor" : "none"}
        />
      </button>
    </article>
  );
}

function FeatureBadge({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        flex: "0 0 auto",
        alignItems: "center",
        gap: 4,
        padding: "var(--card-feature-padding, 4px 6px)",
        borderRadius: 6,
        background: "#f4f7fb",
        color: "#596b80",
        fontSize: "var(--card-feature-size, 10px)",
        fontWeight: 600,
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ display: "flex", color: "#1a6dd4" }}>
        {icon}
      </span>
      {label}
    </span>
  );
}