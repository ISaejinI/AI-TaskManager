"use client";

import ProgressBar from "./ProgressBar";
import TaskStats from "./TaskStats";

export default function Dashboard({ tasks = [] }) {
  const safeTasks = Array.isArray(tasks) ? tasks : [];
  const totalTasks = safeTasks.length;
  const completedTasks = safeTasks.filter((task) => task.completed).length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <section aria-label="Tableau de bord" className="flex flex-col gap-4">
      <header>
        <h2 className="text-title-lg font-semibold text-on-surface">Tableau de bord</h2>
      </header>

      {totalTasks === 0 ? (
        <p className="rounded-xl bg-surface-container-lowest p-6 text-body-md text-on-surface-variant shadow-ambient">
          Aucune tâche pour le moment. Ajoute une tâche pour voir les statistiques.
        </p>
      ) : (
        <>
          <TaskStats tasks={safeTasks} />
          <section
            aria-label="Progression globale des tâches"
            className="rounded-xl bg-surface-container-lowest p-5 shadow-ambient"
          >
            <ProgressBar percentage={progress} label="Progression globale" />
          </section>
        </>
      )}
    </section>
  );
}
