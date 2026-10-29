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
            max-width: 320px;
            padding: 22px 20px;
            scroll-snap-align: start;
          }

          .feature-icon {
            width: 52px;
            height: 52px;
            margin-bottom: 14px;
          }

          .feature-title {
            font-size: 19px;
          }

          .feature-description {
            font-size: 15px;
            margin-top: 9px;
          }
        }

        @media (max-width: 390px) {
          .feature-card {
            flex-basis: 88vw;
            width: 88vw;
            padding: 17px;
          }

          .feature-title {
            font-size: 13px;
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