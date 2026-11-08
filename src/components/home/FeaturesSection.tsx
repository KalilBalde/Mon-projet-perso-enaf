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
      className="features-section"
      style={{
        width: "100%",
        padding: "34px 24px 42px",
        background: "#f7f9fc",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <style suppressHydrationWarning>{`
        .features-header {
          width: 100%;
          margin-bottom: 22px;
          text-align: center;
        }

        .features-carousel {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 18px;
          width: 100%;
        }

        .feature-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 0;
          min-height: 190px;
          padding: 22px;
          border: 1px solid #dfe8f2;
          border-radius: 14px;
          background: #fff;
          text-align: center;
          box-shadow: 0 5px 16px rgba(10, 46, 92, 0.05);
        }

        .feature-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          margin-bottom: 13px;
          border-radius: 11px;
          background: #d4e5f7;
          color: #0f5fae;
        }

        .feature-title {
          margin: 0;
          color: #083b73;
          font-size: 15px;
          font-weight: 700;
          line-height: 1.3;
        }

        .feature-description {
          max-width: 240px;
          margin: 9px auto 0;
          color: #718198;
          font-size: 12px;
          line-height: 1.55;
        }

        @media (max-width: 1100px) and (min-width: 769px) {
          .features-carousel {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (max-width: 900px) {
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
            flex: 0 0 calc((100% - 36px) / 2);
            max-width: none;
            min-height: 168px;
            padding: 18px 16px;
            scroll-snap-align: start;
          }

          .feature-icon {
            width: 44px;
            height: 44px;
            margin-bottom: 10px;
          }

          .feature-title {
            font-size: 16px;
          }

          .feature-description {
            font-size: 13px;
            margin-top: 7px;
          }
        }

        @media (max-width: 390px) {
          .feature-card {
            flex-basis: calc((100% - 36px) / 2);
            width: auto;
            padding: 16px;
          }

          .feature-title {
            font-size: 14px;
          }
        }

        @media (max-width: 900px) and (orientation: portrait) {
          .feature-card {
            min-height: 154px;
            padding: 12px;
            border-color: #d3e2f1;
            border-radius: 12px;
            background: linear-gradient(160deg, #fff 0%, #f5f9fe 100%);
            box-shadow: 0 7px 18px rgba(10, 46, 92, 0.08);
          }

          .feature-icon {
            width: 34px;
            height: 34px;
            margin-bottom: 8px;
            border: 1px solid #c8dcef;
            border-radius: 10px;
            background: linear-gradient(145deg, #edf5fd, #dceafa);
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8);
          }

          .feature-title,
          .feature-description {
            display: -webkit-box;
            overflow: hidden;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
          }

          .feature-title {
            font-size: 14px;
            line-height: 1.25;
          }

          .feature-description {
            margin-top: 5px;
            font-size: 11px;
            line-height: 1.35;
          }
        }

        @media (max-width: 900px) and (orientation: landscape) {
          .feature-card {
            flex: 0 0 calc((100% - 48px) / 3);
            width: auto;
            max-width: none;
            min-height: 160px;
            padding: 16px;
          }

          .feature-icon {
            width: 38px;
            height: 38px;
            margin-bottom: 9px;
          }

          .feature-title {
            font-size: 15px;
          }

          .feature-description {
            margin-top: 6px;
            font-size: 12px;
          }
        }
      `}</style>

      <div
        style={{
          width: "100%",
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
              fontSize: "clamp(24px, 4vw, 38px)",
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
                  <Icon size={20} strokeWidth={1.8} />
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