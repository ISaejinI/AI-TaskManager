"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function LoginForm() {
  const { signIn, signInWithGoogle, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    email: null,
    password: null,
  });

  const formErrorId = "login-form-error";
  const emailErrorId = "login-email-error";
  const passwordErrorId = "login-password-error";

  const validateFields = () => {
    const nextFieldErrors = {
      email: null,
      password: null,
    };

    if (!email.trim()) {
      nextFieldErrors.email = "L'adresse e-mail est requise.";
    }

    if (!password.trim()) {
      nextFieldErrors.password = "Le mot de passe est requis.";
    }

    setFieldErrors(nextFieldErrors);
    return !nextFieldErrors.email && !nextFieldErrors.password;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateFields()) {
      return;
    }

    try {
      setIsSubmitting(true);
      await signIn(email.trim(), password);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsSubmitting(true);
      await signInWithGoogle();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      aria-label="Formulaire de connexion"
      className="w-full rounded-xl bg-surface-container-lowest p-6 shadow-ambient"
    >
      {(error || fieldErrors.email || fieldErrors.password) && (
        <p
          id={formErrorId}
          role="alert"
          className="mb-4 rounded-lg bg-danger/10 px-4 py-3 text-body-md text-danger"
        >
          {fieldErrors.email || fieldErrors.password || error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <div className="flex flex-col gap-2">
          <label htmlFor="login-email" className="text-label-md font-medium text-on-surface">
            Adresse e-mail
          </label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="exemple@domaine.com"
            aria-invalid={Boolean(fieldErrors.email || error)}
            aria-describedby={
              fieldErrors.email ? `${emailErrorId} ${formErrorId}` : error ? formErrorId : undefined
            }
            className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 text-body-md text-on-surface placeholder:text-on-surface-variant/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
          {fieldErrors.email ? (
            <p id={emailErrorId} className="text-label-sm text-danger">
              {fieldErrors.email}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="login-password"
            className="text-label-md font-medium text-on-surface"
          >
            Mot de passe
          </label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Votre mot de passe"
            aria-invalid={Boolean(fieldErrors.password || error)}
            aria-describedby={
              fieldErrors.password
                ? `${passwordErrorId} ${formErrorId}`
                : error
                  ? formErrorId
                  : undefined
            }
            className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 text-body-md text-on-surface placeholder:text-on-surface-variant/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
          {fieldErrors.password ? (
            <p id={passwordErrorId} className="text-label-sm text-danger">
              {fieldErrors.password}
            </p>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-primary px-6 py-3 text-body-md font-semibold text-surface-container-lowest transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Connexion..." : "Se connecter"}
        </button>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isSubmitting}
          className="rounded-full bg-surface-container-high px-6 py-3 text-body-md font-semibold text-on-surface transition-colors hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-60"
        >
          Se connecter avec Google
        </button>

        <p className="text-body-md text-on-surface-variant">
          Pas encore de compte ?{" "}
          <Link href="/signup" className="font-semibold text-primary hover:text-primary-strong">
            S'inscrire
          </Link>
        </p>
      </form>
    </section>
  );
}
