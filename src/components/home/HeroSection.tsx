"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HERO_SLIDES } from "../../data/constants";
import SearchBar from "../shared/SearchBar";

/* ═══════════════════ HERO SLIDER ═══════════════════ */

export default function HeroSection() {
  const [slide, setSlide] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = () => {
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(() => setSlide((p) => (p + 1) % HERO_SLIDES.length), 5500);
  };
  useEffect(() => { startTimer(); return () => { if (timer.current) clearInterval(timer.current); }; }, []);
  const goTo = (i: number) => { setSlide(i); startTimer(); };

  return (
    <section style={{ fontFamily: "'DM Sans', sans-serif", paddingTop: 80 }}>

      {/* ── Slider zone ── */}
      <div style={{ position: "relative", height: "clamp(380px, 55vh, 520px)", overflow: "hidden" }}>
        {HERO_SLIDES.map((src, i) => (
          <div key={i} style={{ position: "absolute", inset: 0, opacity: slide === i ? 1 : 0, transition: "opacity 1.4s ease-in-out" }}>
            <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(1px) brightness(0.48)", transform: "scale(1.04)" }} />
          </div>
        ))}
        {/* Overlay */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(10,46,92,0.6) 0%, rgba(10,46,92,0.4) 45%, rgba(10,46,92,0.72) 100%)" }} />

        {/* Arrows */}
        <button onClick={() => goTo((slide - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)} className="desktop-nav" style={{ position: "absolute", left: 24, top: "50%", transform: "translateY(-50%)", zIndex: 5, width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(8px)" }}>
          <ChevronLeft size={20} color="#fff" />
        </button>
        <button onClick={() => goTo((slide + 1) % HERO_SLIDES.length)} className="desktop-nav" style={{ position: "absolute", right: 24, top: "50%", transform: "translateY(-50%)", zIndex: 5, width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(8px)" }}>
          <ChevronRight size={20} color="#fff" />
        </button>

        {/* Dots */}
        <div style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 10, zIndex: 5 }}>
          {HERO_SLIDES.map((_, i) => (
            <button key={i} onClick={() => goTo(i)} style={{ width: slide === i ? 32 : 10, height: 10, borderRadius: 5, background: slide === i ? "#fff" : "rgba(255,255,255,0.35)", border: "none", cursor: "pointer", transition: "all 0.4s" }} />
          ))}
        </div>

        {/* Text */}
        <div style={{ position: "absolute", inset: 0, zIndex: 3, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 24px" }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(24px, 4vw, 48px)", fontWeight: 700, color: "#fff", lineHeight: 1.15, marginBottom: 12, textAlign: "center", whiteSpace: "nowrap" }}>
            Trouvez le bien qui vous ressemble
          </h1>
          <p style={{ fontSize: "clamp(13px, 1.5vw, 16px)", color: "rgba(255,255,255,0.6)", maxWidth: 480, textAlign: "center", lineHeight: 1.7 }}>
            Entreprise Africaine de l'Immobilier et du Multiservices.
          </p>
        </div>
      </div>

      {/* ── Search bar: overlaps slider bottom ── */}
      <SearchBar />
    </section>
  );
}
