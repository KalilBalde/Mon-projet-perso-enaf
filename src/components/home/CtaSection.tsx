"use client";

import Link from "next/link";
import { useRef } from "react";
import { ArrowRight, Building2, Phone, Search } from "lucide-react";

const CTA_ITEMS = [
  {
    icon: Phone,
    label: "Vendeur",
    title: "Vendre votre bien",
    description: "Confiez sa vente à notre équipe.",
    action: "Nous contacter",
    href: "tel:+224627040280",
    external: true,
  },
  {
    icon: Search,
    label: "Acquéreur",
    title: "Acheter un terrain",
    description: "Trouvez le terrain adapté à votre projet.",
    action: "Voir les annonces",
    href: "/annonces",
    external: false,
  },
  {
    icon: Building2,
    label: "Gestion immobilière",
    title: "Confier votre bien",
    description: "Gestion fiable de votre logement.",
    action: "Confier mon bien",
    href: "tel:+224627040280",
    external: true,
  },
];

export default function CtaSection() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const touchStartXRef = useRef<number | null>(null);

  const returnToFirstBlock = () => {
    const carousel = carouselRef.current;

    if (!carousel) {
      return;
    }

    carousel.scrollTo({
      left: 0,
      behavior: "smooth",
    });
  };

  const isAtEnd = () => {
    const carousel = carouselRef.current;

    if (!carousel) {
      return false;
    }

    return (
      carousel.scrollLeft + carousel.clientWidth >=
      carousel.scrollWidth - 5
    );
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartXRef.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    const touchStartX = touchStartXRef.current;
    const touchEndX = event.changedTouches[0]?.clientX;

    touchStartXRef.current = null;

    if (
      touchStartX === null ||
      touchEndX === undefined ||
      !isAtEnd()
    ) {
      return;
    }

    const continuedLeftSwipe = touchEndX - touchStartX < -35;

    if (continuedLeftSwipe) {
      returnToFirstBlock();
    }
  };

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (!isAtEnd()) {
      return;
    }

    const continuedScroll =
      event.deltaX > 0 || Math.abs(event.deltaY) > 0;

    if (continuedScroll) {
      returnToFirstBlock();
    }
  };

  return (
    <section
      className="cta-section"
      style={{
        width: "100%",
        padding: "34px 24px 42px",
        background: "#fff",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <style suppressHydrationWarning>{`
        .cta-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
          width: 100%;
        }

        .cta-card {
          display: flex;
          flex-direction: column;
          min-width: 0;
          min-height: 190px;
          padding: 22px;
          border: 1px solid #a8c7e8;
          border-radius: 14px;
          background: #d4e5f7;
          color: #083b73;
        }

        .cta-card-top {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          min-height: 68px;
        }

        .cta-card-icon {
          display: flex;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: 11px;
          background: #0f5fae;
          color: #fff;
        }

        .cta-card-label {
          display: block;
          margin: 2px 0 5px;
          color: #0b579f;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1.2px;
          line-height: 1.2;
          text-transform: uppercase;
        }

        .cta-card-title {
          display: -webkit-box;
          overflow: hidden;
          margin: 0;
          color: #083b73;
          font-family: "Playfair Display", serif;
          font-size: clamp(19px, 2.4vw, 27px);
          line-height: 1.12;
          font-weight: 700;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }

        .cta-card-description {
          min-height: 40px;
          margin: 14px 0 0;
          color: #476987;
          font-size: 12px;
          line-height: 1.5;
        }

        .cta-card-link {
          display: inline-flex;
          align-items: center;
          align-self: flex-start;
          gap: 7px;
          margin-top: auto;
          padding: 9px 13px;
          border-radius: 8px;
          background: #083b73;
          color: #fff;
          font-size: 11px;
          font-weight: 700;
          text-decoration: none;
          white-space: nowrap;
        }

        .cta-card-link:hover {
          background: #0f5fae;
        }

        @media (max-width: 1100px) and (min-width: 901px) {
          .cta-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 900px) {
          .cta-section {
            padding-right: 16px !important;
            padding-left: 16px !important;
          }

          .cta-grid {
            display: flex;
            gap: 12px;
            width: 100%;
            overflow-x: auto;
            padding: 2px 8px 12px 2px;
            scroll-behavior: smooth;
            scroll-snap-type: x mandatory;
            scrollbar-width: none;
            -webkit-overflow-scrolling: touch;
          }

          .cta-grid::-webkit-scrollbar {
            display: none;
          }

          .cta-card {
            flex: 0 0 calc((100% - 36px) / 2);
            width: auto;
            max-width: none;
            min-height: 168px;
            padding: 16px;
            scroll-snap-align: start;
          }

          .cta-card-top {
            gap: 9px;
            min-height: 54px;
          }

          .cta-card-icon {
            width: 36px;
            height: 36px;
          }

          .cta-card-label {
            font-size: 8px;
          }

          .cta-card-title {
            font-size: 19px;
          }

          .cta-card-description {
            min-height: 0;
            margin-top: 8px;
            font-size: 12px;
          }

          .cta-card-link {
            margin-top: 10px;
            padding: 8px 12px;
            font-size: 11px;
          }
        }

        @media (max-width: 390px) {
          .cta-card {
            flex-basis: calc((100% - 36px) / 2);
            width: auto;
            padding: 15px;
          }

          .cta-card-title {
            font-size: 18px;
          }
        }

        @media (max-width: 900px) and (orientation: portrait) {
          .cta-card {
            min-height: 154px;
            align-items: stretch;
            padding: 12px;
            border-color: #c9dcef;
            border-radius: 12px;
            background: linear-gradient(155deg, #f1f7fe 0%, #dceafa 100%);
            box-shadow: 0 7px 18px rgba(10, 46, 92, 0.1);
            text-align: left;
          }

          .cta-card-top {
            align-items: center;
            gap: 7px;
            min-height: 28px;
          }

          .cta-card-label {
            margin: 0;
            font-size: 8px;
            letter-spacing: 0.8px;
          }

          .cta-card-icon {
            width: 24px;
            height: 24px;
            border-radius: 7px;
          }

          .cta-card-description {
            display: -webkit-box;
            overflow: hidden;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
          }

          .cta-card-title {
            display: block;
            font-size: 14px;
            margin-top: 6px;
            line-height: 1.2;
            white-space: nowrap;
            text-overflow: ellipsis;
          }

          .cta-card-description {
            align-self: stretch;
            width: 100%;
            margin-top: 5px;
            font-size: 11px;
            line-height: 1.35;
            text-align: left;
          }

          .cta-card-link {
            align-self: flex-start;
            margin-top: auto;
            padding: 7px 10px;
            border: 1px solid rgba(255, 255, 255, 0.18);
            border-radius: 999px;
            font-size: 10px;
            box-shadow: 0 3px 8px rgba(8, 59, 115, 0.18);
          }
        }

        @media (max-width: 900px) and (orientation: landscape) {
          .cta-card {
            flex: 0 0 calc((100% - 48px) / 3);
            width: auto;
            max-width: none;
            min-height: 160px;
            padding: 16px;
          }

          .cta-card-top {
            min-height: 50px;
          }

          .cta-card-icon {
            width: 36px;
            height: 36px;
          }

          .cta-card-title {
            font-size: 18px;
          }

          .cta-card-description {
            min-height: 0;
            margin-top: 8px;
            font-size: 11px;
          }

          .cta-card-link {
            margin-top: 10px;
          }
        }
      `}</style>

      <div
        ref={carouselRef}
        className="cta-grid"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
      >
        {CTA_ITEMS.map((item) => {
          const Icon = item.icon;

          return (
            <article className="cta-card" key={item.title}>
              <div className="cta-card-top">
                <div className="cta-card-icon">
                  <Icon size={20} strokeWidth={1.8} />
                </div>
                <span className="cta-card-label">{item.label}</span>
              </div>

              <h2 className="cta-card-title">{item.title}</h2>

              <p className="cta-card-description">
                {item.description}
              </p>

              {item.external ? (
                <a href={item.href} className="cta-card-link">
                  {item.action}
                  <ArrowRight size={14} />
                </a>
              ) : (
                <Link href={item.href} className="cta-card-link">
                  {item.action}
                  <ArrowRight size={14} />
                </Link>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}