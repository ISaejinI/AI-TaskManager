"use client";

import { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import FilterBar from "../components/FilterBar";
import TaskList from "../components/TaskList";
import Dashboard from "../components/Dashboard";
import useTaskFilter from "../hooks/useTaskFilter";
import AuthGuard from "../components/AuthGuard";
import { useAuth } from "../contexts/AuthContext";
import {
  addTask,
  deleteTask,
  subscribeToTasks,
  updateTask,
} from "../services/taskService";
import AddTaskForm from "../components/AddTaskForm";

/*
  Page d'accueil du TaskManager, orchestrant les composants principaux.
  Sémantique améliorée : 
  - Ordre hiérarchique : main > header (h1) > section (features) > section (tâches) > TaskList
  Le composant AuthGuard protège toute la page pour s'assurer que seul un utilisateur authentifié y accède.
*/
export default function Home() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("dateDesc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.uid) {
      setTasks([]);
      setLoading(false);
      return undefined;
    }

    setLoading(true);
    setError(null);

    try {
      const unsubscribe = subscribeToTasks(
        user.uid,
        (nextTasks) => {
          setTasks(nextTasks);
          setError(null);
          setLoading(false);
        },
        (subscriptionError) => {
          setError(subscriptionError);
          setLoading(false);
        }
      );

      return unsubscribe;
    } catch (serviceError) {
      setLoading(false);
      setError(serviceError.message ?? "Impossible de charger les taches depuis Firestore.");
      return undefined;
    }
  }, [user?.uid]);

  // La logique de recherche reste extraite ici, dans l'attente d'un hook dédié
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredTasks = tasks.filter((task) => {
    if (!normalizedQuery) return true;
    return String(task.title ?? "").toLowerCase().includes(normalizedQuery);
  });

  // Filtrage et tri via le hook custom
  const visibleTasks = useTaskFilter(filteredTasks, filter, sortOrder);

  // Handler pour l'ajout de tâche, passé à AddTaskForm
  const handleAddTask = async ({ title, priority }) => {
    if (!user?.uid) {
      throw new Error("Aucun utilisateur connecté.");
    }
    await addTask(user.uid, { title, priority });
  };

  const handleToggleTask = async (id) => {
    if (!user?.uid) {
      setError("Aucun utilisateur connecte.");
      return;
    }

    const taskToUpdate = tasks.find((task) => task.id === id);

    if (!taskToUpdate) {
      return;
    }

    try {
      setError(null);
      await updateTask(user.uid, id, { completed: !taskToUpdate.completed });
    } catch (serviceError) {
      setError(serviceError.message ?? "Impossible de mettre a jour la tache.");
    }
  };

  const handleDeleteTask = async (id) => {
    if (!user?.uid) {
      setError("Aucun utilisateur connecte.");
      return;
    }

    try {
      setError(null);
      await deleteTask(user.uid, id);
    } catch (serviceError) {
      setError(serviceError.message ?? "Impossible de supprimer la tache.");
    }
  };

  return (
    <AuthGuard>
      <main className="flex flex-1 min-h-screen justify-center bg-surface px-3 pb-12 pt-6 sm:px-6">
        <div className="flex w-full max-w-6xl flex-col gap-8">
          {/* Bandeau supérieur avec branding et CTA */}
          <header
            className="rounded-xl bg-surface-container-low p-8 shadow-soft"
            aria-label="En-tête principal"
          >
            <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-end">
              <div className="flex flex-col gap-4">
                <h1 className="font-display text-display-lg text-on-surface">
                  TaskManager
                </h1>
                <p className="max-w-xl text-headline-lg text-on-surface-variant">
                  Gérez vos tâches efficacement avec une interface épurée conçue
                  pour la clarté mentale.
                </p>
                <nav aria-label="Actions principales" className="mt-2 flex items-center gap-4">
                  <a
                    href="/signup"
                    className="rounded-full bg-primary-gradient px-8 py-3 text-lg font-semibold text-surface-container-lowest shadow-ambient transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    role="button"
                    tabIndex={0}
                  >
                    Commencer
                  </a>
                  <a
                    href="#liste-taches"
                    className="text-body-md font-semibold text-primary hover:text-primary-strong"
                  >
                    Voir la démo
                  </a>
                </nav>
              </div>
              {/* Section sémantique regroupant les features */}
              <section
                className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1"
                aria-label="Fonctionnalités principales"
              >
                <article className="rounded-xl bg-surface-container-lowest p-5 shadow-ambient">
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-on-surface" aria-hidden="true">
                    {/* Icône illustrative, pure déco */}
                    ◎
                  </div>
                  <h2 className="font-body text-title-lg font-semibold text-on-surface">
                    Focus Absolu
                  </h2>
                  <p className="mt-2 text-body-md text-on-surface-variant">
                    Éliminez les distractions avec une organisation claire.
                  </p>
                </article>
                <article className="rounded-xl bg-primary p-5 text-surface-container-lowest shadow-soft">
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container-lowest/20" aria-hidden="true">
                    ⚡
                  </div>
                  <h2 className="font-body text-title-lg font-semibold">
                    Vitesse Éclair
                  </h2>
                  <p className="mt-2 text-body-md text-surface-container-lowest/80">
                    Une interface réactive qui suit votre rythme.
                  </p>
                </article>
                <article className="rounded-xl bg-surface-container-lowest p-5 shadow-ambient">
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container-high text-on-surface" aria-hidden="true">
                    ▣
                  </div>
                  <h2 className="font-body text-title-lg font-semibold text-on-surface">
                    Analytiques
                  </h2>
                  <p className="mt-2 text-body-md text-on-surface-variant">
                    Suivez vos progrès avec des indicateurs lisibles.
                  </p>
                </article>
              </section>
            </div>
          </header>

          {/* Section de la liste des tâches */}
          <section
            id="liste-taches"
            className="flex flex-col gap-4"
            aria-label="Tâches du jour"
          >
            <header className="flex flex-col gap-2 px-2">
              <h2 className="font-display text-headline-lg text-on-surface">
                Tâches du jour
              </h2>
              <p className="text-body-md text-on-surface-variant">
                Retrouvez vos taches synchronisees en temps reel.
              </p>
            </header>

            {loading ? (
              <p
                role="status"
                aria-live="polite"
                className="rounded-xl bg-surface-container-lowest p-4 text-body-md text-on-surface-variant shadow-ambient"
              >
                Chargement...
              </p>
            ) : null}

            {error ? (
              <p
                role="alert"
                className="rounded-xl bg-danger/10 p-4 text-body-md text-danger shadow-ambient"
              >
                {error}
              </p>
            ) : null}

            <AddTaskForm onAddTask={handleAddTask} />

            <Dashboard tasks={tasks} />
            <div className="mb-4 flex flex-col gap-3">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
              <FilterBar
                currentFilter={filter}
                onFilterChange={setFilter}
                sortOrder={sortOrder}
                onSortChange={setSortOrder}
              />
            </div>
            <TaskList
              tasks={visibleTasks}
              onToggle={handleToggleTask}
              onDelete={handleDeleteTask}
            />
          </section>
        </div>
      </main>
    </AuthGuard>
  );
}
