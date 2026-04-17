"use client";

import { useState } from "react";

export default function AddTaskForm({ onAddTask }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const titleErrorId = "add-task-title-error";
  const formErrorId = "add-task-form-error";

  const handleSubmit = async (event) => {
    event.preventDefault();

    const normalizedTitle = title.trim();

    if (!normalizedTitle) {
      setError("Le titre de la tache est obligatoire.");
      return;
    }

    if (typeof onAddTask !== "function") {
      setError("Impossible d'ajouter la tache pour le moment.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onAddTask({
        title: normalizedTitle,
        description: description.trim(),
        dueDate: dueDate || null,
        priority,
      });
      setTitle("");
      setDescription("");
      setDueDate("");
      setPriority("medium");
    } catch (submitError) {
      setError(submitError?.message ?? "Une erreur est survenue lors de l'ajout de la tache.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      aria-label="Ajout d'une nouvelle tache"
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

      <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>
        <div className="flex w-full flex-col gap-2">
          <label htmlFor="add-task-title" className="text-label-md font-medium text-on-surface">
            Titre
          </label>
          <input
            id="add-task-title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Ajouter une tache"
            aria-invalid={Boolean(error && !title.trim())}
            aria-describedby={error && !title.trim() ? `${titleErrorId} ${formErrorId}` : undefined}
            className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 text-body-md text-on-surface placeholder:text-on-surface-variant/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
          {error && !title.trim() ? (
            <p id={titleErrorId} className="text-label-sm text-danger">
              Le titre de la tache est obligatoire.
            </p>
          ) : null}
        </div>

        <div className="flex w-full flex-col gap-2">
          <label htmlFor="add-task-description" className="text-label-md font-medium text-on-surface">
            Description (facultative)
          </label>
          <textarea
            id="add-task-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Ajouter une description de la tache"
            rows={3}
            className="w-full resize-y rounded-lg border border-outline-variant bg-surface px-4 py-3 text-body-md text-on-surface placeholder:text-on-surface-variant/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="add-task-due-date" className="text-label-md font-medium text-on-surface">
              Date de rendu
            </label>
            <input
              id="add-task-due-date"
              type="date"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
              className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 text-body-md text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="add-task-priority" className="text-label-md font-medium text-on-surface">
              Priorite
            </label>
            <select
              id="add-task-priority"
              value={priority}
              onChange={(event) => setPriority(event.target.value)}
              className="rounded-lg border border-outline-variant bg-surface px-4 py-3 text-body-md text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <option value="strong">Haute</option>
              <option value="medium">Moyenne</option>
              <option value="weak">Basse</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-primary px-6 py-3 text-body-md font-semibold text-surface-container-lowest transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Ajout..." : "Ajouter"}
          </button>
        </div>
      </form>
    </section>
  );
}
