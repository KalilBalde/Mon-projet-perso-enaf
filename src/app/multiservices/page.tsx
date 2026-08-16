/* ============================================================
   FICHIER : src/app/multiservices/page.tsx
   ============================================================ */

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  ClipboardCheck,
  Paintbrush,
  Phone,
  ShieldCheck,
  Sparkles,
  UserRoundCheck,
  Wrench,
  Zap,
} from "lucide-react";
import styles from "./page.module.css";

interface Service {
  icon: LucideIcon;
  title: string;
  description: string;
  image: string;
}

const SERVICES: Service[] = [
  {
    icon: Wrench,
    title: "Plomberie",
    description: "Installation, réparation et entretien des réseaux d'eau.",
    image:
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80",
  },
  {
    icon: Zap,
    title: "Électricité",
    description: "Dépannage et installations électriques sécurisées.",
    image:
      "https://images.unsplash.com/photo-1555963966-b7ae5404b6ed?auto=format&fit=crop&w=600&q=80",
  },
  {
    icon: Paintbrush,
    title: "Peinture & rénovation",
    description: "Des finitions propres pour valoriser votre bien.",
    image:
      "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=600&q=80",
  },
  {
    icon: Sparkles,
    title: "Nettoyage",
    description: "Un entretien professionnel de vos espaces.",
    image:
      "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=600&q=80",
  },
  {
    icon: ShieldCheck,
    title: "Sécurité",
    description: "Des solutions pour protéger votre patrimoine.",
    image:
      "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80",
  },
];

const BENEFITS = [
  {
    icon: CalendarClock,
    title: "Rendez-vous organisé",
    text: "Une intervention planifiée avec vous.",
  },
  {
    icon: UserRoundCheck,
    title: "Équipe fiable",
    text: "Des professionnels sélectionnés.",
  },
  {
    icon: ClipboardCheck,
    title: "Suivi attentif",
    text: "Une équipe disponible à chaque étape.",
  },
];

export default function MultiservicesPage() {
  return (
    <main className={styles.page}>
      <div className={styles.pageHeader}>
        <Link href="/" className={styles.backLink}>
          <ArrowLeft size={15} />
          Accueil
        </Link>

        <span className={styles.pageLabel}>ENAFIM Services</span>
      </div>

      <section className={styles.hero}>
        <img
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80"
          alt="Intérieur contemporain"
          className={styles.heroImage}
        />

        <div className={styles.heroOverlay} />

        <div className={styles.heroContent}>
          <span className={styles.heroKicker}>Entretien & patrimoine</span>

          <h1>Des services fiables pour votre bien.</h1>

          <p>
            Entretenir, rénover et protéger votre patrimoine à Conakry.
          </p>

          <a href="#services" className={styles.heroLink}>
            Voir les services
            <ArrowRight size={15} />
          </a>
        </div>
      </section>

      <section id="services" className={styles.servicesSection}>
        <div className={styles.sectionIntro}>
          <span className={styles.sectionKicker}>Nos expertises</span>
          <h2>Un seul partenaire pour vos besoins essentiels.</h2>
        </div>

        <div className={styles.servicesList}>
          {SERVICES.map((service) => {
            const Icon = service.icon;

            return (
              <a href="#contact" className={styles.serviceRow} key={service.title}>
                <span className={styles.serviceIcon}>
                  <Icon size={21} strokeWidth={1.8} />
                </span>

                <span className={styles.serviceCopy}>
                  <strong>{service.title}</strong>
                  <small>{service.description}</small>
                </span>

                <span className={styles.serviceImageWrapper}>
                  <img
                    src={service.image}
                    alt=""
                    className={styles.serviceImage}
                  />
                </span>

                <span className={styles.serviceArrow}>
                  <ArrowRight size={15} />
                </span>
              </a>
            );
          })}
        </div>
      </section>

      <section className={styles.benefitsSection}>
        <div className={styles.benefitsIntro}>
          <span className={styles.sectionKicker}>Notre engagement</span>
          <h2>Une expérience simple et professionnelle.</h2>
        </div>

        <div className={styles.benefitsGrid}>
          {BENEFITS.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <div className={styles.benefit} key={benefit.title}>
                <span className={styles.benefitIcon}>
                  <Icon size={20} strokeWidth={1.8} />
                </span>

                <div>
                  <strong>{benefit.title}</strong>
                  <p>{benefit.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section id="contact" className={styles.contactSection}>
        <div className={styles.contactPanel}>
          <div>
            <span className={styles.contactKicker}>Votre projet</span>
            <h2>Besoin d&apos;une intervention ?</h2>
            <p>Notre équipe vous répond rapidement.</p>
          </div>

          <a href="tel:+224620417563" className={styles.contactButton}>
            <Phone size={16} />
            Nous contacter
          </a>
        </div>
      </section>
    </main>
  );
}