"use client";

import { useState } from "react";
import { MapPin, Heart, BedDouble, Bath, Maximize, LandPlot } from "lucide-react";
import type { Listing } from "../../types";
import { formatPrice } from "../../utils/format";

/* ═══════════════════ LISTING CARD ═══════════════════ */

export default function ListingCard({ listing }: { listing: Listing }) {
  const [hov, setHov] = useState(false);
  const [fav, setFav] = useState(listing.isFavorite);
  const isTerrain = listing.type === "Terrain-Vide";
  return (
    <article style={{ background: "#fff", borderRadius: 18, overflow: "hidden", transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)", cursor: "pointer", boxShadow: hov ? "0 24px 64px rgba(10,46,92,0.14)" : "0 4px 20px rgba(10,46,92,0.06)", transform: hov ? "translateY(-8px)" : "translateY(0)", fontFamily: "'DM Sans', sans-serif", border: "1px solid #edf1f7" }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      <div style={{ position: "relative", paddingTop: "62%", overflow: "hidden" }}>
        <img src={listing.image} alt={listing.title} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.7s cubic-bezier(0.4,0,0.2,1)", transform: hov ? "scale(1.08)" : "scale(1)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 55%)" }} />
        {listing.isNew && <div style={{ position: "absolute", top: 14, left: 14, padding: "5px 12px", background: "#1a6dd4", color: "#fff", fontSize: 11, fontWeight: 700, borderRadius: 8, letterSpacing: "0.8px", textTransform: "uppercase" }}>Nouveau</div>}
        <div style={{ position: "absolute", top: 14, right: 56, padding: "5px 12px", background: "rgba(255,255,255,0.92)", backdropFilter: "blur(8px)", color: "#0a2e5c", fontSize: 11, fontWeight: 600, borderRadius: 8 }}>{listing.type}</div>
        <button onClick={(e) => { e.stopPropagation(); setFav(!fav); }} style={{ position: "absolute", top: 12, right: 12, width: 36, height: 36, borderRadius: 10, background: fav ? "#1a6dd4" : "rgba(255,255,255,0.9)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(8px)" }}>
          <Heart size={16} color={fav ? "#fff" : "#1a6dd4"} fill={fav ? "#fff" : "none"} />
        </button>
        <div style={{ position: "absolute", bottom: 14, left: 14, padding: "8px 14px", background: "rgba(10,46,92,0.88)", backdropFilter: "blur(8px)", borderRadius: 10, color: "#fff", fontSize: 16, fontWeight: 800 }}>{formatPrice(listing.price)}</div>
      </div>
      <div style={{ padding: "18px 20px 20px" }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0a2e5c", marginBottom: 6, lineHeight: 1.35 }}>{listing.title}</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 5, color: "#8a9bb5", fontSize: 13, marginBottom: 16, fontWeight: 500 }}><MapPin size={13} color="#1a6dd4" />{listing.quartier}, Conakry</div>
        <div style={{ display: "flex", gap: 6, paddingTop: 14, borderTop: "1px solid #f0f2f5", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 10px", background: "#f4f7fb", borderRadius: 8, fontSize: 12, color: "#555", fontWeight: 500 }}><Maximize size={13} color="#1a6dd4" />{listing.surface} m2</div>
          {!isTerrain && (<>
            <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 10px", background: "#f4f7fb", borderRadius: 8, fontSize: 12, color: "#555", fontWeight: 500 }}><BedDouble size={13} color="#1a6dd4" />{listing.rooms} piece{listing.rooms > 1 ? "s" : ""}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 10px", background: "#f4f7fb", borderRadius: 8, fontSize: 12, color: "#555", fontWeight: 500 }}><Bath size={13} color="#1a6dd4" />{listing.bathrooms} sdb</div>
          </>)}
          {isTerrain && <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 10px", background: "#f4f7fb", borderRadius: 8, fontSize: 12, color: "#555", fontWeight: 500 }}><LandPlot size={13} color="#1a6dd4" />Terrain</div>}
        </div>
      </div>
    </article>
  );
}
