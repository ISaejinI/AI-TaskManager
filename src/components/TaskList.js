"use client";

import TaskItem from "./TaskItem";

export default function TaskList({ tasks, onToggle, onDelete }) {
  if (!Array.isArray(tasks) || tasks.length === 0) {
    return (
      <p className="rounded-xl bg-surface-container-lowest p-6 text-body-md text-on-surface-variant shadow-ambient">
        Aucune tâche pour le moment
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {tasks.map((task) => (
        <TaskItem
          key={task.id ?? task.title}
          title={task.title}
          description={task.description}
          dueDate={task.dueDate}
          priority={task.priority}
          completed={task.completed}
          onToggle={() => onToggle(task.id)}
          onDelete={() => onDelete(task.id)}
        />
      ))}
    </div>
  );
}

