"use client";

import AddTaskForm from "../../components/AddTaskForm";
import AuthGuard from "../../components/AuthGuard";
import Dashboard from "../../components/Dashboard";
import FilterBar from "../../components/FilterBar";
import SearchBar from "../../components/SearchBar";
import TaskList from "../../components/TaskList";
import { useAuth } from "../../contexts/AuthContext";
import useDashboardTasks from "../../hooks/useDashboardTasks";

export default function DashboardPage() {
  const { user } = useAuth();
  const {
    tasks,
    visibleTasks,
    searchQuery,
    setSearchQuery,
    filter,
    setFilter,
    sortOrder,
    setSortOrder,
    loading,
    error,
    createTask,
    toggleTask,
    removeTask,
  } = useDashboardTasks(user?.uid);

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

          <AddTaskForm onAddTask={createTask} />
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

          <TaskList tasks={visibleTasks} onToggle={toggleTask} onDelete={removeTask} />
        </section>
      </main>
    </AuthGuard>
  );
}
