"use client";

import { ArrowRight } from "lucide-react";

/* ═══════════════════ BOUTON "VOIR TOUT" ═══════════════════ */

export default function ViewAllButton() {
  return (
    <button style={{ padding: "12px 24px", background: "transparent", border: "2px solid #0a2e5c", borderRadius: 12, fontSize: 14, fontWeight: 600, color: "#0a2e5c", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s" }}
      onMouseEnter={(e) => { (e.target as HTMLElement).style.background = "#0a2e5c"; (e.target as HTMLElement).style.color = "#fff"; }}
      onMouseLeave={(e) => { (e.target as HTMLElement).style.background = "transparent"; (e.target as HTMLElement).style.color = "#0a2e5c"; }}
    >Voir tout <ArrowRight size={16} /></button>
  );
}
