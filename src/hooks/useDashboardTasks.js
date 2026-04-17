"use client";

import { useEffect, useState } from "react";
import useTaskFilter from "./useTaskFilter";
import useTaskSearch from "./useTaskSearch";
import { addTask, deleteTask, subscribeToTasks, updateTask } from "../services/taskService";

export default function useDashboardTasks(userId) {
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("dateDesc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      return undefined;
    }

    const unsubscribe = subscribeToTasks(
      userId,
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
  }, [userId]);

  const safeTasks = userId ? tasks : [];
  const safeLoading = userId ? loading : false;

  const searchedTasks = useTaskSearch(safeTasks, searchQuery);
  const visibleTasks = useTaskFilter(searchedTasks, filter, sortOrder);

  const createTask = async ({ title, description, dueDate, priority }) => {
    if (!userId) {
      throw new Error("Vous devez etre connecte pour effectuer cette action.");
    }

    await addTask(userId, { title, description, dueDate, priority });
  };

  const toggleTask = async (id) => {
    if (!userId) {
      setError("Vous devez etre connecte pour effectuer cette action.");
      return;
    }

    const taskToUpdate = tasks.find((task) => task.id === id);

    if (!taskToUpdate) {
      return;
    }

    try {
      setError(null);
      await updateTask(userId, id, { completed: !taskToUpdate.completed });
    } catch (serviceError) {
      setError(serviceError?.message ?? "Une erreur est survenue. Veuillez reessayer.");
    }
  };

  const removeTask = async (id) => {
    if (!userId) {
      setError("Vous devez etre connecte pour effectuer cette action.");
      return;
    }

    try {
      setError(null);
      await deleteTask(userId, id);
    } catch (serviceError) {
      setError(serviceError?.message ?? "Une erreur est survenue. Veuillez reessayer.");
    }
  };

  return {
    tasks: safeTasks,
    visibleTasks,
    searchQuery,
    setSearchQuery,
    filter,
    setFilter,
    sortOrder,
    setSortOrder,
    loading: safeLoading,
    error,
    createTask,
    toggleTask,
    removeTask,
  };
}
