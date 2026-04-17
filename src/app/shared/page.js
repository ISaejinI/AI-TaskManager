"use client";

import { useEffect, useMemo, useState } from "react";
import AuthGuard from "../../components/AuthGuard";
import CreateListForm from "../../components/CreateListForm";
import SharedListCard from "../../components/SharedListCard";
import SharedListView from "../../components/SharedListView";
import { useAuth } from "../../contexts/AuthContext";
import {
  addMemberToList,
  addSharedTask,
  createSharedList,
  deleteSharedList,
  deleteSharedTask,
  getSharedListTasks,
  removeMemberFromList,
  subscribeToSharedLists,
  subscribeToSharedTasks,
  updateSharedTask,
} from "../../services/sharedListService";

export default function SharedListsPage() {
  const { user } = useAuth();
  const [sharedLists, setSharedLists] = useState([]);
  const [selectedListId, setSelectedListId] = useState(null);
  const [selectedListTasks, setSelectedListTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.uid) {
      setSharedLists([]);
      setLoading(false);
      return undefined;
    }

    setLoading(true);
    setError(null);

    try {
      const unsubscribe = subscribeToSharedLists(
        user.uid,
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
  }, [user?.uid]);

  const selectedList = useMemo(() => {
    if (!selectedListId) {
      return null;
    }

    return sharedLists.find((list) => list.id === selectedListId) ?? null;
  }, [selectedListId, sharedLists]);

  useEffect(() => {
    if (!selectedList?.id) {
      setSelectedListTasks([]);
      setTasksLoading(false);
      return undefined;
    }

    setTasksLoading(true);
    setError(null);

    let unsubscribe = undefined;

    const subscribe = async () => {
      try {
        // Chargement initial pour afficher vite les donnees avant l'ecoute temps reel.
        const initialTasks = await getSharedListTasks(selectedList.id);
        setSelectedListTasks(initialTasks);
        setTasksLoading(false);

        unsubscribe = subscribeToSharedTasks(
          selectedList.id,
          (tasks) => {
            setSelectedListTasks(Array.isArray(tasks) ? tasks : []);
            setTasksLoading(false);
          },
          (subscriptionError) => {
            setError(subscriptionError);
            setTasksLoading(false);
          }
        );
      } catch (serviceError) {
        setError(serviceError?.message ?? "Impossible de charger les taches partagees.");
        setTasksLoading(false);
      }
    };

    subscribe();

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [selectedList?.id]);

  const handleCreateList = async (name) => {
    if (!user?.uid) {
      throw new Error("Aucun utilisateur connecte.");
    }

    await createSharedList(user.uid, name);
  };

  const handleOpenList = (list) => {
    setSelectedListId(list?.id ?? null);
  };

  const handleDeleteList = async (list) => {
    if (!user?.uid || !list?.id) {
      return;
    }

    try {
      setError(null);
      await deleteSharedList(list.id, user.uid);
      if (selectedListId === list.id) {
        setSelectedListId(null);
      }
    } catch (serviceError) {
      setError(serviceError?.message ?? "Impossible de supprimer la liste partagee.");
    }
  };

  const handleAddMember = async (email) => {
    if (!selectedList?.id) {
      throw new Error("Aucune liste partagee selectionnee.");
    }

    await addMemberToList(selectedList.id, email);
  };

  const handleRemoveMember = async (memberUserId) => {
    if (!selectedList?.id || !user?.uid || !memberUserId) {
      return;
    }

    try {
      setError(null);
      await removeMemberFromList(selectedList.id, memberUserId, user.uid);
    } catch (serviceError) {
      setError(serviceError?.message ?? "Impossible de retirer le membre.");
    }
  };

  const handleAddSharedTask = async (task) => {
    if (!selectedList?.id || !user?.uid) {
      throw new Error("Impossible d'ajouter la tache partagee.");
    }

    await addSharedTask(selectedList.id, user.uid, task);
  };

  const handleUpdateSharedTask = async (taskId, updates) => {
    if (!selectedList?.id || !taskId) {
      return;
    }

    try {
      setError(null);
      await updateSharedTask(selectedList.id, taskId, updates);
    } catch (serviceError) {
      setError(serviceError?.message ?? "Impossible de mettre a jour la tache partagee.");
    }
  };

  const handleDeleteSharedTask = async (taskId) => {
    if (!selectedList?.id || !taskId) {
      return;
    }

    try {
      setError(null);
      await deleteSharedTask(selectedList.id, taskId);
    } catch (serviceError) {
      setError(serviceError?.message ?? "Impossible de supprimer la tache partagee.");
    }
  };

  const sharedListsWithStats = useMemo(() => {
    if (!selectedList?.id) {
      return sharedLists;
    }

    return sharedLists.map((list) => {
      if (list.id !== selectedList.id) {
        return list;
      }

      const totalTasks = selectedListTasks.length;
      const completedTasks = selectedListTasks.filter((task) => Boolean(task?.completed)).length;

      return {
        ...list,
        totalTasks,
        completedTasks,
      };
    });
  }, [selectedList?.id, selectedListTasks, sharedLists]);

  return (
    <AuthGuard>
      <main className="flex min-h-screen flex-1 justify-center bg-surface px-3 pb-12 pt-6 sm:px-6">
        <section className="flex w-full max-w-6xl flex-col gap-6" aria-label="Listes partagees">
          <header className="flex flex-col gap-2">
            <h1 className="font-display text-display-sm text-on-surface">Listes partagees</h1>
            <p className="text-body-md text-on-surface-variant">
              Cree et gere des listes collaboratives avec ton equipe.
            </p>
          </header>

          {error ? (
            <p
              role="alert"
              className="rounded-xl bg-danger/10 p-4 text-body-md text-danger shadow-ambient"
            >
              {error}
            </p>
          ) : null}

          {selectedList ? (
            <>
              {tasksLoading ? (
                <p
                  role="status"
                  aria-live="polite"
                  className="rounded-xl bg-surface-container-lowest p-4 text-body-md text-on-surface-variant shadow-ambient"
                >
                  Chargement des taches partagees...
                </p>
              ) : null}
              <SharedListView
                list={selectedList}
                tasks={selectedListTasks}
                currentUserId={user?.uid ?? ""}
                members={selectedList.members}
                onAddMember={handleAddMember}
                onRemoveMember={handleRemoveMember}
                onAddTask={handleAddSharedTask}
                onUpdateTask={handleUpdateSharedTask}
                onDeleteTask={handleDeleteSharedTask}
                onBack={() => setSelectedListId(null)}
              />
            </>
          ) : (
            <>
              <CreateListForm onCreateList={handleCreateList} />

              {loading ? (
                <p
                  role="status"
                  aria-live="polite"
                  className="rounded-xl bg-surface-container-lowest p-4 text-body-md text-on-surface-variant shadow-ambient"
                >
                  Chargement des listes partagees...
                </p>
              ) : null}

              {!loading && sharedListsWithStats.length === 0 ? (
                <p className="rounded-xl bg-surface-container-lowest p-6 text-body-md text-on-surface-variant shadow-ambient">
                  Aucune liste partagee pour le moment.
                </p>
              ) : null}

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {sharedListsWithStats.map((list) => (
                  <SharedListCard
                    key={list.id}
                    list={list}
                    currentUserId={user?.uid ?? ""}
                    onOpen={handleOpenList}
                    onDelete={handleDeleteList}
                  />
                ))}
              </div>
            </>
          )}
        </section>
      </main>
    </AuthGuard>
  );
}
