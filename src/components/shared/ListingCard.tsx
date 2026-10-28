// ============================================================
// FILE: src/components/shared/ListingCard.tsx
// ============================================================

"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Bath,
  BedDouble,
  Heart,
  LandPlot,
  MapPin,
  Maximize,
} from "lucide-react";
import type { Listing } from "../../types";
import { listingRepository } from "../../lib/listings/repository";
import { formatPrice } from "../../utils/format";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&h=600&fit=crop";

interface StatusBadge {
  label: string;
  background: string;
  color: string;
}

function getStatusBadge(listing: Listing): StatusBadge | null {
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

export default function ListingCard({ listing }: { listing: Listing }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(listing.isFavorite);

  const isTerrain = listing.type === "Terrain-Vide";
  const statusBadge = getStatusBadge(listing);
  const listingSlug = listingRepository.getSlug(listing);

  return (
    <article
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
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
            position: "relative",
            flexShrink: 0,
            height: 180,
            overflow: "hidden",
            background: "#eaf0f6",
          }}
        >
          <img
            src={listing.image}
            alt={listing.title}
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
                top: 12,
                left: 12,
                padding: "5px 9px",
                borderRadius: 7,
                background: statusBadge.background,
                color: statusBadge.color,
                fontSize: 10,
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
              top: 12,
              right: 12,
              maxWidth: "48%",
              overflow: "hidden",
              padding: "5px 9px",
              borderRadius: 7,
              background: "rgba(255,255,255,0.92)",
              color: "#0a2e5c",
              fontSize: 10,
              fontWeight: 700,
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {listing.type}
          </span>

          <span
            style={{
              position: "absolute",
              bottom: 12,
              left: 12,
              padding: "7px 10px",
              borderRadius: 8,
              background: "rgba(10,46,92,0.9)",
              color: "#fff",
              fontSize: 14,
              fontWeight: 800,
            }}
          >
            {formatPrice(listing.price)}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            padding: "14px 15px 15px",
          }}
        >
          <h3
            style={{
              display: "-webkit-box",
              overflow: "hidden",
              margin: 0,
              color: "#0a2e5c",
              fontSize: 15,
              fontWeight: 700,
              lineHeight: 1.35,
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 2,
            }}
          >
            {listing.title}
          </h3>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              marginTop: 7,
              color: "#7d8da3",
              fontSize: 12,
              whiteSpace: "nowrap",
            }}
          >
            <MapPin size={13} color="#1a6dd4" />
            <span>{listing.quartier}, Conakry</span>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 6,
              marginTop: "auto",
              paddingTop: 12,
              borderTop: "1px solid #eef2f6",
            }}
          >
            <FeatureBadge
              icon={<Maximize size={12} />}
              label={`${listing.surface} m²`}
            />

            {!isTerrain && (
              <>
                <FeatureBadge
                  icon={<BedDouble size={12} />}
                  label={`${listing.rooms} pièce${
                    listing.rooms > 1 ? "s" : ""
                  }`}
                />

                <FeatureBadge
                  icon={<Bath size={12} />}
                  label={`${listing.bathrooms} sdb`}
                />
              </>
            )}

            {isTerrain && (
              <FeatureBadge
                icon={<LandPlot size={12} />}
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
        onClick={() =>
          setIsFavorite((currentFavorite) => !currentFavorite)
        }
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 34,
          height: 34,
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
        alignItems: "center",
        gap: 4,
        padding: "5px 7px",
        borderRadius: 6,
        background: "#f4f7fb",
        color: "#596b80",
        fontSize: 11,
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