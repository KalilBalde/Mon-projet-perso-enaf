/* ─── LISTINGS (biens immobiliers) ─── */

import type { Listing } from "../types";

export const LISTINGS: Listing[] = [
  { id: 1, title: "Appartement moderne 3 pieces", quartier: "Kipe", price: 3500000, surface: 72, rooms: 3, bathrooms: 1, type: "Appartement", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop", isNew: true, isFavorite: false },
  { id: 2, title: "Villa standing avec jardin", quartier: "Sonfonia", price: 15000000, surface: 200, rooms: 6, bathrooms: 3, type: "Villa", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop", isNew: false, isFavorite: true },
  { id: 3, title: "Chambre studio meublee", quartier: "Hamdallaye", price: 800000, surface: 25, rooms: 1, bathrooms: 1, type: "Chambre-Studio", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop", isNew: true, isFavorite: false },
  { id: 4, title: "Terrain vide bien situe", quartier: "Kagbelen", price: 5000000, surface: 400, rooms: 0, bathrooms: 0, type: "Terrain-Vide", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400&fit=crop", isNew: false, isFavorite: false },
  { id: 5, title: "Maison familiale spacieuse", quartier: "Cosa", price: 8500000, surface: 150, rooms: 5, bathrooms: 2, type: "Maison", image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600&h=400&fit=crop", isNew: true, isFavorite: false },
  { id: 6, title: "Appartement renove centre", quartier: "Cimenterie", price: 4200000, surface: 85, rooms: 4, bathrooms: 2, type: "Appartement", image: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=600&h=400&fit=crop", isNew: false, isFavorite: true },
  { id: 7, title: "Appartement renove centre", quartier: "Cimenterie", price: 4200000, surface: 85, rooms: 4, bathrooms: 2, type: "Appartement", image: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=600&h=400&fit=crop", isNew: false, isFavorite: true },
];
