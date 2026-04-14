"use client";

import { useMemo } from "react";

function priorityRank(priority) {
  switch (priority) {
    case "weak":
      return 0;
    case "medium":
      return 1;
    case "strong":
      return 2;
    default:
      return 0;
  }
}

function getDateValue(task) {
  if (task?.dueDate) {
    const parsedDueDate = new Date(task.dueDate).getTime();
    return Number.isNaN(parsedDueDate) ? 0 : parsedDueDate;
  }
  return task?.createdAt ?? 0;
}

export default function useTaskFilter(tasks, sortOrder) {
  return useMemo(() => {
    return tasks.slice().sort((a, b) => {
      if (sortOrder === "priorityAsc") {
        return priorityRank(a.priority) - priorityRank(b.priority);
      }

      if (sortOrder === "priorityDesc") {
        return priorityRank(b.priority) - priorityRank(a.priority);
      }

      if (sortOrder === "dateAsc") {
        return getDateValue(a) - getDateValue(b);
      }

      return getDateValue(b) - getDateValue(a);
    });
  }, [tasks, sortOrder]);
}

