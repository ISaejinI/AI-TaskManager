"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function SignupForm() {
  const { signUp, error } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    email: null,
    password: null,
    confirmPassword: null,
  });

  const formErrorId = "signup-form-error";
  const emailErrorId = "signup-email-error";
  const passwordErrorId = "signup-password-error";
  const confirmPasswordErrorId = "signup-confirm-password-error";

  const validateFields = () => {
    const nextFieldErrors = {
      email: null,
      password: null,
      confirmPassword: null,
    };

    if (!email.trim()) {
      nextFieldErrors.email = "L'adresse e-mail est requise.";
    }

    if (!password.trim()) {
      nextFieldErrors.password = "Le mot de passe est requis.";
    }

    if (!confirmPassword.trim()) {
      nextFieldErrors.confirmPassword = "La confirmation du mot de passe est requise.";
    } else if (password !== confirmPassword) {
      nextFieldErrors.confirmPassword = "Les mots de passe ne correspondent pas.";
    }

    setFieldErrors(nextFieldErrors);
    return !nextFieldErrors.email && !nextFieldErrors.password && !nextFieldErrors.confirmPassword;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateFields()) {
      return;
    }

    try {
      setIsSubmitting(true);
      await signUp(email.trim(), password);
      router.replace("/");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      aria-label="Formulaire d'inscription"
      className="w-full rounded-xl bg-surface-container-lowest p-6 shadow-ambient"
    >
      {(error || fieldErrors.email || fieldErrors.password || fieldErrors.confirmPassword) && (
        <p
          id={formErrorId}
          role="alert"
          className="mb-4 rounded-lg bg-danger/10 px-4 py-3 text-body-md text-danger"
        >
          {fieldErrors.email || fieldErrors.password || fieldErrors.confirmPassword || error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <div className="flex flex-col gap-2">
          <label htmlFor="signup-email" className="text-label-md font-medium text-on-surface">
            Adresse e-mail
          </label>
          <input
            id="signup-email"
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
            htmlFor="signup-password"
            className="text-label-md font-medium text-on-surface"
          >
            Mot de passe
          </label>
          <input
            id="signup-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Minimum 6 caracteres"
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

        <div className="flex flex-col gap-2">
          <label
            htmlFor="signup-confirm-password"
            className="text-label-md font-medium text-on-surface"
          >
            Confirmer le mot de passe
          </label>
          <input
            id="signup-confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Confirme ton mot de passe"
            aria-invalid={Boolean(fieldErrors.confirmPassword || error)}
            aria-describedby={
              fieldErrors.confirmPassword
                ? `${confirmPasswordErrorId} ${formErrorId}`
                : error
                  ? formErrorId
                  : undefined
            }
            className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 text-body-md text-on-surface placeholder:text-on-surface-variant/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-primary px-6 py-3 text-body-md font-semibold text-surface-container-lowest transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Inscription..." : "S'inscrire"}
        </button>

        <p className="text-body-md text-on-surface-variant">
          Deja un compte ?{" "}
          <Link href="/login" className="font-semibold text-primary hover:text-primary-strong">
            Se connecter
          </Link>
        </p>
      </form>
    </section>
  );
}
