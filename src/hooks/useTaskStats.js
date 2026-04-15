"use client";

import { useMemo } from "react";

export default function useTaskStats(tasks) {
  return useMemo(() => {
    const safeTasks = Array.isArray(tasks) ? tasks : [];
    const totalTasks = safeTasks.length;
    const completedTasks = safeTasks.filter((task) => task.completed).length;
    const activeTasks = totalTasks - completedTasks;
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      safeTasks,
      totalTasks,
      completedTasks,
      activeTasks,
      progress,
    };
  }, [tasks]);
}
