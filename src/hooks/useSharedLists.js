"use client";

import { useEffect, useMemo, useState } from "react";
import { subscribeToSharedLists, subscribeToSharedTasks } from "../services/sharedListService";

export default function useSharedLists(userId) {
  const [sharedLists, setSharedLists] = useState([]);
  const [taskStatsByListId, setTaskStatsByListId] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setSharedLists([]);
      setLoading(false);
      return undefined;
    }

    setLoading(true);
    setError(null);

    try {
      const unsubscribe = subscribeToSharedLists(
        userId,
        (lists) => {
          setSharedLists(Array.isArray(lists) ? lists : []);
          setLoading(false);
        },
        (subscriptionError) => {
          setError(subscriptionError);
          setLoading(false);
        }
      );

      return unsubscribe;
    } catch (serviceError) {
      setError(serviceError?.message ?? "Impossible de charger les listes partagees.");
      setLoading(false);
      return undefined;
    }
  }, [userId]);

  useEffect(() => {
    if (sharedLists.length === 0) {
      setTaskStatsByListId({});
      return undefined;
    }

    const unsubscribeByListId = sharedLists.map((list) =>
      subscribeToSharedTasks(
        list.id,
        (tasks) => {
          const safeTasks = Array.isArray(tasks) ? tasks : [];
          const totalTasks = safeTasks.length;
          const completedTasks = safeTasks.filter((task) => Boolean(task?.completed)).length;

          setTaskStatsByListId((previousStats) => ({
            ...previousStats,
            [list.id]: {
              totalTasks,
              completedTasks,
            },
          }));
        },
        (subscriptionError) => {
          setError(subscriptionError);
        }
      )
    );

    return () => {
      unsubscribeByListId.forEach((unsubscribe) => {
        if (typeof unsubscribe === "function") {
          unsubscribe();
        }
      });
    };
  }, [sharedLists]);

  const sharedListsWithStats = useMemo(
    () =>
      sharedLists.map((list) => {
        const stats = taskStatsByListId[list.id];
        const totalTasks = Number(stats?.totalTasks) || 0;
        const completedTasks = Number(stats?.completedTasks) || 0;

        return {
          ...list,
          totalTasks,
          completedTasks,
        };
      }),
    [sharedLists, taskStatsByListId]
  );

  return {
    sharedLists,
    sharedListsWithStats,
    loading,
    error,
    setError,
  };
}
