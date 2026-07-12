"use client";

import { useState } from "react";
import { Search, MapPin, Home, ChevronDown, TrendingUp } from "lucide-react";
import type { SearchFilters } from "../../types";
import { PROPERTY_TYPES, QUARTIERS } from "../../data/constants";

/* ═══════════════════ SEARCH BAR ═══════════════════ */

export default function SearchBar() {
  const [filters, setFilters] = useState<SearchFilters>({ type: "Tous types", quartier: "Tous les quartiers", budgetMax: "" });
  const [activeDD, setActiveDD] = useState<string | null>(null);

  const selBtn: React.CSSProperties = { width: "100%", padding: "14px 16px", background: "#fff", border: "2px solid #e4eaf0", borderRadius: 12, fontSize: 15, color: "#0a2e5c", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", fontFamily: "'DM Sans', sans-serif", fontWeight: 500 };
  const ddBox: React.CSSProperties = { position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, background: "#fff", borderRadius: 12, boxShadow: "0 12px 40px rgba(0,0,0,0.15)", zIndex: 100, border: "1px solid #e4eaf0", maxHeight: 240, overflowY: "auto" };

  return (
    <div style={{ maxWidth: 800, margin: "-44px auto 0", padding: "0 24px", position: "relative", zIndex: 10 }}>
      <div style={{ background: "#fff", borderRadius: 20, padding: 20, boxShadow: "0 12px 48px rgba(10,46,92,0.12)", border: "1px solid #edf1f7" }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }} className="search-bar-inner">
          {/* Type */}
          <div style={{ position: "relative", flex: 1, minWidth: 0 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#8a9bb5", marginBottom: 6, textTransform: "uppercase", letterSpacing: "1.5px", textAlign: "left" }}>Type de bien</label>
            <button style={selBtn} onClick={() => setActiveDD(activeDD === "type" ? null : "type")}>
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}><Home size={16} color="#1a6dd4" />{filters.type}</span>
              <ChevronDown size={16} color="#999" />
            </button>
            {activeDD === "type" && <div style={ddBox}>{PROPERTY_TYPES.map((t) => (
              <div key={t} style={{ padding: "12px 16px", fontSize: 14, color: filters.type === t ? "#1a6dd4" : "#333", cursor: "pointer", background: filters.type === t ? "#f0f6ff" : "transparent", fontWeight: filters.type === t ? 600 : 400, fontFamily: "'DM Sans', sans-serif" }}
                onClick={() => { setFilters({ ...filters, type: t }); setActiveDD(null); }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.background = filters.type === t ? "#f0f6ff" : "#f9f9f9")}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.background = filters.type === t ? "#f0f6ff" : "transparent")}
              >{t}</div>
            ))}</div>}
          </div>
          {/* Quartier */}
          <div style={{ position: "relative", flex: 1, minWidth: 0 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#8a9bb5", marginBottom: 6, textTransform: "uppercase", letterSpacing: "1.5px", textAlign: "left" }}>Quartier</label>
            <button style={selBtn} onClick={() => setActiveDD(activeDD === "q" ? null : "q")}>
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}><MapPin size={16} color="#1a6dd4" />{filters.quartier}</span>
              <ChevronDown size={16} color="#999" />
            </button>
            {activeDD === "q" && <div style={ddBox}>{QUARTIERS.map((q) => (
              <div key={q} style={{ padding: "12px 16px", fontSize: 14, color: filters.quartier === q ? "#1a6dd4" : "#333", cursor: "pointer", background: filters.quartier === q ? "#f0f6ff" : "transparent", fontWeight: filters.quartier === q ? 600 : 400, fontFamily: "'DM Sans', sans-serif" }}
                onClick={() => { setFilters({ ...filters, quartier: q }); setActiveDD(null); }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.background = filters.quartier === q ? "#f0f6ff" : "#f9f9f9")}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.background = filters.quartier === q ? "#f0f6ff" : "transparent")}
              >{q}</div>
            ))}</div>}
          </div>
          {/* Budget */}
          <div style={{ position: "relative", flex: 1, minWidth: 0 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#8a9bb5", marginBottom: 6, textTransform: "uppercase", letterSpacing: "1.5px", textAlign: "left" }}>Budget max (GNF)</label>
            <div style={{ position: "relative" }}>
              <input type="text" placeholder="Ex : 5 000 000" value={filters.budgetMax} onChange={(e) => setFilters({ ...filters, budgetMax: e.target.value })}
                style={{ width: "100%", padding: "14px 16px 14px 40px", background: "#fff", border: "2px solid #e4eaf0", borderRadius: 12, fontSize: 15, color: "#0a2e5c", outline: "none", fontFamily: "'DM Sans', sans-serif", fontWeight: 500, boxSizing: "border-box" }} />
              <TrendingUp size={16} color="#1a6dd4" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
            </div>
          </div>
        </div>
        <button style={{ width: "100%", marginTop: 16, padding: "16px 32px", background: "linear-gradient(135deg, #1a6dd4 0%, #2b82f0 100%)", color: "#fff", border: "none", borderRadius: 14, fontSize: 16, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontFamily: "'DM Sans', sans-serif", boxShadow: "0 8px 32px rgba(26,109,212,0.35)", letterSpacing: "0.3px", transition: "all 0.3s" }}
          onMouseEnter={(e) => { (e.target as HTMLElement).style.transform = "translateY(-2px)"; (e.target as HTMLElement).style.boxShadow = "0 14px 44px rgba(26,109,212,0.45)"; }}
          onMouseLeave={(e) => { (e.target as HTMLElement).style.transform = "translateY(0)"; (e.target as HTMLElement).style.boxShadow = "0 8px 32px rgba(26,109,212,0.35)"; }}
        ><Search size={18} /> Rechercher un bien</button>
      </div>
    </div>
  );
}
