import ListingScroller from "./ListingScroller";
import type { Listing } from "../../types";

interface ListingRecommendationsProps {
  listings: readonly Listing[];
  title: string;
  currentListing?: Listing;
}

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function getRecommendations(
  listings: readonly Listing[],
  currentListing?: Listing,
): Listing[] {
  if (!currentListing) {
    return listings.slice(0, 10);
  }

  return listings
    .filter((listing) => listing.id !== currentListing.id)
    .map((listing) => {
      let score = 0;

      if (normalize(listing.quartier) === normalize(currentListing.quartier)) {
        score += 4;
      }

      if (normalize(listing.type) === normalize(currentListing.type)) {
        score += 3;
      }

      if (listing.offerType && listing.offerType === currentListing.offerType) {
        score += 1;
      }

      if (currentListing.price > 0) {
        const priceDifference =
          Math.abs(listing.price - currentListing.price) / currentListing.price;

        if (priceDifference <= 0.25) {
          score += 2;
        } else if (priceDifference <= 0.5) {
          score += 1;
        }
      }

      return { listing, score };
    })
    .sort(
      (a, b) =>
        b.score - a.score ||
        (b.listing.priority ?? 0) - (a.listing.priority ?? 0),
    )
    .slice(0, 10)
    .map(({ listing }) => listing);
}

export default function ListingRecommendations({
  listings,
  title,
  currentListing,
}: ListingRecommendationsProps) {
  const recommendations = getRecommendations(listings, currentListing);

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <section
      style={{
        padding: "32px 24px 40px",
        background: "#f7f9fc",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div style={{ width: "100%", maxWidth: 1440, margin: "0 auto" }}>
        <div style={{ marginBottom: 18 }}>
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
            ENAFIM Guinée
          </span>
          <h2
            style={{
              margin: 0,
              color: "#0a2e5c",
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(22px, 4vw, 34px)",
              lineHeight: 1.15,
            }}
          >
            {title}
          </h2>
        </div>
        <ListingScroller listings={recommendations} label={title} />
      </div>
    </section>
  );
}
