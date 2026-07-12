"use client";

import { useState, useEffect } from "react";
import { Phone, Menu, X, User, Info } from "lucide-react";
import { LOGO_SRC, NAV_LINKS } from "../../data/constants";

/* ═══════════════════ NAVBAR ═══════════════════ */

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      background: "#fff",
      borderBottom: "1px solid #e8ecf2",
      boxShadow: scrolled ? "0 2px 16px rgba(0,0,0,0.07)" : "none",
      transition: "box-shadow 0.3s", fontFamily: "'DM Sans', sans-serif",
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", height: 80, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <img src={LOGO_SRC} alt="ENAFIM Guinee" style={{ height: 56, width: "auto", borderRadius: 8, objectFit: "contain" }} />
          <div style={{ lineHeight: 1.15 }}>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 800, color: "#0a2e5c", display: "block" }}>ENAFIM</span>
            <span style={{ fontSize: 11, color: "#888", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase" }}>Guinee</span>
          </div>
        </div>

        {/* Links */}
        <div style={{ display: "flex", gap: 4, alignItems: "center" }} className="desktop-nav">
          {NAV_LINKS.map((lnk) => (
            <a key={lnk.label} href={lnk.href} style={{ padding: "8px 16px", fontSize: 14, fontWeight: 500, color: "#0a2e5c", textDecoration: "none", borderRadius: 8, transition: "all 0.2s" }}
              onMouseEnter={(e) => { (e.target as HTMLElement).style.background = "#f0f6ff"; (e.target as HTMLElement).style.color = "#1a6dd4"; }}
              onMouseLeave={(e) => { (e.target as HTMLElement).style.background = "transparent"; (e.target as HTMLElement).style.color = "#0a2e5c"; }}
            >{lnk.label}</a>
          ))}
        </div>

        {/* Right */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }} className="desktop-nav">
          <a href="#contact" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#666", textDecoration: "none" }}>
            <Phone size={14} /> +224 620 41 75 63
          </a>
          <a href="#nous-connaitre" style={{ padding: "9px 18px", color: "#0a2e5c", border: "2px solid #d0dbe8", borderRadius: 10, fontSize: 13, fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: 6, transition: "all 0.2s" }}
            onMouseEnter={(e) => { (e.target as HTMLElement).style.borderColor = "#1a6dd4"; (e.target as HTMLElement).style.color = "#1a6dd4"; }}
            onMouseLeave={(e) => { (e.target as HTMLElement).style.borderColor = "#d0dbe8"; (e.target as HTMLElement).style.color = "#0a2e5c"; }}
          ><Info size={14} /> Nous connaitre</a>
          <a href="#espace-personnel" style={{ padding: "9px 18px", background: "#0a2e5c", color: "#fff", borderRadius: 10, fontSize: 13, fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: 6, transition: "all 0.2s", border: "none" }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.background = "#1a6dd4")}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.background = "#0a2e5c")}
          ><User size={14} /> Mon espace</a>
        </div>

        <button className="mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)} style={{ display: "none", background: "none", border: "none", cursor: "pointer", padding: 8 }}>
          {mobileOpen ? <X size={24} color="#0a2e5c" /> : <Menu size={24} color="#0a2e5c" />}
        </button>
      </div>

      {mobileOpen && (
        <div style={{ padding: "16px 24px 24px", background: "#fff", borderTop: "1px solid #f0f0f0" }}>
          {NAV_LINKS.map((lnk) => (
            <a key={lnk.label} href={lnk.href} style={{ display: "block", padding: "14px 0", fontSize: 16, fontWeight: 500, color: "#0a2e5c", textDecoration: "none", borderBottom: "1px solid #f5f5f5" }}>{lnk.label}</a>
          ))}
          <div style={{ display: "flex", gap: 8, marginTop: 16, flexDirection: "column" }}>
            <a href="#nous-connaitre" style={{ width: "100%", padding: 13, background: "#f0f6ff", color: "#0a2e5c", borderRadius: 12, fontSize: 15, fontWeight: 600, textAlign: "center", textDecoration: "none" }}>Nous connaitre</a>
            <a href="#espace-personnel" style={{ width: "100%", padding: 13, background: "#0a2e5c", color: "#fff", borderRadius: 12, fontSize: 15, fontWeight: 600, textAlign: "center", textDecoration: "none" }}>Mon espace personnel</a>
          </div>
        </div>
      )}
    </nav>
  );
}
