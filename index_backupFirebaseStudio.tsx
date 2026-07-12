import { useState, useEffect, useRef } from "react";
import {
Search, MapPin, Home, ChevronDown, ChevronLeft, ChevronRight,
Heart, ArrowRight, Phone, Mail, Menu, X, BedDouble, Bath,
Maximize, TrendingUp, Wrench, Headphones, User, Info,
LandPlot, Users, Clock, CheckCircle,
} from "lucide-react";

/* ─── TYPES ─── */
interface Listing {
id: number; title: string; quartier: string; price: number;
surface: number; rooms: number; bathrooms: number;
type: string; image: string; isNew: boolean; isFavorite: boolean;
}
interface SearchFilters { type: string; quartier: string; budgetMax: string; }

/* ─── CONSTANTS ─── */
const LOGO_SRC = "/images/logo-enafim2.png";

/* 4 images : rues residentielles, rangees de batiments, quartiers urbains */
const HERO_SLIDES = [
"https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1920&h=1080&fit=crop&q=80",
"https://images.unsplash.com/photo-1460317442991-0ec209397118?w=1920&h=1080&fit=crop&q=80",
"https://images.unsplash.com/photo-1494526585095-c41746248156?w=1920&h=1080&fit=crop&q=80",
"https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=1920&h=1080&fit=crop&q=80",
];

const LISTINGS: Listing[] = [
{ id: 1, title: "Appartement moderne 3 pieces", quartier: "Kipe", price: 3500000, surface: 72, rooms: 3, bathrooms: 1, type: "Appartement", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop", isNew: true, isFavorite: false },
{ id: 2, title: "Villa standing avec jardin", quartier: "Sonfonia", price: 15000000, surface: 200, rooms: 6, bathrooms: 3, type: "Villa", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop", isNew: false, isFavorite: true },
{ id: 3, title: "Chambre studio meublee", quartier: "Hamdallaye", price: 800000, surface: 25, rooms: 1, bathrooms: 1, type: "Chambre-Studio", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop", isNew: true, isFavorite: false },
{ id: 4, title: "Terrain vide bien situe", quartier: "Kagbelen", price: 5000000, surface: 400, rooms: 0, bathrooms: 0, type: "Terrain-Vide", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400&fit=crop", isNew: false, isFavorite: false },
{ id: 5, title: "Maison familiale spacieuse", quartier: "Cosa", price: 8500000, surface: 150, rooms: 5, bathrooms: 2, type: "Maison", image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600&h=400&fit=crop", isNew: true, isFavorite: false },
{ id: 6, title: "Appartement renove centre", quartier: "Cimenterie", price: 4200000, surface: 85, rooms: 4, bathrooms: 2, type: "Appartement", image: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=600&h=400&fit=crop", isNew: false, isFavorite: true },
{ id: 7, title: "Appartement renove centre", quartier: "Cimenterie", price: 4200000, surface: 85, rooms: 4, bathrooms: 2, type: "Appartement", image: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=600&h=400&fit=crop", isNew: false, isFavorite: true },
];

const NAV_LINKS = [
{ label: "Acheter", href: "#acheter" },
{ label: "Louer", href: "#louer" },
{ label: "Vendre", href: "#vendre" },
{ label: "Multiservices", href: "#multiservices" },
];
const PROPERTY_TYPES = ["Tous types", "Appartement", "Maison", "Terrain-Vide", "Chambre-Studio", "Villa"];
const QUARTIERS = ["Tous les quartiers", "Cimenterie", "Kagbelen", "Sonfonia", "Cite", "Cosa", "Bambeto", "Lambagni", "Kipe", "Hamdallaye", "Nongo"];

function formatPrice(price: number): string {
return new Intl.NumberFormat("fr-GN").format(price) + " GNF";
}

/* ═══════════════════ NAVBAR ═══════════════════ */

function Navbar() {
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
transition: "box-shadow 0.3s", fontFamily: "‘DM Sans’, sans-serif",
}}>
<div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", height: 80, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
{/* Logo */}
<div style={{ display: "flex", alignItems: "center", gap: 14 }}>
<img src={LOGO_SRC} alt="ENAFIM Guinee" style={{ height: 56, width: "auto", borderRadius: 8, objectFit: "contain" }} />
<div style={{ lineHeight: 1.15 }}>
<span style={{ fontFamily: "‘Playfair Display’, serif", fontSize: 26, fontWeight: 800, color: "#0a2e5c", display: "block" }}>ENAFIM</span>
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

/* ═══════════════════ HERO SLIDER ═══════════════════ */

function HeroSection() {
const [slide, setSlide] = useState(0);
const [filters, setFilters] = useState<SearchFilters>({ type: "Tous types", quartier: "Tous les quartiers", budgetMax: "" });
const [activeDD, setActiveDD] = useState<string | null>(null);
const timer = useRef<ReturnType<typeof setInterval> | null>(null);

const startTimer = () => {
if (timer.current) clearInterval(timer.current);
timer.current = setInterval(() => setSlide((p) => (p + 1) % HERO_SLIDES.length), 5500);
};
useEffect(() => { startTimer(); return () => { if (timer.current) clearInterval(timer.current); }; }, []);
const goTo = (i: number) => { setSlide(i); startTimer(); };

const selBtn: React.CSSProperties = { width: "100%", padding: "14px 16px", background: "#fff", border: "2px solid #e4eaf0", borderRadius: 12, fontSize: 15, color: "#0a2e5c", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", fontFamily: "‘DM Sans’, sans-serif", fontWeight: 500 };
const ddBox: React.CSSProperties = { position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, background: "#fff", borderRadius: 12, boxShadow: "0 12px 40px rgba(0,0,0,0.15)", zIndex: 100, border: "1px solid #e4eaf0", maxHeight: 240, overflowY: "auto" };

return (
<section style={{ fontFamily: "‘DM Sans’, sans-serif", paddingTop: 80 }}>


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
</section>


);
}

/* ═══════════════════ LISTING CARD ═══════════════════ */

function ListingCard({ listing }: { listing: Listing }) {
const [hov, setHov] = useState(false);
const [fav, setFav] = useState(listing.isFavorite);
const isTerrain = listing.type === "Terrain-Vide";
return (
<article style={{ background: "#fff", borderRadius: 18, overflow: "hidden", transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)", cursor: "pointer", boxShadow: hov ? "0 24px 64px rgba(10,46,92,0.14)" : "0 4px 20px rgba(10,46,92,0.06)", transform: hov ? "translateY(-8px)" : "translateY(0)", fontFamily: "‘DM Sans’, sans-serif", border: "1px solid #edf1f7" }}
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

/* ═══════════════════ FEATURES ═══════════════════ */

function FeaturesSection() {
const features = [
{ icon: <Clock size={28} />, title: "Recherche de logement rapide", desc: "Nous trouverons votre logement qui vous convient dans les meilleurs delais." },
{ icon: <Users size={28} />, title: "Vente de votre bien", desc: "Nous trouverons un acheteur de votre bien (Terrain, Maison, Appartement) dans les meilleurs delais." },
{ icon: <CheckCircle size={28} />, title: "Accompagnement complet", desc: "Du premier contact jusqu’a la signature, nous vous guidons a chaque etape." },
{ icon: <Wrench size={28} />, title: "Multiservices", desc: "Plomberie, electricite, peinture, nettoyage - tous vos besoins de maintenance." },
{ icon: <Headphones size={28} />, title: "Conseillers a votre ecoute", desc: "Des conseillers professionnels a votre ecoute gratuitement." },
];
return (
<section style={{ padding: "64px 24px", background: "#f7f9fc", fontFamily: "‘DM Sans’, sans-serif" }}>
<div style={{ maxWidth: 1200, margin: "0 auto" }}>
<div style={{ textAlign: "center", marginBottom: 40 }}>
<span style={{ fontSize: 12, fontWeight: 700, color: "#1a6dd4", textTransform: "uppercase", letterSpacing: "2px" }}>Nos services</span>
<h2 style={{ fontFamily: "‘Playfair Display’, serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 700, color: "#0a2e5c", marginTop: 10 }}>Pourquoi choisir ENAFIM ?</h2>
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

/* ═══════════════════ FOOTER ═══════════════════ */

function Footer() {
return (
<footer style={{ background: "#0a2e5c", padding: "60px 24px 32px", fontFamily: "‘DM Sans’, sans-serif" }}>
<div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: 48, justifyContent: "space-between" }}>
<div style={{ flex: "1 1 280px" }}>
<div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
<img src={LOGO_SRC} alt="ENAFIM" style={{ height: 42, borderRadius: 6, background: "#fff", padding: 3 }} />
<span style={{ fontFamily: "‘Playfair Display’, serif", fontSize: 20, fontWeight: 700, color: "#fff" }}>ENAFIM <span style={{ color: "#5ba3f5" }}>Guinee</span></span>
</div>
<p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.8, maxWidth: 300 }}>Entreprise Africaine de l’Immobilier et du Multiservices. Location, achat, vente et services a Conakry.</p>
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
© 2026 ENAFIM Guinee - Entreprise Africaine de l’Immobilier et du Multiservices. Tous droits reserves.
</div>
</footer>
);
}

/* ═══════════════════ MAIN APP ═══════════════════ */

export default function EnafimAgence() {
return (
<div style={{ minHeight: "100vh", background: "#fff" }}>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
<style>{`* { margin: 0; padding: 0; box-sizing: border-box; } .desktop-nav { display: flex !important; } .mobile-menu-btn { display: none !important; } .search-bar-inner { flex-wrap: nowrap; } @media (max-width: 768px) { .desktop-nav { display: none !important; } .mobile-menu-btn { display: flex !important; } .search-bar-inner { flex-direction: column !important; } .listings-grid { grid-template-columns: 1fr !important; } } @media (min-width: 769px) and (max-width: 1024px) { .listings-grid { grid-template-columns: repeat(2, 1fr) !important; } } input::placeholder { color: #b0bec5; font-weight: 400; } input:focus { border-color: #1a6dd4 !important; outline: none; }`}</style>


  <Navbar />
  <HeroSection />

  {/* ═══ DERNIERES ANNONCES - colle a la recherche ═══ */}
  <section style={{ padding: "24px 24px 48px", fontFamily: "'DM Sans', sans-serif", background: "#fff" }}>
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
        <div>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#1a6dd4", textTransform: "uppercase", letterSpacing: "2px", display: "block", marginBottom: 6 }}>Decouvrir</span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 700, color: "#0a2e5c" }}>Dernieres annonces</h2>
        </div>
        <button style={{ padding: "12px 24px", background: "transparent", border: "2px solid #0a2e5c", borderRadius: 12, fontSize: 14, fontWeight: 600, color: "#0a2e5c", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s" }}
          onMouseEnter={(e) => { (e.target as HTMLElement).style.background = "#0a2e5c"; (e.target as HTMLElement).style.color = "#fff"; }}
          onMouseLeave={(e) => { (e.target as HTMLElement).style.background = "transparent"; (e.target as HTMLElement).style.color = "#0a2e5c"; }}
        >Voir tout <ArrowRight size={16} /></button>
      </div>
      <div className="listings-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28 }}>
        {LISTINGS.map((l) => <ListingCard key={l.id} listing={l} />)}
      </div>
    </div>
  </section>

  {/* ═══ STATS - juste apres les annonces ═══ */}
  <section style={{ padding: "44px 24px", background: "linear-gradient(135deg, #0a2e5c 0%, #143d72 100%)", fontFamily: "'DM Sans', sans-serif" }}>
    <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", justifyContent: "center", gap: 64, flexWrap: "wrap" }}>
      {[{ value: "500+", label: "Biens disponibles" }, { value: "98%", label: "Clients satisfaits" }, { value: "24h", label: "Reponse moyenne" }].map((s) => (
        <div key={s.label} style={{ textAlign: "center" }}>
          <div style={{ fontSize: 36, fontWeight: 800, color: "#fff" }}>{s.value}</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 6, fontWeight: 500 }}>{s.label}</div>
        </div>
      ))}
    </div>
  </section>

  <FeaturesSection />

  {/* ═══ CTA ═══ */}
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

  <Footer />
</div>


);
}