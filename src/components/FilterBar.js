"use client";

const FILTERS = [
  { id: "all", label: "Toutes" },
  { id: "active", label: "Actives" },
  { id: "completed", label: "Complétées" },
];

export default function FilterBar({ currentFilter, onFilterChange }) {
  return (
    <div
      className="flex w-full flex-wrap items-center gap-2"
      role="group"
      aria-label="Filtres des tâches"
    >
      {FILTERS.map((filter) => {
        const isActive = currentFilter === filter.id;

        return (
          <button
            key={filter.id}
            type="button"
            onClick={() => onFilterChange(filter.id)}
            aria-pressed={isActive}
            className={`rounded-full px-4 py-2 text-body-md font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              isActive
                ? "bg-blue-600 text-white"
                : "bg-surface-container-high text-on-surface hover:bg-surface-container-low"
            }`}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}

