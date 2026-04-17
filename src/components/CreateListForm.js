"use client";

import { useState } from "react";
import { buildRequiredFieldErrors } from "../lib/formValidation";

export default function CreateListForm({ onCreateList }) {
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const titleErrorId = "create-list-name-error";
  const formErrorId = "create-list-form-error";

  const handleSubmit = async (event) => {
    event.preventDefault();

    const normalizedName = name.trim();
    const fieldErrors = buildRequiredFieldErrors({
      name: {
        value: normalizedName,
        message: "Le nom de la liste est obligatoire.",
      },
    });

    if (fieldErrors.name) {
      setError(fieldErrors.name);
      return;
    }

    if (typeof onCreateList !== "function") {
      setError("Impossible de creer la liste pour le moment.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onCreateList(normalizedName);
      setName("");
    } catch (createError) {
      setError(createError?.message ?? "Une erreur est survenue lors de la creation de la liste.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      aria-label="Creation d'une liste partagee"
      className="rounded-xl bg-surface-container-lowest p-4 shadow-ambient"
    >
      {error ? (
        <p
          id={formErrorId}
          role="alert"
          className="mb-3 rounded-lg bg-danger/10 px-4 py-3 text-body-md text-danger"
        >
          {error}
        </p>
      ) : null}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-end" noValidate>
        <div className="flex w-full flex-col gap-2">
          <label htmlFor="create-list-name" className="text-label-md font-medium text-on-surface">
            Nom de la liste
          </label>
          <input
            id="create-list-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Ex: Sprint equipe produit"
            aria-invalid={Boolean(error && !name.trim())}
            aria-describedby={error && !name.trim() ? `${titleErrorId} ${formErrorId}` : undefined}
            className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 text-body-md text-on-surface placeholder:text-on-surface-variant/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
          {error && !name.trim() ? (
            <p id={titleErrorId} className="text-label-sm text-danger">
              Le nom de la liste est obligatoire.
            </p>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-primary px-6 py-3 text-body-md font-semibold text-surface-container-lowest transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Creation..." : "Creer"}
        </button>
      </form>
    </section>
  );
}
