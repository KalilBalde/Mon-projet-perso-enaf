import {
  CheckCircle,
  Clock,
  Headphones,
  Users,
  Wrench,
} from "lucide-react";

const FEATURES = [
  {
    icon: Clock,
    title: "Recherche rapide",
    description:
      "Nous vous aidons à trouver un logement adapté dans les meilleurs délais.",
  },
  {
    icon: Users,
    title: "Vente de votre bien",
    description:
      "Nous vous accompagnons pour vendre votre terrain, maison ou appartement.",
  },
  {
    icon: CheckCircle,
    title: "Accompagnement complet",
    description:
      "De votre premier contact jusqu'à la finalisation de votre projet.",
  },
  {
    icon: Wrench,
    title: "Multiservices",
    description:
      "Plomberie, électricité, peinture, nettoyage et entretien de vos biens.",
  },
  {
    icon: Headphones,
    title: "Conseillers à votre écoute",
    description:
      "Une équipe disponible pour répondre à vos questions et vous orienter.",
  },
];

export default function FeaturesSection() {
  return (
    <section
      style={{
        padding: "30px 16px 36px",
        background: "#f7f9fc",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <style suppressHydrationWarning>{`
        .features-header {
          margin-bottom: 18px;
          text-align: center;
        }

        .features-carousel {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 12px;
        }

        .feature-card {
          min-width: 0;
          padding: 18px 14px;
          border: 1px solid #e5ebf2;
          border-radius: 14px;
          background: #fff;
          text-align: center;
        }

        .feature-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          margin: 0 auto 11px;
          border-radius: 12px;
          background: #edf5ff;
          color: #1a6dd4;
        }

        .feature-title {
          margin: 0;
          color: #0a2e5c;
          font-size: 14px;
          font-weight: 700;
          line-height: 1.25;
        }

        .feature-description {
          margin: 7px 0 0;
          color: #718198;
          font-size: 12px;
          line-height: 1.55;
        }

        @media (max-width: 768px) {
          .features-carousel {
            display: flex;
            gap: 12px;
            overflow-x: auto;
            padding: 2px 2px 12px;
            scroll-snap-type: x mandatory;
            scrollbar-width: none;
            -webkit-overflow-scrolling: touch;
          }

          .features-carousel::-webkit-scrollbar {
            display: none;
          }

          .feature-card {
            flex: 0 0 78vw;
            max-width: 300px;
            scroll-snap-align: start;
          }
        }
      `}</style>

      <div
        style={{
          width: "100%",
          maxWidth: 1180,
          margin: "0 auto",
        }}
      >
        <div className="features-header">
          <span
            style={{
              display: "block",
              marginBottom: 5,
              color: "#1a6dd4",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "1.6px",
              textTransform: "uppercase",
            }}
          >
            Nos services
          </span>

          <h2
            style={{
              margin: 0,
              color: "#0a2e5c",
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(24px, 6vw, 38px)",
              lineHeight: 1.1,
            }}
          >
            Pourquoi choisir ENAFIM ?
          </h2>
        </div>

        <div className="features-carousel">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;

            return (
              <article className="feature-card" key={feature.title}>
                <div className="feature-icon">
                  <Icon size={22} strokeWidth={1.8} />
                </div>

                <h3 className="feature-title">{feature.title}</h3>

                <p className="feature-description">
                  {feature.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}