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
      return undefined;
    }

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
  }, [userId]);

  useEffect(() => {
    const subscribableLists = sharedLists.filter((list) => Boolean(list?.id) && Boolean(list?.createdAt));

    if (subscribableLists.length === 0) {
      return undefined;
    }

    const unsubscribeByListId = subscribableLists.map((list) =>
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
        (subscriptionError, errorCode) => {
          // Le flux de stats est secondaire; on ignore le refus transitoire lors d'une creation.
          if (errorCode === "permission-denied") {
            setTaskStatsByListId((previousStats) => ({
              ...previousStats,
              [list.id]: {
                totalTasks: 0,
                completedTasks: 0,
              },
            }));
            return;
          }

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
    sharedLists: userId ? sharedLists : [],
    sharedListsWithStats: userId ? sharedListsWithStats : [],
    loading: userId ? loading : false,
    error,
    setError,
  };
}
