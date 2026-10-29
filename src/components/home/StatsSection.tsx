export default function StatsSection() {
  const statistics = [
    {
      value: "500+",
      label: "Biens disponibles",
    },
    {
      value: "98%",
      label: "Clients satisfaits",
    },
    {
      value: "24h",
      label: "Réponse moyenne",
    },
  ];

  return (
    <section
      style={{
        padding: "22px 12px",
        background: "linear-gradient(135deg, #0a2e5c 0%, #143d72 100%)",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          width: "100%",
          maxWidth: 760,
          margin: "0 auto",
          gap: 8,
        }}
      >
        {statistics.map((statistic) => (
          <div
            key={statistic.label}
            style={{
              minWidth: 0,
              textAlign: "center",
            }}
          >
            <div
              style={{
                color: "#fff",
                fontSize: "clamp(22px, 6vw, 34px)",
                fontWeight: 800,
                lineHeight: 1,
                whiteSpace: "nowrap",
              }}
            >
              {statistic.value}
            </div>

            <div
              style={{
                marginTop: 6,
                overflow: "hidden",
                color: "rgba(255,255,255,0.62)",
                fontSize: "clamp(9px, 2.5vw, 12px)",
                fontWeight: 500,
                lineHeight: 1.2,
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {statistic.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}