"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { CheckCircle2, X } from "lucide-react";
import { PROPERTY_TYPES, QUARTIERS } from "../../data/constants";
import {
  submitListing,
  uploadListingImage,
  type ListingDraft,
} from "../../lib/listings/database";
import type { UserRole } from "../../lib/auth/permissions";
import { createClient } from "../../lib/supabase/client";
import styles from "./dashboard.module.css";

type SubmissionFeedback = {
  ok: boolean;
  message: string;
} | null;

const MAX_ADDITIONAL_IMAGES = 5;
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const initialDraft: ListingDraft = {
  title: "",
  quartier: "",
  price: 0,
  surface: 0,
  rooms: 0,
  bathrooms: 0,
  type: "Appartement",
  image: "",
  description: "",
  features: [],
};

export default function ListingSubmissionForm({
  userId,
  role,
  onSubmitted,
}: {
  userId: string;
  role: UserRole;
  onSubmitted: () => void;
}) {
  const [draft, setDraft] = useState(initialDraft);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedAdditionalImages, setSelectedAdditionalImages] = useState<File[]>([]);
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<string[]>([]);
  const [featuresText, setFeaturesText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<SubmissionFeedback>(null);

  useEffect(() => {
    if (!selectedImage) {
      setImagePreview(null);
      return;
    }

    const previewUrl = URL.createObjectURL(selectedImage);
    setImagePreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [selectedImage]);

  useEffect(() => {
    const previewUrls = selectedAdditionalImages.map((file) =>
      URL.createObjectURL(file),
    );
    setAdditionalImagePreviews(previewUrls);

    return () => previewUrls.forEach((url) => URL.revokeObjectURL(url));
  }, [selectedAdditionalImages]);

  const updateDraft = <Key extends keyof ListingDraft>(
    key: Key,
    value: ListingDraft[Key],
  ) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const handleAdditionalImagesChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(event.currentTarget.files ?? []);
    event.currentTarget.value = "";

    if (!files.length) return;

    const invalidFile = files.find(
      (file) => !ALLOWED_IMAGE_TYPES.includes(file.type) || file.size > MAX_IMAGE_SIZE,
    );
    if (invalidFile) {
      setFeedback({
        ok: false,
        message: "Choisissez des images JPG, PNG ou WebP de 10 Mo maximum.",
      });
      return;
    }

    if (selectedAdditionalImages.length + files.length > MAX_ADDITIONAL_IMAGES) {
      setFeedback({
        ok: false,
        message: `Vous pouvez ajouter jusqu’à ${MAX_ADDITIONAL_IMAGES} photos supplémentaires.`,
      });
      return;
    }

    setSelectedAdditionalImages((current) => [...current, ...files]);
    setFeedback(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);

    if (!selectedImage) {
      setFeedback({ ok: false, message: "Choisissez une photo principale pour continuer." });
      return;
    }

    setIsSubmitting(true);
    const supabase = createClient();
    const uploadedImage = await uploadListingImage(supabase, userId, selectedImage);

    if (!uploadedImage.url) {
      setIsSubmitting(false);
      setFeedback({
        ok: false,
        message:
          process.env.NODE_ENV === "development"
            ? `La photo n’a pas pu être envoyée : ${uploadedImage.error ?? "erreur inconnue"}`
            : "La photo n’a pas pu être envoyée. Vérifiez la connexion et réessayez.",
      });
      return;
    }

    const additionalImageUrls: string[] = [];
    for (const file of selectedAdditionalImages) {
      const uploaded = await uploadListingImage(supabase, userId, file);
      if (!uploaded.url) {
        setIsSubmitting(false);
        setFeedback({
          ok: false,
          message:
            process.env.NODE_ENV === "development"
              ? `Une photo supplémentaire n’a pas pu être envoyée : ${uploaded.error ?? "erreur inconnue"}`
              : "Une photo supplémentaire n’a pas pu être envoyée. Vérifiez la connexion et réessayez.",
        });
        return;
      }
      additionalImageUrls.push(uploaded.url);
    }

    const result = await submitListing(supabase, userId, role, {
      ...draft,
      image: uploadedImage.url,
      additionalImages: additionalImageUrls,
      features: featuresText
        .split(/[\n,]/)
        .map((feature) => feature.trim())
        .filter(Boolean)
        .slice(0, 20),
    });
    setIsSubmitting(false);

    if (result.error || !result.listing) {
      setFeedback({
        ok: false,
        message:
          process.env.NODE_ENV === "development"
            ? `L’annonce n’a pas pu être enregistrée : ${result.error ?? "erreur inconnue"}`
            : "L’annonce n’a pas pu être enregistrée. Vérifiez les informations et réessayez.",
      });
      return;
    }

    setDraft(initialDraft);
    setSelectedImage(null);
    setSelectedAdditionalImages([]);
    setFeaturesText("");
    setFeedback({
      ok: true,
      message:
        result.listing.moderation_status === "pending"
          ? "Votre annonce est envoyée à ENAFIM pour validation. Elle ne sera visible qu’après approbation."
          : "Votre annonce est publiée et visible dans le catalogue.",
    });
    onSubmitted();
  };

  return (
    <section className={styles.submissionSection}>
      <div className={styles.sectionHeading}>
        <span className={styles.sectionEyebrow}>Nouvelle annonce</span>
        <h2>Présenter un bien</h2>
        <p>
          {role === "landlord"
            ? "Votre annonce sera vérifiée par ENAFIM avant sa publication."
            : "Les annonces créées par l’administration sont publiées immédiatement."}
        </p>
      </div>

      <form className={styles.listingForm} onSubmit={handleSubmit}>
        <label className={styles.field}>
          <span>Titre de l’annonce</span>
          <input
            maxLength={140}
            onChange={(event) => updateDraft("title", event.target.value)}
            placeholder="Ex. Appartement lumineux à Kipé"
            required
            value={draft.title}
          />
        </label>

        <label className={styles.field}>
          <span>Type de bien</span>
          <select
            onChange={(event) => updateDraft("type", event.target.value)}
            required
            value={draft.type}
          >
            {PROPERTY_TYPES.filter((type) => type !== "Tous types").map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </label>

        <label className={styles.field}>
          <span>Quartier</span>
          <select
            onChange={(event) => updateDraft("quartier", event.target.value)}
            required
            value={draft.quartier}
          >
            <option value="" disabled>Choisir un quartier</option>
            {QUARTIERS.filter((quartier) => quartier !== "Tous les quartiers").map((quartier) => (
              <option key={quartier} value={quartier}>{quartier}</option>
            ))}
          </select>
        </label>

        <label className={styles.field}>
          <span>Prix (GNF)</span>
          <input
            inputMode="numeric"
            min="1"
            onChange={(event) => updateDraft("price", Number(event.target.value))}
            required
            type="number"
            value={draft.price || ""}
          />
        </label>

        <label className={styles.field}>
          <span>Surface (m²)</span>
          <input
            min="1"
            onChange={(event) => updateDraft("surface", Number(event.target.value))}
            required
            type="number"
            value={draft.surface || ""}
          />
        </label>

        {draft.type !== "Terrain-Vide" && (
          <>
            <label className={styles.field}>
              <span>Nombre de pièces</span>
              <input
                min="0"
                onChange={(event) => updateDraft("rooms", Number(event.target.value))}
                required
                type="number"
                value={draft.rooms}
              />
            </label>
            <label className={styles.field}>
              <span>Salles de bain</span>
              <input
                min="0"
                onChange={(event) => updateDraft("bathrooms", Number(event.target.value))}
                required
                type="number"
                value={draft.bathrooms}
              />
            </label>
          </>
        )}

        <div className={`${styles.field} ${styles.imageField}`}>
          <label htmlFor="listing-image">Photo principale</label>
          <input
            accept="image/jpeg,image/png,image/webp"
            disabled={isSubmitting}
            id="listing-image"
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setSelectedImage(event.target.files?.[0] ?? null);
              setFeedback(null);
            }}
            required
            type="file"
          />
          <p className={styles.fieldHint}>
            Choisissez une photo dans votre galerie ou vos fichiers. Formats JPG, PNG ou WebP, 10 Mo maximum.
            La photo sera accessible publiquement avec l’annonce.
          </p>
          {imagePreview && (
            <img className={styles.imagePreview} src={imagePreview} alt="Aperçu de la photo choisie" />
          )}
        </div>

        <div className={`${styles.field} ${styles.imageField}`}>
          <label htmlFor="listing-additional-images">Autres photos (facultatif)</label>
          <input
            accept="image/jpeg,image/png,image/webp"
            disabled={isSubmitting || selectedAdditionalImages.length >= MAX_ADDITIONAL_IMAGES}
            id="listing-additional-images"
            multiple
            onChange={handleAdditionalImagesChange}
            type="file"
          />
          <p className={styles.fieldHint}>
            Ajoutez jusqu’à {MAX_ADDITIONAL_IMAGES} photos supplémentaires (JPG, PNG ou WebP, 10 Mo maximum chacune).
          </p>
          {additionalImagePreviews.length > 0 && (
            <div className={styles.additionalImagePreviews}>
              {additionalImagePreviews.map((preview, index) => (
                <div className={styles.additionalImagePreviewItem} key={`${selectedAdditionalImages[index].name}-${index}`}>
                  <img src={preview} alt={`Aperçu de la photo ${index + 1}`} />
                  <button
                    aria-label={`Retirer ${selectedAdditionalImages[index].name}`}
                    className={styles.removeImageButton}
                    onClick={() => setSelectedAdditionalImages((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                    title="Retirer cette photo"
                    type="button"
                  >
                    <X size={15} aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <label className={styles.field}>
          <span>Description</span>
          <textarea
            maxLength={5000}
            onChange={(event) => updateDraft("description", event.target.value)}
            rows={5}
            value={draft.description}
          />
        </label>

        <label className={styles.field}>
          <span>Atouts (séparés par une virgule)</span>
          <input
            maxLength={500}
            onChange={(event) => setFeaturesText(event.target.value)}
            placeholder="Parking, gardiennage, balcon"
            value={featuresText}
          />
        </label>

        {feedback && (
          <p
            className={feedback.ok ? styles.profileFeedback : styles.profileFeedbackError}
            role={feedback.ok ? "status" : "alert"}
          >
            {feedback.ok && <CheckCircle2 size={17} aria-hidden="true" />}
            {feedback.message}
          </p>
        )}

        <button
          className={styles.primaryAction}
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Enregistrement..."
            : role === "landlord"
              ? "Envoyer pour validation"
              : "Publier l’annonce"}
        </button>
      </form>
    </section>
  );
}
