"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Bath,
  BedDouble,
  Check,
  ChevronLeft,
  ChevronRight,
  CookingPot,
  Eye,
  MapPin,
  Maximize,
  Phone,
  Share2,
  Sofa,
  X,
} from "lucide-react";
import {
  fetchPublishedListings,
  incrementListingView,
} from "../../../lib/listings/database";
import { listingRepository } from "../../../lib/listings/repository";
import ListingRecommendations from "../../../components/shared/ListingRecommendations";
import { LISTING_IMAGE_PLACEHOLDER } from "../../../data/constants";
import type { Listing } from "../../../types";
import { formatListingKitchen, formatListingPrice } from "../../../utils/format";

interface ListingDetailsPageProps {
  params: {
    id: string;
  };
}

type DescriptionBlock =
  | { kind: "paragraph"; lines: string[] }
  | { kind: "bullets"; items: string[] }
  | { kind: "numbered"; items: Array<{ number: number; text: string }> };

function parseDescription(description: string): DescriptionBlock[] {
  const blocks: DescriptionBlock[] = [];
  let paragraphLines: string[] = [];
  let bulletItems: string[] = [];
  let numberedItems: Array<{ number: number; text: string }> = [];

  const flushParagraph = () => {
    if (paragraphLines.length) {
      blocks.push({ kind: "paragraph", lines: paragraphLines });
      paragraphLines = [];
    }
  };
  const flushBullets = () => {
    if (bulletItems.length) {
      blocks.push({ kind: "bullets", items: bulletItems });
      bulletItems = [];
    }
  };
  const flushNumbered = () => {
    if (numberedItems.length) {
      blocks.push({ kind: "numbered", items: numberedItems });
      numberedItems = [];
    }
  };

  for (const rawLine of description.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) {
      flushParagraph();
      flushBullets();
      flushNumbered();
      continue;
    }

    const numberedMatch = line.match(/^(\d+)\s*-\s*(.+)$/);
    if (numberedMatch) {
      flushParagraph();
      flushBullets();
      numberedItems.push({ number: Number(numberedMatch[1]), text: numberedMatch[2] });
      continue;
    }

    const bulletMatch = line.match(/^-\s*(.+)$/);
    if (bulletMatch) {
      flushParagraph();
      flushNumbered();
      bulletItems.push(bulletMatch[1]);
      continue;
    }

    flushBullets();
    flushNumbered();
    paragraphLines.push(line);
  }

  flushParagraph();
  flushBullets();
  flushNumbered();
  return blocks;
}

function ListingDescription({ text }: { text: string }) {
  return (
    <div>
      {parseDescription(text).map((block, blockIndex) => {
        if (block.kind === "paragraph") {
          return (
            <p key={blockIndex} style={paragraphStyle}>
              {block.lines.map((line, lineIndex) => (
                <span key={lineIndex}>
                  {lineIndex > 0 && <br />}
                  {line}
                </span>
              ))}
            </p>
          );
        }

        if (block.kind === "bullets") {
          return (
            <ul key={blockIndex} style={{ ...paragraphStyle, paddingLeft: 24 }}>
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex} style={{ paddingLeft: 4, marginBottom: 5 }}>
                  {item}
                </li>
              ))}
            </ul>
          );
        }

        return (
          <ol
            key={blockIndex}
            start={block.items[0]?.number ?? 1}
            style={{ ...paragraphStyle, paddingLeft: 24 }}
          >
            {block.items.map((item, itemIndex) => (
              <li key={itemIndex} style={{ paddingLeft: 4, marginBottom: 5 }}>
                {item.text}
              </li>
            ))}
          </ol>
        );
      })}
    </div>
  );
}

export default function ListingDetailsPage({
  params,
}: ListingDetailsPageProps) {
  const [databaseListings, setDatabaseListings] = useState<Listing[]>([]);
  const [isDatabaseLoading, setIsDatabaseLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [shareStatus, setShareStatus] = useState<"idle" | "shared" | "copied" | "error">("idle");
  const galleryTouchStartXRef = useRef<number | null>(null);
  const ignoreGalleryClickUntilRef = useRef(0);

  useEffect(() => {
    let active = true;

    void fetchPublishedListings()
      .then((listings) => {
        if (active) {
          setDatabaseListings(listings);
        }
      })
      .finally(() => {
        if (active) {
          setIsDatabaseLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const listing = listingRepository.findBySlug(params.id, databaseListings);
  const images = listing
    ? listing.images?.length
      ? listing.images
      : listing.image
        ? [listing.image]
        : [LISTING_IMAGE_PLACEHOLDER]
    : [];
  const listingTitle = listing?.title.trim() || "Annonce sans titre";
  const listingType = listing?.type.trim() || "Type à préciser";
  const listingNeighborhood = listing?.quartier.trim() || "Quartier à préciser";

  const handleShareListing = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: listingTitle,
          text: `${listingTitle} - ENAFIM Guinée`,
          url,
        });
        setShareStatus("shared");
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
      }
    }

    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("Clipboard API unavailable");
      }
      await navigator.clipboard.writeText(url);
      setShareStatus("copied");
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = url;
      textArea.setAttribute("readonly", "");
      textArea.style.position = "fixed";
      textArea.style.top = "0";
      textArea.style.left = "-9999px";
      textArea.style.fontSize = "16px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      textArea.setSelectionRange(0, url.length);

      let copied = false;
      try {
        copied = document.execCommand("copy");
      } catch {
        copied = false;
      } finally {
        textArea.remove();
      }
      setShareStatus(copied ? "copied" : "error");
    }
  };

  const isTerrain = listing?.type === "Terrain-Vide";

  useEffect(() => {
    if (!listing) {
      return;
    }

    const storageKey = `enafim-listing-view-${listing.id}`;

    try {
      if (sessionStorage.getItem(storageKey)) {
        return;
      }
      sessionStorage.setItem(storageKey, "pending");
    } catch {
      // Continue counting when session storage is unavailable.
    }

    let active = true;

    void incrementListingView(listing.id)
      .then((viewCount) => {
        if (viewCount === null) {
          try {
            sessionStorage.removeItem(storageKey);
          } catch {
            // Ignore storage access failures.
          }
          return;
        }

        try {
          sessionStorage.setItem(storageKey, "counted");
        } catch {
          // Ignore storage access failures.
        }

        if (active) {
          setDatabaseListings((currentListings) =>
            currentListings.map((item) =>
              item.id === listing.id ? { ...item, viewCount } : item,
            ),
          );
        }
      })
      .catch(() => {
        try {
          sessionStorage.removeItem(storageKey);
        } catch {
          // Ignore storage access failures.
        }
      });

    return () => {
      active = false;
    };
  }, [listing?.id]);

  const showPreviousImage = () => {
    if (!images.length) {
      return;
    }

    setActiveImageIndex((currentIndex) =>
      currentIndex === 0 ? images.length - 1 : currentIndex - 1,
    );
  };

  const showNextImage = () => {
    if (!images.length) {
      return;
    }

    setActiveImageIndex((currentIndex) =>
      currentIndex === images.length - 1 ? 0 : currentIndex + 1,
    );
  };

  const handleGalleryTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    galleryTouchStartXRef.current = event.touches[0]?.clientX ?? null;
  };

  const handleGalleryTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    const startX = galleryTouchStartXRef.current;
    const endX = event.changedTouches[0]?.clientX;
    galleryTouchStartXRef.current = null;

    if (startX === null || endX === undefined || images.length < 2) {
      return;
    }

    const deltaX = endX - startX;
    if (Math.abs(deltaX) < 40) {
      return;
    }

    ignoreGalleryClickUntilRef.current = Date.now() + 500;
    if (deltaX < 0) {
      showNextImage();
    } else {
      showPreviousImage();
    }
  };

  useEffect(() => {
    if (!isGalleryOpen || !listing) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsGalleryOpen(false);
      }

      if (event.key === "ArrowLeft") {
        showPreviousImage();
      }

      if (event.key === "ArrowRight") {
        showNextImage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isGalleryOpen, images.length]);

  if (!listing && isDatabaseLoading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          padding: "150px 24px",
          background: "#fff",
          color: "#718198",
          textAlign: "center",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        Chargement de l’annonce...
      </main>
    );
  }

  if (!listing) {
    return (
      <main
        style={{
          minHeight: "100vh",
          padding: "150px 24px",
          background: "#fff",
          textAlign: "center",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <h1
          style={{
            color: "#0a2e5c",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Annonce introuvable
        </h1>

        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            marginTop: 20,
            padding: "13px 18px",
            borderRadius: 10,
            background: "#1a6dd4",
            color: "#fff",
            textDecoration: "none",
            fontWeight: 700,
          }}
        >
          <ArrowLeft size={18} />
          Retour à l&apos;accueil
        </Link>
      </main>
    );
  }

  return (
    <main
      className="listing-details-page"
      style={{
        minHeight: "100vh",
        paddingTop: 112,
        paddingBottom: 80,
        background: "#fff",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <style>{`
        .listing-gallery {
          position: relative;
          display: grid;
          grid-template-columns: minmax(0, 1.3fr) minmax(0, 0.7fr);
          gap: 10px;
          height: 480px;
          overflow: hidden;
          border: 1px solid #e4eaf0;
          border-radius: 18px;
          background: #fff;
          box-shadow: 0 4px 16px rgba(10,46,92,0.06);
        }

        .listing-gallery-side {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        .listing-gallery-image {
          position: relative;
          display: block;
          width: 100%;
          height: 100%;
          padding: 0;
          overflow: hidden;
          border: none;
          background: #eaf0f6;
          cursor: pointer;
        }

        .listing-gallery-main {
          min-width: 0;
        }

        .listing-mobile-gallery-controls {
          display: none;
        }

        .listing-gallery-image img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .listing-gallery-image:hover img {
          transform: scale(1.05);
        }

        .listing-gallery-more {
          position: absolute;
          right: 16px;
          bottom: 16px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          border: 1px solid rgba(255,255,255,0.35);
          border-radius: 10px;
          background: rgba(10,46,92,0.82);
          color: #fff;
          font-size: 13px;
          font-weight: 700;
        }

        .gallery-modal {
          position: fixed;
          inset: 0;
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 32px;
          background: rgba(4,16,34,0.96);
        }

        .gallery-modal-image {
          display: block;
          max-width: 86vw;
          max-height: 82vh;
          width: auto;
          height: auto;
          object-fit: contain;
          border-radius: 8px;
        }

        .gallery-modal-close,
        .gallery-modal-arrow {
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border: 1px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          background: rgba(255,255,255,0.12);
          color: #fff;
          cursor: pointer;
        }

        .gallery-modal-close {
          top: 24px;
          right: 28px;
        }

        .gallery-modal-arrow {
          top: 50%;
          transform: translateY(-50%);
        }

        .gallery-modal-arrow-left {
          left: 28px;
        }

        .gallery-modal-arrow-right {
          right: 28px;
        }

        .gallery-modal-counter {
          position: absolute;
          bottom: 24px;
          left: 50%;
          padding: 8px 14px;
          border-radius: 999px;
          background: rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.86);
          font-size: 13px;
          transform: translateX(-50%);
        }

        .listing-detail-content {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 320px;
          align-items: start;
          gap: 28px;
          margin-top: 24px;
        }

        .listing-detail-heading {
          margin-bottom: 20px;
        }

        .listing-detail-title {
          margin: 8px 0 12px;
          color: #0a2e5c;
          font-family: "DM Sans", sans-serif;
          font-size: 38px;
          line-height: 1.12;
        }

        .listing-about-location {
          display: flex;
          align-items: center;
          gap: 6px;
          min-width: 0;
          margin-bottom: 12px;
          color: #53657b;
          font-size: 15px;
          font-weight: 600;
        }

        .listing-about-location-text {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .listing-about-price-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          min-width: 0;
        }

        .listing-about-panel {
          align-self: start;
          padding: 22px;
          border: 1px solid #e4eaf0;
          border-radius: 14px;
          background: #f7f8fc;
        }

        .listing-about-title {
          margin: 0 0 12px;
          color: #0a2e5c;
          font-size: 17px;
          font-weight: 700;
        }

        .listing-about-price {
          display: inline-block;
          width: fit-content;
          max-width: 100%;
          padding: 8px 10px;
          border-radius: 9px;
          background: #0a2e5c;
          color: #fff;
          font-size: 21px;
          line-height: 1.2;
          white-space: normal;
        }

        .listing-about-actions {
          display: flex;
          align-items: center;
          gap: 5px;
          flex: 0 0 auto;
        }

        .listing-about-views {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 7px 8px;
          border-radius: 8px;
          background: #fff;
          color: #53657b;
          font-size: 11px;
          white-space: nowrap;
        }

        .listing-about-share {
          display: flex;
          width: 34px;
          height: 34px;
          align-items: center;
          justify-content: center;
          padding: 0;
          border: 1px solid #dce5ef;
          border-radius: 8px;
          background: #fff;
          color: #1a6dd4;
          cursor: pointer;
        }

        .listing-about-facts {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 6px;
          margin-top: 14px;
        }

        .listing-detail-fact {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 3px;
          min-width: 0;
          padding: 7px 3px;
          border: 1px solid #e6edf5;
          border-radius: 8px;
          background: #fff;
          color: #53657b;
          font-size: 10px;
          text-align: center;
        }

        .listing-detail-fact svg {
          flex: 0 0 11px;
          width: 11px;
          height: 11px;
        }

        .listing-about-contact {
          display: flex;
          min-height: 46px;
          align-items: center;
          justify-content: center;
          margin-top: 14px;
          padding: 10px 14px;
          border-radius: 9px;
          background: #1a6dd4;
          color: #fff;
          font-weight: 700;
          text-align: center;
          text-decoration: none;
        }

        .listing-detail-main {
          display: grid;
          gap: 18px;
          min-width: 0;
        }

        .listing-detail-section {
          padding: 20px;
          border: 1px solid #e4eaf0;
          border-radius: 14px;
          background: #fff;
        }

        .listing-amenities-list {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 8px 12px;
          margin-top: 14px;
        }

        .listing-amenity {
          display: flex;
          align-items: center;
          gap: 7px;
          min-width: 0;
          color: #53657b;
          font-size: 13px;
          line-height: 1.35;
        }

        .listing-photo-indicators {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          padding: 0 3px;
        }

        .listing-photo-indicator {
          display: block;
          width: 7px;
          height: 7px;
          padding: 0;
          border: 0;
          border-radius: 999px;
          background: rgba(255,255,255,0.55);
          cursor: pointer;
        }

        .listing-photo-indicator-active {
          width: 16px;
          background: #fff;
        }

        .listing-mobile-contact-bar {
          display: none;
        }

        .listing-detail-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 13px;
          border-radius: 10px;
          background: #f4f7fb;
          color: #53657b;
          font-size: 14px;
        }

        @media (max-width: 820px) {
          .listing-gallery {
            grid-template-columns: 1fr;
            height: auto;
          }

          .listing-gallery-side {
            height: 180px;
          }

          .listing-detail-content {
            grid-template-columns: 1fr;
            gap: 18px;
          }

          .listing-about-panel {
            order: -1;
          }

          .gallery-modal {
            padding: 20px;
          }

          .gallery-modal-arrow-left {
            left: 14px;
          }

          .gallery-modal-arrow-right {
            right: 14px;
          }
        }

        @media (max-width: 520px) {
          .listing-details-page {
            padding-bottom: 104px !important;
          }

          .listing-gallery {
            display: block;
            height: auto;
            border-radius: 14px;
          }

          .listing-gallery-main {
            height: clamp(210px, 65vw, 300px);
            border-radius: 14px;
          }

          .listing-detail-title {
            font-size: 25px;
          }

          .listing-detail-heading {
            margin-bottom: 14px;
          }

          .listing-about-panel,
          .listing-detail-section {
            padding: 16px;
          }

          .listing-about-location {
            font-size: 16px;
          }

          .listing-about-price {
            padding: 7px 8px;
            font-size: clamp(13px, 4.2vw, 17px);
          }

          .listing-about-views {
            gap: 3px;
            padding: 6px;
            font-size: 10px;
          }

          .listing-about-share {
            width: 30px;
            height: 30px;
          }

          .listing-about-facts {
            gap: 5px;
          }

          .listing-detail-fact {
            font-size: 9px;
          }

          .listing-detail-fact svg {
            flex-basis: 10px;
            width: 10px;
            height: 10px;
          }

          .listing-detail-section h2 {
            font-size: 20px !important;
          }

          .listing-amenities-list {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 6px 8px;
            margin-top: 12px;
          }

          .listing-amenity {
            gap: 6px;
            font-size: 11px;
          }

          .listing-about-contact {
            display: none;
          }

          .listing-mobile-contact-bar {
            position: fixed;
            right: 0;
            bottom: 0;
            left: 0;
            z-index: 1000;
            display: block;
            padding: 12px 16px calc(12px + env(safe-area-inset-bottom));
            border-top: 1px solid #e4eaf0;
            background: rgba(255,255,255,0.96);
            box-shadow: 0 -8px 24px rgba(10,46,92,0.08);
            backdrop-filter: blur(10px);
          }

          .listing-mobile-contact-link {
            display: flex;
            min-height: 48px;
            align-items: center;
            justify-content: center;
            gap: 8px;
            border-radius: 9px;
            background: #1a6dd4;
            color: #fff;
            font-size: 14px;
            font-weight: 700;
            text-decoration: none;
          }

          .listing-gallery-side {
            display: none;
          }

          .listing-mobile-gallery-controls {
            position: absolute;
            right: 10px;
            bottom: 10px;
            z-index: 4;
            display: flex;
            align-items: center;
            gap: 5px;
            padding: 5px;
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 999px;
            background: rgba(10,46,92,0.34);
            color: #fff;
            backdrop-filter: blur(5px);
          }

          .listing-mobile-gallery-controls > button {
            display: grid;
            width: 30px;
            height: 30px;
            padding: 0;
            place-items: center;
            border: 0;
            border-radius: 50%;
            background: transparent;
            color: #fff;
            cursor: pointer;
          }

          .listing-mobile-gallery-count {
            min-width: 38px;
            color: #fff;
            font-size: 11px;
            font-weight: 700;
            text-align: center;
          }

          .listing-gallery-more {
            display: none;
          }

          .gallery-modal-image {
            max-width: 92vw;
            max-height: 72vh;
          }

          .gallery-modal-close {
            top: 16px;
            right: 16px;
          }
        }
      `}</style>

      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 24,
            color: "#0a2e5c",
            textDecoration: "none",
            fontWeight: 700,
          }}
        >
          <ArrowLeft size={18} />
          Retour aux annonces
        </Link>

        <div className="listing-detail-heading">
          <span
            style={{
              color: "#1a6dd4",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
            }}
          >
            {listingType}{listing.offerType === "rent" ? " · À louer" : listing.offerType === "sale" ? " · À vendre" : ""}
          </span>
          <h1 className="listing-detail-title">{listingTitle}</h1>
        </div>

        <div
          className="listing-gallery"
          onTouchStart={handleGalleryTouchStart}
          onTouchEnd={handleGalleryTouchEnd}
          onTouchCancel={() => {
            galleryTouchStartXRef.current = null;
          }}
        >
          <button
            type="button"
            className="listing-gallery-image listing-gallery-main"
            onClick={() => {
              if (Date.now() < ignoreGalleryClickUntilRef.current) {
                ignoreGalleryClickUntilRef.current = 0;
                return;
              }
              setIsGalleryOpen(true);
            }}
            aria-label={`Ouvrir la photo ${activeImageIndex + 1}`}
          >
            <img
              src={images[activeImageIndex]}
              alt={`${listingTitle} - photo ${activeImageIndex + 1}`}
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = LISTING_IMAGE_PLACEHOLDER;
              }}
            />

            {images.length > 1 && (
              <span className="listing-gallery-more">
                Voir les {images.length} photos
                <ArrowRight size={15} />
              </span>
            )}
          </button>

          <div className="listing-gallery-side">
            {images.slice(1, 5).map((image, index) => (
              <button
                type="button"
                key={image}
                className="listing-gallery-image"
                onClick={() => {
                  setActiveImageIndex(index + 1);
                  setIsGalleryOpen(true);
                }}
                aria-label={`Ouvrir la photo ${index + 2}`}
              >
                <img
                  src={image}
                  alt={`${listingTitle} - photo ${index + 2}`}
                />
              </button>
            ))}
          </div>

          {images.length > 1 && (
            <div className="listing-mobile-gallery-controls" aria-label="Navigation des photos">
              <button
                type="button"
                onClick={showPreviousImage}
                aria-label="Photo précédente"
              >
                <ChevronLeft size={18} aria-hidden="true" />
              </button>
              <span className="listing-photo-indicators" role="group" aria-label="Choisir une photo">
                {images.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    className={`listing-photo-indicator${activeImageIndex === index ? " listing-photo-indicator-active" : ""}`}
                    aria-label={`Afficher la photo ${index + 1}`}
                    aria-pressed={activeImageIndex === index}
                    onClick={() => setActiveImageIndex(index)}
                  />
                ))}
              </span>
              <button
                type="button"
                onClick={showNextImage}
                aria-label="Photo suivante"
              >
                <ChevronRight size={18} aria-hidden="true" />
              </button>
            </div>
          )}
        </div>

        <div className="listing-detail-content">
          <div className="listing-detail-main">
            <section className="listing-detail-section">
              <h2 style={sectionTitleStyle}>Description du bien</h2>
              <ListingDescription
                text={listing.description || "Description à compléter."}
              />
            </section>

            {listing.features && listing.features.length > 0 && (
              <section className="listing-detail-section">
                <h2 style={sectionTitleStyle}>Commodités</h2>
                <div className="listing-amenities-list">
                  {listing.features.map((feature) => (
                    <div key={feature} className="listing-amenity">
                      <Check size={15} color="#1a6dd4" />
                      {feature}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="listing-about-panel">
            <h2 className="listing-about-title">À propos de ce bien</h2>
            <div className="listing-about-location">
              <MapPin size={15} color="#1a6dd4" aria-hidden="true" />
              <span className="listing-about-location-text">
                {listingNeighborhood}, Conakry
              </span>
            </div>

            <div className="listing-about-price-row">
              <strong className="listing-about-price">
                {formatListingPrice(listing.price, listing.offerType)}
              </strong>
              <span className="listing-about-actions">
                <span
                  className="listing-about-views"
                  aria-label={`${listing.viewCount ?? 0} vues`}
                >
                  <Eye size={13} color="#1a6dd4" />
                  {listing.viewCount ?? 0} vues
                </span>
                <button
                  type="button"
                  className="listing-about-share"
                  onClick={() => void handleShareListing()}
                  aria-label={
                    shareStatus === "shared"
                      ? "Annonce partagée"
                      : shareStatus === "copied"
                        ? "Lien de l’annonce copié"
                        : "Partager l’annonce"
                  }
                  title={shareStatus === "copied" ? "Lien copié" : "Partager l’annonce"}
                >
                  {shareStatus === "copied" ? <Check size={15} /> : <Share2 size={15} />}
                </button>
              </span>
            </div>

            <div className="listing-about-facts">
              {listing.surface !== null && (
                <span className="listing-detail-fact">
                  <Maximize size={13} color="#1a6dd4" /> {listing.surface} m²
                </span>
              )}
              {!isTerrain && listing.bedrooms > 0 && (
                <span className="listing-detail-fact">
                  <BedDouble size={13} color="#1a6dd4" /> {listing.bedrooms} chambre(s)
                </span>
              )}
              {!isTerrain && listing.livingRooms > 0 && (
                <span className="listing-detail-fact">
                  <Sofa size={13} color="#1a6dd4" /> {listing.livingRooms} salon(s)
                </span>
              )}
              {!isTerrain && listing.showers > 0 && (
                <span className="listing-detail-fact">
                  <Bath size={13} color="#1a6dd4" /> {listing.showers} douche(s)
                </span>
              )}
              {listing.kitchen && (
                <span className="listing-detail-fact">
                  <CookingPot size={13} color="#1a6dd4" />
                  Cuisine {formatListingKitchen(listing.kitchen)?.toLowerCase()}
                </span>
              )}
            </div>

            <a href="tel:+224627040280" className="listing-about-contact">
              Contacter ENAFIM
            </a>
          </aside>
        </div>
      </div>

      <ListingRecommendations
        currentListing={listing}
        listings={databaseListings}
        title="Annonces similaires"
      />

      <div className="listing-mobile-contact-bar">
        <a href="tel:+224627040280" className="listing-mobile-contact-link">
          <Phone size={17} aria-hidden="true" />
          Contacter ENAFIM
        </a>
      </div>

      {isGalleryOpen && (
        <div
          className="gallery-modal"
          role="dialog"
          aria-modal="true"
          aria-label={`Galerie photos de ${listing.title}`}
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setIsGalleryOpen(false);
            }
          }}
        >
          <button
            type="button"
            className="gallery-modal-close"
            onClick={() => setIsGalleryOpen(false)}
            aria-label="Fermer la galerie"
          >
            <X size={23} />
          </button>

          {images.length > 1 && (
            <button
              type="button"
              className="gallery-modal-arrow gallery-modal-arrow-left"
              onClick={showPreviousImage}
              aria-label="Photo précédente"
            >
              <ChevronLeft size={25} />
            </button>
          )}

          <img
            className="gallery-modal-image"
            src={images[activeImageIndex]}
            alt={`${listing.title} - photo ${activeImageIndex + 1}`}
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = LISTING_IMAGE_PLACEHOLDER;
            }}
          />

          {images.length > 1 && (
            <button
              type="button"
              className="gallery-modal-arrow gallery-modal-arrow-right"
              onClick={showNextImage}
              aria-label="Photo suivante"
            >
              <ChevronRight size={25} />
            </button>
          )}

          <span className="gallery-modal-counter">
            {activeImageIndex + 1} / {images.length}
          </span>
        </div>
      )}
    </main>
  );
}

const sectionTitleStyle: React.CSSProperties = {
  margin: 0,
  color: "#0a2e5c",
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 28,
};

const paragraphStyle: React.CSSProperties = {
  maxWidth: 760,
  margin: "14px 0 0",
  color: "#66788e",
  fontSize: 16,
  lineHeight: 1.5,
};