"use client";

import { useEffect, useState } from "react";
import AddTaskForm from "../../components/AddTaskForm";
import AuthGuard from "../../components/AuthGuard";
import Dashboard from "../../components/Dashboard";
import FilterBar from "../../components/FilterBar";
import SearchBar from "../../components/SearchBar";
import TaskList from "../../components/TaskList";
import { useAuth } from "../../contexts/AuthContext";
import useTaskFilter from "../../hooks/useTaskFilter";
import useTaskSearch from "../../hooks/useTaskSearch";
import { addTask, deleteTask, subscribeToTasks, updateTask } from "../../services/taskService";

export default function DashboardPage() {
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
      setError(serviceError.message ?? "Impossible de charger les taches.");
      return undefined;
    }
  }, [user?.uid]);

  const searchedTasks = useTaskSearch(tasks, searchQuery);
  const visibleTasks = useTaskFilter(searchedTasks, filter, sortOrder);

  const handleAddTask = async ({ title, priority }) => {
    if (!user?.uid) {
      throw new Error("Aucun utilisateur connecte.");
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
      <main className="flex min-h-screen flex-1 justify-center bg-surface px-3 pb-12 pt-6 sm:px-6">
        <section className="flex w-full max-w-6xl flex-col gap-6" aria-label="Dashboard utilisateur">
          <header className="flex flex-col gap-2">
            <h1 className="font-display text-display-sm text-on-surface">Dashboard</h1>
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

          <div className="mb-2 flex flex-col gap-3">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            <FilterBar
              currentFilter={filter}
              onFilterChange={setFilter}
              sortOrder={sortOrder}
              onSortChange={setSortOrder}
            />
          </div>

          <TaskList tasks={visibleTasks} onToggle={handleToggleTask} onDelete={handleDeleteTask} />
        </section>
      </main>
    </AuthGuard>
  );
}
