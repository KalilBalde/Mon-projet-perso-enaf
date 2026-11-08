"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Pencil, Save, Trash2, X } from "lucide-react";
import { LISTING_AMENITIES, PROPERTY_TYPES, QUARTIERS } from "../../data/constants";
import {
  deleteListing,
  listManageableListings,
  updateListing,
  uploadListingImage,
  type ListingDraft,
  type ListingSubmission,
} from "../../lib/listings/database";
import { createClient } from "../../lib/supabase/client";
import { formatListingPrice } from "../../utils/format";
import type { ListingCardBadge } from "../../types";
import styles from "./dashboard.module.css";

type Feedback = { ok: boolean; message: string } | null;

function createDraft(listing: ListingSubmission): ListingDraft {
  return {
    title: listing.title,
    quartier: listing.quartier,
    price: listing.price,
    offerType: listing.offerType ?? null,
    cardBadge: listing.cardBadge ?? null,
    surface: listing.surface,
    bedrooms: listing.bedrooms,
    livingRooms: listing.livingRooms,
    showers: listing.showers,
    type: listing.type,
    priority: listing.priority ?? 0,
    image: listing.image,
    additionalImages: (listing.images ?? []).filter((image) => image !== listing.image),
    description: listing.description ?? "",
    features: listing.features ?? [],
  };
}

export default function ListingManagement({ userId }: { userId: string }) {
  const [listings, setListings] = useState<ListingSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingListing, setEditingListing] = useState<ListingSubmission | null>(null);
  const [draft, setDraft] = useState<ListingDraft | null>(null);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [featuresText, setFeaturesText] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [busyListingId, setBusyListingId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<Feedback>(null);

  useEffect(() => {
    let active = true;

    void listManageableListings(createClient())
      .then((items) => {
        if (active) {
          setListings(items);
        }
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [userId]);

  const beginEdit = (listing: ListingSubmission) => {
    setEditingListing(listing);
    setDraft(createDraft(listing));
    setSelectedAmenities(
      (listing.features ?? []).filter((feature) =>
        LISTING_AMENITIES.includes(feature as (typeof LISTING_AMENITIES)[number]),
      ),
    );
    setFeaturesText(
      (listing.features ?? [])
        .filter((feature) => !LISTING_AMENITIES.includes(feature as (typeof LISTING_AMENITIES)[number]))
        .join(", "),
    );
    setSelectedImage(null);
    setFeedback(null);
  };

  const cancelEdit = () => {
    setEditingListing(null);
    setDraft(null);
    setSelectedAmenities([]);
    setFeaturesText("");
    setSelectedImage(null);
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingListing || !draft) return;

    setBusyListingId(editingListing.id);
    setFeedback(null);
    const supabase = createClient();
    let image = draft.image;

    if (selectedImage) {
      const uploaded = await uploadListingImage(supabase, userId, selectedImage);
      if (!uploaded.url) {
        setBusyListingId(null);
        setFeedback({
          ok: false,
          message: uploaded.error ?? "La nouvelle photo n’a pas pu être envoyée.",
        });
        return;
      }
      image = uploaded.url;
    }

    const result = await updateListing(supabase, editingListing.id, {
      ...draft,
      image,
      features: [
        ...selectedAmenities,
        ...featuresText
          .split(/[\n,]/)
          .map((feature) => feature.trim())
          .filter(Boolean),
      ].slice(0, 20),
    });

    setBusyListingId(null);
    if (!result.listing) {
      setFeedback({ ok: false, message: "La modification a échoué. Vérifiez les informations et réessayez." });
      return;
    }

    setListings((current) =>
      current.map((item) => item.id === result.listing!.id ? result.listing! : item),
    );
    cancelEdit();
    setFeedback({
      ok: true,
      message: result.error
        ? "Annonce modifiée. L’ancienne photo n’a pas pu être supprimée du stockage."
        : "Annonce modifiée.",
    });
  };

  const handleDelete = async (listing: ListingSubmission) => {
    const confirmed = window.confirm(
      `La suppression de « ${listing.title} » est définitive. Supprimer aussi sa photo ?`,
    );
    if (!confirmed) return;

    setBusyListingId(listing.id);
    setFeedback(null);
    const result = await deleteListing(createClient(), listing.id);
    setBusyListingId(null);

    if (!result.deleted) {
      setFeedback({ ok: false, message: "La suppression a échoué. Réessayez." });
      return;
    }

    setListings((current) => current.filter((item) => item.id !== listing.id));
    if (editingListing?.id === listing.id) cancelEdit();
    setFeedback({
      ok: true,
      message: result.error
        ? "Annonce supprimée. Sa photo n’a pas pu être supprimée du stockage."
        : "Annonce et photo supprimées.",
    });
  };

  const updateDraft = <Key extends keyof ListingDraft>(
    key: Key,
    value: ListingDraft[Key],
  ) => {
    setDraft((current) => current ? { ...current, [key]: value } : current);
  };

  return (
    <section className={styles.listingManagement}>
      <div className={styles.sectionTop}>
        <div className={styles.sectionHeading}>
          <span className={styles.sectionEyebrow}>Administration</span>
          <h2>Gestion des annonces</h2>
          <p>Modifiez ou supprimez les annonces du catalogue.</p>
        </div>
      </div>

      {feedback && (
        <p
          className={feedback.ok ? styles.profileFeedback : styles.profileFeedbackError}
          role={feedback.ok ? "status" : "alert"}
        >
          {feedback.message}
        </p>
      )}

      {isLoading ? (
        <p className={styles.accountLoading}>Chargement des annonces...</p>
      ) : listings.length ? (
        <div className={styles.managedListingList}>
          {listings.map((listing) => (
            <div className={styles.managedListingItem} key={listing.id}>
              <article className={styles.managedListing}>
                <img src={listing.image} alt="" />
                <div className={styles.managedListingInfo}>
                  <span className={`${styles.moderationBadge} ${styles[`moderation_${listing.moderation_status}`]}`}>
                    {listing.moderation_status === "published"
                      ? "Publiée"
                      : listing.moderation_status === "pending"
                        ? "En attente"
                        : "Refusée"}
                  </span>
                  <h3>{listing.title}</h3>
                  <p>{listing.type} · {listing.quartier}, Conakry</p>
                  <p>{formatListingPrice(listing.price, listing.offerType)} · {listing.surface} m²</p>
                </div>
                <div className={styles.managedListingActions}>
                  <button
                    className={styles.outlineLink}
                    type="button"
                    disabled={busyListingId !== null}
                    onClick={() => beginEdit(listing)}
                  >
                    <Pencil size={15} aria-hidden="true" /> Modifier
                  </button>
                  <button
                    className={styles.rejectButton}
                    type="button"
                    disabled={busyListingId !== null}
                    onClick={() => void handleDelete(listing)}
                  >
                    <Trash2 size={15} aria-hidden="true" /> Supprimer
                  </button>
                </div>
              </article>

              {editingListing?.id === listing.id && draft && (
                <form className={styles.listingManagerForm} onSubmit={handleSave}>
                  <label className={styles.field}>
                    <span>Titre</span>
                    <input maxLength={140} required value={draft.title} onChange={(event) => updateDraft("title", event.target.value)} />
                  </label>
                  <label className={styles.field}>
                    <span>Type de bien</span>
                    <select required value={draft.type} onChange={(event) => updateDraft("type", event.target.value)}>
                      {PROPERTY_TYPES.filter((type) => type !== "Tous types").map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </label>
                  <label className={styles.field}>
                    <span>Type de l’offre</span>
                    <select
                      value={draft.offerType ?? ""}
                      onChange={(event) => updateDraft(
                        "offerType",
                        event.target.value === "rent" || event.target.value === "sale"
                          ? event.target.value
                          : null,
                      )}
                    >
                      <option value="">Non précisé</option>
                      <option value="rent">À louer</option>
                      <option value="sale">À vendre</option>
                    </select>
                  </label>
                  <label className={styles.field}>
                    <span>Badge sur la carte</span>
                    <select
                      value={draft.cardBadge ?? "none"}
                      onChange={(event) => updateDraft(
                        "cardBadge",
                        event.target.value === "new" || event.target.value === "rented" || event.target.value === "sold" || event.target.value === "title_deed"
                          ? event.target.value as ListingCardBadge
                          : null,
                      )}
                    >
                      <option value="new">Nouveau</option>
                      <option value="title_deed">Titre foncier</option>
                      <option value="rented">Déjà loué</option>
                      <option value="sold">Vendu</option>
                      <option value="none">Rien</option>
                    </select>
                  </label>
                  <label className={styles.field}>
                    <span>Quartier</span>
                    <input
                      list="listing-management-neighborhoods"
                      required
                      value={draft.quartier}
                      placeholder="Saisir ou choisir un quartier"
                      onChange={(event) => updateDraft("quartier", event.target.value)}
                    />
                    <datalist id="listing-management-neighborhoods">
                      {QUARTIERS.filter((quartier) => quartier !== "Tous les quartiers").map((quartier) => (
                        <option key={quartier} value={quartier} />
                      ))}
                    </datalist>
                  </label>
                  <label className={styles.field}>
                    <span>Prix (GNF)</span>
                    <input min="1" required type="number" value={draft.price} onChange={(event) => updateDraft("price", Number(event.target.value))} />
                  </label>
                  <label className={styles.field}>
                    <span>Priorité d’affichage</span>
                    <input min="0" step="1" required type="number" value={draft.priority ?? 0} onChange={(event) => updateDraft("priority", Number(event.target.value))} />
                    <span className={styles.fieldHint}>Plus la valeur est élevée, plus l’annonce apparaît tôt. 0 correspond à la priorité normale.</span>
                  </label>
                  <label className={styles.field}>
                    <span>Surface (m²)</span>
                    <input min="1" required type="number" value={draft.surface} onChange={(event) => updateDraft("surface", Number(event.target.value))} />
                  </label>
                  {draft.type !== "Terrain-Vide" && (
                    <>
                      <label className={styles.field}>
                        <span>Nombre de chambres</span>
                        <input min="0" required type="number" value={draft.bedrooms} onChange={(event) => updateDraft("bedrooms", Number(event.target.value))} />
                      </label>
                      <label className={styles.field}>
                        <span>Nombre de salons</span>
                        <input min="0" required type="number" value={draft.livingRooms} onChange={(event) => updateDraft("livingRooms", Number(event.target.value))} />
                      </label>
                      <label className={styles.field}>
                        <span>Nombre de douches</span>
                        <input min="0" required type="number" value={draft.showers} onChange={(event) => updateDraft("showers", Number(event.target.value))} />
                      </label>
                    </>
                  )}
                  <label className={styles.field}>
                    <span>Remplacer la photo (facultatif)</span>
                    <input accept="image/jpeg,image/png,image/webp" type="file" onChange={(event) => setSelectedImage(event.target.files?.[0] ?? null)} />
                  </label>
                  <label className={styles.field}>
                    <span>Description</span>
                    <textarea maxLength={5000} rows={4} value={draft.description} onChange={(event) => updateDraft("description", event.target.value)} />
                  </label>
                  <fieldset className={styles.amenitiesFieldset}>
                    <legend>Commodités</legend>
                    <div className={styles.amenitiesOptions}>
                      {LISTING_AMENITIES.map((amenity) => (
                        <label className={styles.amenityOption} key={amenity}>
                          <input
                            checked={selectedAmenities.includes(amenity)}
                            onChange={() => setSelectedAmenities((current) =>
                              current.includes(amenity)
                                ? current.filter((item) => item !== amenity)
                                : [...current, amenity],
                            )}
                            type="checkbox"
                          />
                          <span>{amenity}</span>
                        </label>
                      ))}
                    </div>
                    <label className={`${styles.field} ${styles.amenitiesOtherField}`}>
                      <span>Préciser d’autres commodités</span>
                      <input maxLength={500} value={featuresText} onChange={(event) => setFeaturesText(event.target.value)} />
                      <span className={styles.amenitiesExample}>Exemple : étage 2, balcon</span>
                    </label>
                  </fieldset>
                  <div className={styles.listingManagerActions}>
                    <button className={styles.primaryAction} type="submit" disabled={busyListingId !== null}>
                      <Save size={16} aria-hidden="true" /> Enregistrer
                    </button>
                    <button className={styles.cancelAction} type="button" disabled={busyListingId !== null} onClick={cancelEdit}>
                      <X size={16} aria-hidden="true" /> Annuler
                    </button>
                  </div>
                </form>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyRequestQueue}>Aucune annonce à gérer.</div>
      )}
    </section>
  );
}
