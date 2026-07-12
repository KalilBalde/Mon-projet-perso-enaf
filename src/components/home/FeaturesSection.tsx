import { Wrench, Headphones, Users, Clock, CheckCircle } from "lucide-react";

/* ═══════════════════ FEATURES ═══════════════════ */

export default function FeaturesSection() {
  const features = [
    { icon: <Clock size={28} />, title: "Recherche de logement rapide", desc: "Nous trouverons votre logement qui vous convient dans les meilleurs delais." },
    { icon: <Users size={28} />, title: "Vente de votre bien", desc: "Nous trouverons un acheteur de votre bien (Terrain, Maison, Appartement) dans les meilleurs delais." },
    { icon: <CheckCircle size={28} />, title: "Accompagnement complet", desc: "Du premier contact jusqu'a la signature, nous vous guidons a chaque etape." },
    { icon: <Wrench size={28} />, title: "Multiservices", desc: "Plomberie, electricite, peinture, nettoyage - tous vos besoins de maintenance." },
    { icon: <Headphones size={28} />, title: "Conseillers a votre ecoute", desc: "Des conseillers professionnels a votre ecoute gratuitement." },
  ];
  return (
    <section style={{ padding: "64px 24px", background: "#f7f9fc", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#1a6dd4", textTransform: "uppercase", letterSpacing: "2px" }}>Nos services</span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 700, color: "#0a2e5c", marginTop: 10 }}>Pourquoi choisir ENAFIM ?</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 20 }}>
          {features.map((f, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 18, padding: "28px 22px", border: "1px solid #e8edf3", textAlign: "center" }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: "linear-gradient(135deg, #f0f6ff 0%, #e8f4fd 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "#1a6dd4", margin: "0 auto 16px" }}>{f.icon}</div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0a2e5c", marginBottom: 8, lineHeight: 1.35 }}>{f.title}</h3>
              <p style={{ fontSize: 13, color: "#8a9bb5", lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
