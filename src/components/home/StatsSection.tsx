/* ═══════════════════ STATS ═══════════════════ */

export default function StatsSection() {
  return (
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
  );
}
