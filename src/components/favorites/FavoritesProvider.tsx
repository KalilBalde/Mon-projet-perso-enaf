"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import {
  FAVORITE_RETURN_KEY,
  OPEN_ACCOUNT_MODAL_EVENT,
  PENDING_FAVORITE_KEY,
} from "../../data/constants";
import { createClient } from "../../lib/supabase/client";

interface FavoritesContextValue {
  favoriteIds: number[];
  toggleFavorite: (listingId: number) => void;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null);

  useEffect(() => {
    let active = true;
    let loadRequest = 0;

    try {
      const supabase = createClient();
      supabaseRef.current = supabase;

      const loadFavorites = async (user: User | null) => {
        const requestId = ++loadRequest;
        if (!user) {
          setUserId(null);
          setFavoriteIds([]);
          return;
        }

        setUserId(user.id);
        const { data, error } = await supabase
          .from("user_listing_favorites")
          .select("listing_id")
          .eq("user_id", user.id)
          .order("created_at", { ascending: true });

        if (!active || requestId !== loadRequest) return;
        if (error || !data) {
          setFavoriteIds([]);
          return;
        }

        const savedIds = [...new Set(data.map((row) => Number(row.listing_id)))];
        const pendingFavoriteId = Number(
          window.sessionStorage.getItem(PENDING_FAVORITE_KEY),
        );

        if (Number.isSafeInteger(pendingFavoriteId) && pendingFavoriteId > 0) {
          let favoriteSaved = savedIds.includes(pendingFavoriteId);

          if (!favoriteSaved) {
            const { error: saveError } = await supabase
              .from("user_listing_favorites")
              .upsert(
                { user_id: user.id, listing_id: pendingFavoriteId },
                { onConflict: "user_id,listing_id", ignoreDuplicates: true },
              );
            favoriteSaved = !saveError;
          }

          if (favoriteSaved) {
            if (!savedIds.includes(pendingFavoriteId)) savedIds.push(pendingFavoriteId);
            window.sessionStorage.removeItem(PENDING_FAVORITE_KEY);
          }
        }

        if (!active || requestId !== loadRequest) return;
        setFavoriteIds(savedIds);
      };

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === "INITIAL_SESSION" || event === "SIGNED_IN" || event === "SIGNED_OUT") {
          void loadFavorites(session?.user ?? null);
        }
      });

      void supabase.auth.getSession().then(({ data }) => {
        if (active) void loadFavorites(data.session?.user ?? null);
      });

      return () => {
        active = false;
        subscription.unsubscribe();
      };
    } catch {
      setFavoriteIds([]);
    }
  }, []);

  const toggleFavorite = (listingId: number) => {
    if (!userId || !supabaseRef.current) {
      try {
        window.sessionStorage.setItem(PENDING_FAVORITE_KEY, String(listingId));
        window.sessionStorage.setItem(
          FAVORITE_RETURN_KEY,
          JSON.stringify({
            href: `${window.location.pathname}${window.location.search}${window.location.hash}`,
            scrollY: window.scrollY,
          }),
        );
      } catch {}
      window.dispatchEvent(new CustomEvent(OPEN_ACCOUNT_MODAL_EVENT, {
        detail: { reason: "favorites" },
      }));
      return;
    }

    const wasFavorite = favoriteIds.includes(listingId);
    const nextIds = wasFavorite
      ? favoriteIds.filter((id) => id !== listingId)
      : [...favoriteIds, listingId];

    setFavoriteIds(nextIds);

    const supabase = supabaseRef.current;
    const request = wasFavorite
      ? supabase
          .from("user_listing_favorites")
          .delete()
          .eq("user_id", userId)
          .eq("listing_id", listingId)
      : supabase
          .from("user_listing_favorites")
          .insert({ user_id: userId, listing_id: listingId });

    void request.then(({ error }) => {
      if (error) {
        setFavoriteIds((current) =>
          wasFavorite
            ? [...new Set([...current, listingId])]
            : current.filter((id) => id !== listingId),
        );
        return;
      }

    });
  };

  return (
    <FavoritesContext.Provider value={{ favoriteIds, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesContextValue {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within FavoritesProvider");
  }
  return context;
}