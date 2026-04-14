"use client";

export default function SearchBar({ value, onChange }) {
  return (
    <div className="w-full">
      <label htmlFor="task-search" className="sr-only">
        Rechercher une tâche
      </label>
      <div className="flex items-center gap-2 rounded-full bg-surface-container-lowest px-4 py-3 shadow-ambient">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="h-5 w-5 text-on-surface-variant"
          aria-hidden="true"
        >
          <path d="M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z" />
          <path d="m21 21-4.3-4.3" />
        </svg>

        <input
          id="task-search"
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Rechercher une tâche..."
          className="flex-1 bg-transparent text-body-md text-on-surface placeholder:text-on-surface-variant/70 focus-visible:outline-none"
        />

        {value ? (
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Effacer la recherche"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-surface-container-high text-on-surface transition-colors hover:bg-primary hover:text-surface-container-lowest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path d="M18 6 6 18" />
              <path d="M6 6l12 12" />
            </svg>
          </button>
        ) : null}
      </div>
    </div>
  );
}

