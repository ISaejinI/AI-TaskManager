"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

// Menu utilisateur : affiche le mail + bouton déconnexion si connecté, sinon liens vers login/signup
export default function UserMenu() {
  const { user, signOut } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignOut = async () => {
    try {
      setIsSubmitting(true);
      await signOut();
    } finally {
      setIsSubmitting(false);
    }
  };

  // connecté : email + bouton déconnexion
  if (user) {
    const userEmail = user?.email ?? "Utilisateur connecté";
    return (
      <section
        aria-label="Menu utilisateur"
        className="flex items-center gap-4 rounded-xl bg-surface-container-lowest p-4 shadow-ambient"
      >
        <p className="truncate text-body-md text-on-surface" title={userEmail}>
          {userEmail}
        </p>
        <button
          type="button"
          onClick={handleSignOut}
          disabled={isSubmitting}
          className="rounded-full bg-primary px-4 py-2 text-label-md font-semibold text-surface-container-lowest transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Déconnexion..." : "Se déconnecter"}
        </button>
      </section>
    );
  }

  // non connecté : lien vers login + bouton inscription
  return (
    <section
      aria-label="Menu utilisateur"
      className="flex items-center gap-4 rounded-xl bg-surface-container-lowest p-4 shadow-ambient"
    >
      <Link
        href="/login"
        className="text-body-md font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full px-3 py-2"
      >
        Connexion
      </Link>
      <Link
        href="/signup"
        className="rounded-full bg-primary px-4 py-2 text-label-md font-semibold text-surface-container-lowest transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        role="button"
        tabIndex={0}
      >
        S&apos;inscrire
      </Link>
    </section>
  );
}
