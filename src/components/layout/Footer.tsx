import { Phone, Mail, MapPin } from "lucide-react";
import { LOGO_SRC } from "../../data/constants";

/* ═══════════════════ FOOTER ═══════════════════ */

export default function Footer() {
  return (
    <footer style={{ background: "#0a2e5c", padding: "60px 24px 32px", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: 48, justifyContent: "space-between" }}>
        <div style={{ flex: "1 1 280px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <img src={LOGO_SRC} alt="ENAFIM" style={{ height: 42, borderRadius: 6, background: "#fff", padding: 3 }} />
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "#fff" }}>ENAFIM <span style={{ color: "#5ba3f5" }}>Guinee</span></span>
          </div>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.8, maxWidth: 300 }}>Entreprise Africaine de l'Immobilier et du Multiservices. Location, achat, vente et services a Conakry.</p>
        </div>
        <div style={{ flex: "0 0 auto" }}>
          <h4 style={{ color: "#fff", fontSize: 13, fontWeight: 700, marginBottom: 18, textTransform: "uppercase", letterSpacing: "1px" }}>Navigation</h4>
          {["Acheter", "Louer", "Vendre", "Multiservices", "Nous connaitre"].map((link) => (
            <a key={link} href="#" style={{ display: "block", color: "rgba(255,255,255,0.45)", fontSize: 14, textDecoration: "none", marginBottom: 12 }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#5ba3f5")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.45)")}
            >{link}</a>
          ))}
        </div>
        <div style={{ flex: "0 0 auto" }}>
          <h4 style={{ color: "#fff", fontSize: 13, fontWeight: 700, marginBottom: 18, textTransform: "uppercase", letterSpacing: "1px" }}>Contact</h4>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}><Phone size={14} color="#5ba3f5" /><span style={{ color: "rgba(255,255,255,0.45)", fontSize: 14 }}>+224 620 41 75 63</span></div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}><Mail size={14} color="#5ba3f5" /><span style={{ color: "rgba(255,255,255,0.45)", fontSize: 14 }}>enafimgn0225@gmail.com</span></div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}><MapPin size={14} color="#5ba3f5" /><span style={{ color: "rgba(255,255,255,0.45)", fontSize: 14 }}>Conakry, Guinee</span></div>
        </div>
      </div>
      <div style={{ maxWidth: 1100, margin: "48px auto 0", paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.08)", textAlign: "center", color: "rgba(255,255,255,0.25)", fontSize: 13 }}>
        © 2026 ENAFIM Guinee - Entreprise Africaine de l'Immobilier et du Multiservices. Tous droits reserves.
      </div>
    </footer>
  );
}
