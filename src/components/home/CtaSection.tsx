"use client";

/* ═══════════════════ CTA ═══════════════════ */

export default function CtaSection() {
  return (
    <section style={{ padding: "72px 24px", background: "linear-gradient(135deg, #0a2e5c 0%, #143d72 100%)", textAlign: "center", fontFamily: "'DM Sans', sans-serif", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "-50%", right: "-10%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(26,109,212,0.15) 0%, transparent 70%)" }} />
      <div style={{ position: "relative", zIndex: 2 }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 700, color: "#fff", marginBottom: 16 }}>Vous vendez votre bien ?</h2>
        <p style={{ fontSize: 17, color: "rgba(255,255,255,0.55)", marginBottom: 36, maxWidth: 500, margin: "0 auto 36px", lineHeight: 1.7 }}>Confiez-nous votre bien et nous trouverons un acheteur dans les meilleurs delais.</p>
        <button style={{ padding: "16px 40px", background: "#1a6dd4", color: "#fff", border: "none", borderRadius: 14, fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 8px 30px rgba(26,109,212,0.35)", transition: "all 0.3s" }}
          onMouseEnter={(e) => { (e.target as HTMLElement).style.transform = "translateY(-2px)"; (e.target as HTMLElement).style.boxShadow = "0 12px 40px rgba(26,109,212,0.45)"; }}
          onMouseLeave={(e) => { (e.target as HTMLElement).style.transform = "translateY(0)"; (e.target as HTMLElement).style.boxShadow = "0 8px 30px rgba(26,109,212,0.35)"; }}
        >Nous contacter</button>
      </div>
    </section>
  );
}
