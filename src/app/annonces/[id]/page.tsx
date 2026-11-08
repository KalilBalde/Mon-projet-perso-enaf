"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Bath,
  BedDouble,
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  MapPin,
  Maximize,
  Sofa,
  X,
} from "lucide-react";
import {
  fetchPublishedListings,
  incrementListingView,
} from "../../../lib/listings/database";
import { listingRepository } from "../../../lib/listings/repository";
import ListingRecommendations from "../../../components/shared/ListingRecommendations";
import type { Listing } from "../../../types";
import { formatListingPrice } from "../../../utils/format";

interface ListingDetailsPageProps {
  params: {
    id: string;
  };
}

export default function ListingDetailsPage({
  params,
}: ListingDetailsPageProps) {
  const [databaseListings, setDatabaseListings] = useState<Listing[]>([]);
  const [isDatabaseLoading, setIsDatabaseLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

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
      : [listing.image]
    : [];

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
            fontFamily: "'Playfair Display', serif",
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
          display: grid;
          grid-template-columns: minmax(0, 1.3fr) minmax(0, 0.7fr);
          gap: 10px;
          height: 480px;
          overflow: hidden;
          border-radius: 18px;
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
          gap: 56px;
          margin-top: 48px;
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
            gap: 32px;
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
          .listing-gallery-side {
            height: 140px;
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

        <div className="listing-gallery">
          <button
            type="button"
            className="listing-gallery-image"
            onClick={() => {
              setActiveImageIndex(0);
              setIsGalleryOpen(true);
            }}
            aria-label="Ouvrir la photo principale"
          >
            <img
              src={images[0]}
              alt={`${listing.title} - photo principale`}
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
                  alt={`${listing.title} - photo ${index + 2}`}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="listing-detail-content">
          <div>
            <span
              style={{
                color: "#1a6dd4",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
              }}
            >
              {listing.type}{listing.offerType === "rent" ? " · À louer" : listing.offerType === "sale" ? " · À vendre" : ""}
            </span>

            <h1
              style={{
                margin: "10px 0 8px",
                color: "#0a2e5c",
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(32px, 5vw, 54px)",
                lineHeight: 1.1,
              }}
            >
              {listing.title}
            </h1>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                color: "#718198",
              }}
            >
              <MapPin size={17} color="#1a6dd4" />
              {listing.quartier}, Conakry
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
                marginTop: 28,
              }}
            >
              <span className="listing-detail-badge">
                <Maximize size={16} color="#1a6dd4" />
                {listing.surface} m²
              </span>

              <span className="listing-detail-badge">
                <Eye size={16} color="#1a6dd4" />
                {listing.viewCount ?? 0} vues
              </span>

              {!isTerrain && listing.bedrooms > 0 && (
                <span className="listing-detail-badge">
                  <BedDouble size={16} color="#1a6dd4" />
                  {listing.bedrooms} chambre(s)
                </span>
              )}

              {!isTerrain && listing.livingRooms > 0 && (
                <span className="listing-detail-badge">
                  <Sofa size={16} color="#1a6dd4" />
                  {listing.livingRooms} salon(s)
                </span>
              )}

              {!isTerrain && listing.showers > 0 && (
                <span className="listing-detail-badge">
                  <Bath size={16} color="#1a6dd4" />
                  {listing.showers} douche(s)
                </span>
              )}
            </div>

            <div style={{ marginTop: 44 }}>
              <h2 style={sectionTitleStyle}>Description</h2>

              <p style={paragraphStyle}>
                {listing.description || "Description à compléter."}
              </p>
            </div>

            {listing.features && listing.features.length > 0 && (
              <div style={{ marginTop: 40 }}>
                <h2 style={sectionTitleStyle}>Commodités</h2>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(2, minmax(0, 1fr))",
                    gap: 14,
                    marginTop: 18,
                  }}
                >
                  {listing.features.map((feature) => (
                    <div
                      key={feature}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        color: "#53657b",
                      }}
                    >
                      <Check size={17} color="#1a6dd4" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside
            style={{
              alignSelf: "start",
              padding: 28,
              border: "1px solid #e4eaf0",
              borderRadius: 18,
              boxShadow: "0 14px 36px rgba(10,46,92,0.08)",
            }}
          >
            <span style={{ color: "#718198", fontSize: 13 }}>
              Prix indiqué
            </span>

            <strong
              style={{
                display: "block",
                marginTop: 8,
                color: "#0a2e5c",
                fontSize: 28,
              }}
            >
              {formatListingPrice(listing.price, listing.offerType)}
            </strong>

            <a
              href="tel:+224627040280"
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: 24,
                padding: "14px 18px",
                borderRadius: 12,
                background: "#1a6dd4",
                color: "#fff",
                textDecoration: "none",
                fontWeight: 700,
              }}
            >
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
  fontFamily: "'Playfair Display', serif",
  fontSize: 28,
};

const paragraphStyle: React.CSSProperties = {
  maxWidth: 760,
  margin: "14px 0 0",
  color: "#66788e",
  fontSize: 16,
  lineHeight: 1.8,
};