"use client";

import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function UserMenu() {
  const { user, signOut } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userEmail = user?.email ?? "Utilisateur connecte";

  const handleSignOut = async () => {
    try {
      setIsSubmitting(true);
      await signOut();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      aria-label="Menu utilisateur"
      className="flex items-center justify-between gap-4 rounded-xl bg-surface-container-lowest p-4 shadow-ambient"
    >
      <p className="truncate text-body-md text-on-surface" title={userEmail}>
        {userEmail}
      </p>

      <button
        type="button"
        onClick={handleSignOut}
        disabled={isSubmitting}
        className="rounded-full bg-surface-container-high px-4 py-2 text-label-md font-semibold text-on-surface transition-colors hover:bg-surface-container disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Deconnexion..." : "Se deconnecter"}
      </button>
    </section>
  );
}
