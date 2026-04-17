"use client";

const PRIORITY_STYLES = {
  strong: "bg-primary text-surface-container-lowest",
  medium: "bg-secondary text-on-surface",
  weak: "bg-surface-container-high text-on-surface-variant",
};

const PRIORITY_LABELS = {
  strong: "Haute",
  medium: "Moyenne",
  weak: "Basse",
};

export default function TaskItem({
  title,
  description,
  dueDate,
  priority,
  completed,
  onToggle,
  onDelete,
}) {
  const priorityClass = PRIORITY_STYLES[priority] ?? PRIORITY_STYLES.weak;
  const priorityLabel = PRIORITY_LABELS[priority] ?? PRIORITY_LABELS.weak;
  const normalizedDescription = typeof description === "string" ? description.trim() : "";

  let parsedDueDate = null;
  if (dueDate instanceof Date) {
    parsedDueDate = dueDate;
  } else if (typeof dueDate?.toDate === "function") {
    parsedDueDate = dueDate.toDate();
  } else if (typeof dueDate?.seconds === "number") {
    parsedDueDate = new Date(dueDate.seconds * 1000);
  } else if (typeof dueDate === "string" && dueDate.trim()) {
    parsedDueDate = new Date(dueDate);
  }

  const formattedDueDate =
    parsedDueDate && !Number.isNaN(parsedDueDate.getTime())
      ? parsedDueDate.toLocaleDateString("fr-FR")
      : null;

  return (
    <article className="w-full rounded-xl bg-surface-container-lowest p-6 shadow-ambient">
      <div className="flex items-start gap-4">
        <input
          type="checkbox"
          checked={completed}
          onChange={onToggle}
          aria-label={`Marquer la tâche ${title} comme complétée`}
          className="mt-1 h-6 w-6 cursor-pointer appearance-none rounded-full border-2 border-outline-variant bg-surface checked:border-primary checked:bg-primary checked:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        />

        <div className="flex-1">
          <h3
            className={`font-body text-title-lg font-semibold text-on-surface ${completed ? "opacity-60 line-through" : ""}`}
          >
            {title}
          </h3>
          {normalizedDescription ? (
            <p className="mt-2 text-body-md text-on-surface-variant">
              {normalizedDescription}
            </p>
          ) : null}
          {formattedDueDate ? (
            <p className="mt-2 text-label-md text-on-surface-variant">
              Date limite : {formattedDueDate}
            </p>
          ) : null}

          <span
            className={`mt-4 inline-flex rounded-full px-3 py-1 text-label-md ${priorityClass}`}
          >
            {priorityLabel}
          </span>
        </div>

        <button
          type="button"
          onClick={onDelete}
          aria-label={`Supprimer la tâche ${title}`}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-danger text-surface-container-lowest transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path d="M3 6h18" />
            <path d="M8 6V4h8v2" />
            <path d="M19 6l-1 14H6L5 6" />
            <path d="M10 11v6" />
            <path d="M14 11v6" />
          </svg>
        </button>
      </div>
    </article>
  );
}
