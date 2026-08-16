import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function ViewAllButton() {
  return (
    <Link
      href="/annonces"
      aria-label="Voir toutes les annonces"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        gap: 6,
        minHeight: 36,
        padding: "8px 11px",
        border: "1px solid #0a2e5c",
        borderRadius: 8,
        background: "#fff",
        color: "#0a2e5c",
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 11,
        fontWeight: 700,
        textDecoration: "none",
        whiteSpace: "nowrap",
      }}
    >
      Voir tout
      <ArrowRight size={14} />
    </Link>
  );
}