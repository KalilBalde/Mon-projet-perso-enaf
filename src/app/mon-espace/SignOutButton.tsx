"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "../../lib/supabase/client";
import styles from "./dashboard.module.css";

export default function SignOutButton() {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    const { error } = await createClient().auth.signOut();

    if (!error) {
      router.replace("/mon-espace");
      router.refresh();
    }

    setIsSigningOut(false);
  };

  return (
    <button
      className={styles.signOut}
      aria-label="Déconnexion"
      disabled={isSigningOut}
      onClick={handleSignOut}
      type="button"
    >
      <LogOut size={18} aria-hidden="true" />
      <span className={styles.signOutLabel}>
        {isSigningOut ? "Déconnexion..." : "Déconnexion"}
      </span>
    </button>
  );
}