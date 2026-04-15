"use client";

import { useMemo } from "react";

export default function useTaskSearch(tasks, searchQuery) {
  return useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return tasks;
    }

    // Recherche insensible a la casse sur le titre de tache.
    return tasks.filter((task) =>
      String(task?.title ?? "").toLowerCase().includes(normalizedQuery)
    );
  }, [tasks, searchQuery]);
}
