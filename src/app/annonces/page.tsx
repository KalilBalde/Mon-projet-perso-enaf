import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ListingCard from "../../components/shared/ListingCard";
import { listingRepository } from "../../lib/listings/repository";

export default function ListingsPage() {
  const listings = listingRepository.findAll();

  return (
    <main
      style={{
        minHeight: "100vh",
        paddingTop: 112,
        paddingBottom: 64,
        background: "#fff",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <style>{`
        .all-listings-container {
          width: 100%;
          max-width: 1180px;
          margin: 0 auto;
          padding: 0 16px;
        }

        .all-listings-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 22px;
          align-items: stretch;
        }

        .all-listings-item {
          display: flex;
          min-width: 0;
        }

        .all-listings-item > article {
          width: 100%;
        }

        .all-listings-title {
          margin: 0;
          color: #0a2e5c;
          font-family: "Playfair Display", serif;
          font-size: clamp(28px, 7vw, 46px);
          line-height: 1.1;
        }

        .all-listings-description {
          max-width: 560px;
          margin: 10px 0 0;
          color: #718198;
          font-size: 14px;
          line-height: 1.6;
        }

        @media (max-width: 850px) {
          .all-listings-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 14px;
          }
        }

        @media (max-width: 600px) {
          .all-listings-main {
            padding-top: 96px !important;
            padding-bottom: 36px !important;
          }

          .all-listings-container {
            padding: 0 12px;
          }

          .all-listings-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 10px;
          }

          .all-listings-title {
            font-size: 30px;
          }

          .all-listings-description {
            font-size: 13px;
          }
        }
      `}</style>

      <div className="all-listings-container">
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            marginBottom: 24,
            color: "#1a6dd4",
            fontSize: 13,
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          <ArrowLeft size={17} />
          Retour à l&apos;accueil
        </Link>

        <div style={{ marginBottom: 26 }}>
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
            Catalogue ENAFIM
          </span>

          <h1 className="all-listings-title">
            Toutes les annonces
          </h1>

          <p className="all-listings-description">
            Découvrez les biens actuellement proposés par ENAFIM.
          </p>
        </div>

        {listings.length > 0 ? (
          <div className="all-listings-grid">
            {listings.map((listing) => (
              <div
                className="all-listings-item"
                key={listing.id}
              >
                <ListingCard listing={listing} />
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              padding: "32px 18px",
              border: "1px solid #e4eaf0",
              borderRadius: 14,
              background: "#f7f9fc",
              color: "#718198",
              textAlign: "center",
            }}
          >
            Aucune annonce disponible pour le moment.
          </div>
        )}
      </div>
    </main>
  );
}