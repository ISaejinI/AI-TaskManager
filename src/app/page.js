"use client";

import { useState } from "react";
import SearchBar from "../components/SearchBar";
import FilterBar from "../components/FilterBar";
import TaskList from "../components/TaskList";

// Page d'accueil avec tests visuels du composant TaskItem
export default function Home() {
  const [tasks, setTasks] = useState(() => [
    {
      id: crypto.randomUUID(),
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
      dueDate: "2026-04-20",
      title: "Préparer la roadmap produit",
      description: "Lister les objectifs du sprint et les dépendances clés.",
      priority: "strong",
      completed: false,
    },
    {
      id: crypto.randomUUID(),
      createdAt: Date.now() - 1000 * 60 * 60 * 24,
      dueDate: "2026-04-18",
      title: "Mettre à jour la documentation API",
      description: "Compléter les exemples d'authentification et de pagination.",
      priority: "medium",
      completed: true,
    },
    {
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      dueDate: "2026-04-16",
      title: "Organiser la revue hebdomadaire",
      description: "Partager l'ordre du jour et réserver la salle.",
      priority: "weak",
      completed: false,
    },
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("date");

  const priorityRank = (p) => {
    switch (p) {
      case "weak":
        return 0;
      case "medium":
        return 1;
      case "strong":
        return 2;
      default:
        return 0;
    }
  };

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const visibleTasks = tasks
    .filter((task) => {
      if (!normalizedQuery) return true;
      return String(task.title ?? "").toLowerCase().includes(normalizedQuery);
    })
    .filter((task) => {
      if (filter === "active") return !task.completed;
      if (filter === "completed") return task.completed;
      return true;
    })
    .toSorted((a, b) => {
      if (sortOrder === "priority") {
        return priorityRank(a.priority) - priorityRank(b.priority);
      }

      return (b.createdAt ?? 0) - (a.createdAt ?? 0);
    });

  const handleToggleTask = (id) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDeleteTask = (id) => {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
  };

  return (
    <main className="flex flex-1 min-h-screen justify-center bg-surface px-3 pb-12 pt-6 sm:px-6">
      <section
        className="flex w-full max-w-6xl flex-col gap-8"
        aria-label="Page d'accueil TaskManager avec tests de tâches"
      >
        <header className="grid gap-8 rounded-xl bg-surface-container-low p-8 shadow-soft lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <div className="flex flex-col gap-4">
            <h1 className="font-display text-display-lg text-on-surface">
              TaskManager
            </h1>
            <p className="max-w-xl text-headline-lg text-on-surface-variant">
              Gerez vos taches efficacement avec une interface epuree concue
              pour la clarte mentale.
            </p>
            <div className="mt-2 flex items-center gap-4">
              <button
                type="button"
                className="rounded-full bg-primary-gradient px-8 py-3 text-lg font-semibold text-surface-container-lowest shadow-ambient transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Commencer
              </button>
              <a
                href="#liste-taches"
                className="text-body-md font-semibold text-primary hover:text-primary-strong"
              >
                Voir la demo
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <article className="rounded-xl bg-surface-container-lowest p-5 shadow-ambient">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-on-surface">
                ◎
              </div>
              <h3 className="font-body text-title-lg font-semibold text-on-surface">
                Focus Absolu
              </h3>
              <p className="mt-2 text-body-md text-on-surface-variant">
                Eliminez les distractions avec une organisation claire.
              </p>
            </article>

            <article className="rounded-xl bg-primary p-5 text-surface-container-lowest shadow-soft">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container-lowest/20">
                ⚡
              </div>
              <h3 className="font-body text-title-lg font-semibold">
                Vitesse Eclair
              </h3>
              <p className="mt-2 text-body-md text-surface-container-lowest/80">
                Une interface reactive qui suit votre rythme.
              </p>
            </article>

            <article className="rounded-xl bg-surface-container-lowest p-5 shadow-ambient">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container-high text-on-surface">
                ▣
              </div>
              <h3 className="font-body text-title-lg font-semibold text-on-surface">
                Analytiques
              </h3>
              <p className="mt-2 text-body-md text-on-surface-variant">
                Suivez vos progres avec des indicateurs lisibles.
              </p>
            </article>
          </div>
        </header>

        <header className="flex flex-col gap-2 px-2">
          <h2 className="font-display text-headline-lg text-on-surface">
            Taches du jour
          </h2>
          <p className="text-body-md text-on-surface-variant">
            Trois taches de test pour valider le composant TaskItem.
          </p>
        </header>

        <div id="liste-taches">
          <div className="mb-4 flex flex-col gap-3">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <FilterBar currentFilter={filter} onFilterChange={setFilter} />
              <div className="flex items-center gap-3">
                <label htmlFor="task-sort" className="sr-only">
                  Trier les tâches
                </label>
                <select
                  id="task-sort"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="rounded-full bg-surface-container-lowest px-4 py-3 text-body-md font-semibold text-on-surface shadow-ambient focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <option value="priority">Priorité</option>
                  <option value="date">Date</option>
                </select>
              </div>
            </div>
          </div>
          <TaskList
            tasks={visibleTasks}
            onToggle={handleToggleTask}
            onDelete={handleDeleteTask}
          />
        </div>
      </section>
    </main>
  );
}
