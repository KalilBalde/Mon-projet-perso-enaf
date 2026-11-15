import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { fetchPublishedListings } from "../../lib/listings/database";
import ListingsCatalog from "../../components/shared/ListingsCatalog";

export const dynamic = "force-dynamic";

export default async function ListingsPage() {
  const databaseListings = await fetchPublishedListings();

  return (
    <main
      className="all-listings-main"
      style={{
        minHeight: "100vh",
        paddingTop: 112,
        paddingBottom: 64,
        background: "#fff",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <style suppressHydrationWarning>{`
        .all-listings-container {
          width: 100%;
          max-width: 1440px;
          margin: 0 auto;
          padding: 0 24px;
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
          font-family: "DM Sans", sans-serif;
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

        .catalog-filter-form {
          margin-bottom: 22px;
        }

        .catalog-filter-toolbar {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          align-items: start;
          gap: 10px;
        }

        .catalog-search-field {
          display: flex;
          min-width: 0;
          min-height: 46px;
          align-items: center;
          gap: 9px;
          padding: 0 13px;
          border: 1px solid #dce5ef;
          border-radius: 9px;
          background: #fff;
          color: #1a6dd4;
        }

        .catalog-search-field input {
          width: 100%;
          min-width: 0;
          border: 0;
          outline: 0;
          background: transparent;
          color: #0a2e5c;
          font: inherit;
          font-size: 14px;
        }

        .catalog-search-field input::placeholder {
          color: #8794a7;
        }

        .catalog-filter-details {
          position: relative;
        }

        .catalog-filter-summary {
          display: flex;
          min-height: 46px;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 0 14px;
          border: 1px solid #dce5ef;
          border-radius: 9px;
          background: #fff;
          color: #0a2e5c;
          cursor: pointer;
          font-size: 13px;
          font-weight: 700;
          list-style: none;
          white-space: nowrap;
        }

        .catalog-filter-summary::-webkit-details-marker {
          display: none;
        }

        .catalog-filter-count {
          display: grid;
          width: 20px;
          height: 20px;
          place-items: center;
          border-radius: 50%;
          background: #edf5ff;
          color: #1a6dd4;
          font-size: 11px;
        }

        .catalog-filter-panel {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
          margin-top: 10px;
          padding: 16px;
          border: 1px solid #e4eaf0;
          border-radius: 10px;
          background: #f8fafc;
        }

        .catalog-filter-field {
          display: grid;
          align-content: start;
          gap: 6px;
          min-width: 0;
          color: #53657b;
          font-size: 12px;
          font-weight: 700;
        }

        .catalog-filter-field input:not([type="checkbox"]),
        .catalog-filter-field select {
          width: 100%;
          min-width: 0;
          min-height: 40px;
          padding: 8px 10px;
          border: 1px solid #dce5ef;
          border-radius: 7px;
          background: #fff;
          color: #0a2e5c;
          font: inherit;
          font-size: 13px;
          font-weight: 500;
        }

        .catalog-filter-range {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 8px;
        }

        .catalog-filter-wide {
          grid-column: 1 / -1;
        }

        .catalog-filter-amenities {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 8px;
        }

        .catalog-filter-amenity {
          display: flex;
          min-width: 0;
          min-height: 38px;
          align-items: center;
          gap: 6px;
          padding: 7px 8px;
          border: 1px solid #dce5ef;
          border-radius: 7px;
          background: #fff;
          color: #53657b;
          font-size: 12px;
          font-weight: 500;
        }

        .catalog-filter-amenity input[type="checkbox"] {
          flex: 0 0 16px;
          width: 16px;
          height: 16px;
          min-height: 0;
          margin: 0;
          padding: 0;
          accent-color: #1a6dd4;
        }

        .catalog-filter-actions {
          display: flex;
          grid-column: 1 / -1;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding-top: 12px;
          border-top: 1px solid #e4eaf0;
        }

        .catalog-filter-reset {
          color: #53657b;
          font-size: 12px;
          font-weight: 600;
          text-decoration: none;
        }

        .catalog-filter-submit {
          min-height: 40px;
          padding: 9px 16px;
          border: 0;
          border-radius: 7px;
          background: #1a6dd4;
          color: #fff;
          cursor: pointer;
          font-size: 13px;
          font-weight: 700;
        }

        .catalog-results-count {
          margin: 0 0 14px;
          color: #718198;
          font-size: 13px;
        }

        .all-listings-bottom {
          display: flex;
          justify-content: center;
          padding-top: 48px;
        }

        .all-listings-bottom-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 44px;
          padding: 11px 18px;
          border: 1px solid #0a2e5c;
          border-radius: 9px;
          background: #0a2e5c;
          color: #fff;
          font-size: 13px;
          font-weight: 700;
          text-decoration: none;
          transition: background 0.2s ease, transform 0.2s ease;
        }

        .all-listings-bottom-link:hover {
          background: #1a6dd4;
          transform: translateY(-2px);
        }

        @media (max-width: 850px) {
          .all-listings-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 14px;
          }

          .catalog-filter-panel {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 600px) {
          .all-listings-main {
            padding-top: 96px !important;
            padding-bottom: 40px !important;
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

          .catalog-filter-form {
            margin-bottom: 16px;
          }

          .catalog-filter-toolbar {
            grid-template-columns: minmax(0, 1fr) auto;
            gap: 7px;
          }

          .catalog-search-field {
            min-height: 42px;
            gap: 7px;
            padding: 0 10px;
          }

          .catalog-search-field input {
            font-size: 13px;
          }

          .catalog-filter-summary {
            min-height: 42px;
            gap: 5px;
            padding: 0 9px;
            font-size: 12px;
          }

          .catalog-filter-panel {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 10px;
            padding: 12px;
          }

          .catalog-filter-field input:not([type="checkbox"]),
          .catalog-filter-field select {
            font-size: 12px;
          }

          .all-listings-bottom {
            padding-top: 36px;
          }

          .all-listings-bottom-link {
            width: 100%;
            max-width: 300px;
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

        <ListingsCatalog listings={databaseListings} />

        <div className="all-listings-bottom">
          <Link href="/" className="all-listings-bottom-link">
            <ArrowLeft size={17} />
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </main>
  );
}