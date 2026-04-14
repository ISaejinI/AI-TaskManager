"use client";

const FILTERS = [
  { id: "all", label: "Toutes" },
  { id: "active", label: "Actives" },
  { id: "completed", label: "Complétées" },
];

export default function FilterBar({
  currentFilter,
  onFilterChange,
  sortOrder,
  onSortChange,
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
                  ? "bg-primary text-surface-container-lowest"
                  : "bg-surface-container-high text-on-surface hover:bg-surface-container-low"
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        <label htmlFor="task-sort" className="sr-only">
          Trier les tâches
        </label>
        <select
          id="task-sort"
          value={sortOrder}
          onChange={(e) => onSortChange(e.target.value)}
          className="rounded-full bg-surface-container-lowest px-4 py-3 text-body-md font-semibold text-on-surface shadow-ambient focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <option value="dateDesc">Date (plus recente d'abord)</option>
          <option value="dateAsc">Date (plus ancienne d'abord)</option>
          <option value="priorityDesc">Priorite (elevee vers basse)</option>
          <option value="priorityAsc">Priorite (basse vers elevee)</option>
        </select>
      </div>
    </div>
  );
}

