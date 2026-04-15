"use client";

export default function TaskStats({ tasks = [] }) {
  const safeTasks = Array.isArray(tasks) ? tasks : [];
  const totalTasks = safeTasks.length;
  const completedTasks = safeTasks.filter((task) => task.completed).length;
  const activeTasks = totalTasks - completedTasks;

  return (
    <section
      aria-label="Statistiques des tâches"
      className="rounded-xl bg-surface-container-lowest p-5 shadow-ambient"
    >
      <header className="mb-4">
        <h2 className="text-title-sm font-semibold text-on-surface">Statistiques</h2>
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <article className="rounded-lg bg-surface-container p-3">
          <p className="text-label-sm text-on-surface-variant">Total</p>
          <p className="text-title-md font-semibold text-on-surface">{totalTasks}</p>
        </article>

        <article className="rounded-lg bg-surface-container p-3">
          <p className="text-label-sm text-on-surface-variant">Complétées</p>
          <p className="text-title-md font-semibold text-on-surface">{completedTasks}</p>
        </article>

        <article className="rounded-lg bg-surface-container p-3">
          <p className="text-label-sm text-on-surface-variant">Actives</p>
          <p className="text-title-md font-semibold text-on-surface">{activeTasks}</p>
        </article>
      </div>

    </section>
  );
}
