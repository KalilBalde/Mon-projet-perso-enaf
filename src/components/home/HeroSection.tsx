"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { SearchFilters } from "../../types";
import { HERO_SLIDES } from "../../data/constants";
import SearchBar from "../shared/SearchBar";

interface HeroSectionProps {
  onSearch: (filters: SearchFilters) => void;
}

export default function HeroSection({ onSearch }: HeroSectionProps) {
  const [slide, setSlide] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = () => {
    if (timer.current) {
      clearInterval(timer.current);
    }

    timer.current = setInterval(() => {
      setSlide(
        (currentSlide) => (currentSlide + 1) % HERO_SLIDES.length,
      );
    }, 5500);
  };

  useEffect(() => {
    startTimer();

    return () => {
      if (timer.current) {
        clearInterval(timer.current);
      }
    };
  }, []);

  const goToSlide = (slideIndex: number) => {
    setSlide(slideIndex);
    startTimer();
  };

  return (
    <section
      style={{
        paddingTop: 80,
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div
        style={{
          position: "relative",
          height: "clamp(190px, 23vh, 220px)",
          minHeight: 150,
          overflow: "hidden",
        }}
      >
        {HERO_SLIDES.map((source, index) => (
          <div
            key={source}
            style={{
              position: "absolute",
              inset: 0,
              opacity: slide === index ? 1 : 0,
              transition: "opacity 1s ease",
              pointerEvents: slide === index ? "auto" : "none",
            }}
          >
            <img
              src={source}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "brightness(0.45)",
              }}
            />
          </div>
        ))}

        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(10,46,92,0.5), rgba(10,46,92,0.8))",
          }}
        />

        <button
          type="button"
          className="desktop-nav"
          aria-label="Image précédente"
          onClick={() =>
            goToSlide(
              (slide - 1 + HERO_SLIDES.length) % HERO_SLIDES.length,
            )
          }
          style={{
            position: "absolute",
            top: "50%",
            left: 14,
            zIndex: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 34,
            height: 34,
            padding: 0,
            border: "1px solid rgba(255,255,255,0.25)",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.12)",
            color: "#fff",
            cursor: "pointer",
            transform: "translateY(-50%)",
          }}
        >
          <ChevronLeft size={17} />
        </button>

        <button
          type="button"
          className="desktop-nav"
          aria-label="Image suivante"
          onClick={() =>
            goToSlide((slide + 1) % HERO_SLIDES.length)
          }
          style={{
            position: "absolute",
            top: "50%",
            right: 14,
            zIndex: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 34,
            height: 34,
            padding: 0,
            border: "1px solid rgba(255,255,255,0.25)",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.12)",
            color: "#fff",
            cursor: "pointer",
            transform: "translateY(-50%)",
          }}
        >
          <ChevronRight size={17} />
        </button>

        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "12px 36px 24px",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              maxWidth: 520,
              margin: 0,
              color: "#fff",
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(20px, 5.5vw, 36px)",
              lineHeight: 1.08,
              fontWeight: 700,
            }}
          >
            Trouvez le bien qui vous ressemble
          </h1>
        </div>

        <div
          style={{
            position: "absolute",
            right: 0,
            bottom: 10,
            left: 0,
            zIndex: 3,
            display: "flex",
            justifyContent: "center",
            gap: 6,
          }}
        >
          {HERO_SLIDES.map((source, index) => (
            <button
              type="button"
              key={source}
              aria-label={`Afficher l'image ${index + 1}`}
              onClick={() => goToSlide(index)}
              style={{
                width: slide === index ? 20 : 6,
                height: 6,
                padding: 0,
                border: "none",
                borderRadius: 999,
                background:
                  slide === index
                    ? "#fff"
                    : "rgba(255,255,255,0.4)",
                cursor: "pointer",
              }}
            />
          ))}
        </div>
      </div>

      <SearchBar onSearch={onSearch} />
    </section>
  );
}