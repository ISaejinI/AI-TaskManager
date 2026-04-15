import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "../lib/firebase";

function getUserTasksCollection(userId) {
  return collection(db, "users", userId, "tasks");
}

export async function getUserTasks(userId) {
  if (!userId) {
    throw new Error("Impossible de recuperer les taches: userId manquant.");
  }

  try {
    const tasksQuery = query(getUserTasksCollection(userId), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(tasksQuery);

    return snapshot.docs.map((taskDoc) => {
      const data = taskDoc.data();

      return {
        id: taskDoc.id,
        title: data.title ?? "",
        completed: Boolean(data.completed),
        priority: data.priority ?? "medium",
        createdAt: data.createdAt ?? null,
      };
    });
  } catch (error) {
    throw new Error(
      `Erreur lors de la recuperation des taches utilisateur: ${error?.message ?? "inconnue"}.`
    );
  }
}

export async function addTask(userId, task = {}) {
  if (!userId) {
    throw new Error("Impossible d'ajouter la tache: userId manquant.");
  }

  try {
    const title = typeof task.title === "string" ? task.title.trim() : "";

    if (!title) {
      throw new Error("Le titre de la tache est requis.");
    }

    await addDoc(getUserTasksCollection(userId), {
      title,
      completed: false,
      priority: task.priority ?? "medium",
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    throw new Error(`Erreur lors de l'ajout de la tache: ${error?.message ?? "inconnue"}.`);
  }
}

export async function updateTask(userId, taskId, updates = {}) {
  if (!userId) {
    throw new Error("Impossible de mettre a jour la tache: userId manquant.");
  }

  if (!taskId) {
    throw new Error("Impossible de mettre a jour la tache: taskId manquant.");
  }

  try {
    const taskRef = doc(db, "users", userId, "tasks", taskId);
    await updateDoc(taskRef, updates);
  } catch (error) {
    throw new Error(
      `Erreur lors de la mise a jour de la tache: ${error?.message ?? "inconnue"}.`
    );
  }
}

export async function deleteTask(userId, taskId) {
  if (!userId) {
    throw new Error("Impossible de supprimer la tache: userId manquant.");
  }

  if (!taskId) {
    throw new Error("Impossible de supprimer la tache: taskId manquant.");
  }

  try {
    const taskRef = doc(db, "users", userId, "tasks", taskId);
    await deleteDoc(taskRef);
  } catch (error) {
    throw new Error(
      `Erreur lors de la suppression de la tache: ${error?.message ?? "inconnue"}.`
    );
  }
}

export function subscribeToTasks(userId, callback, onError) {
  if (!userId) {
    throw new Error("Impossible d'ecouter les taches: userId manquant.");
  }

  if (typeof callback !== "function") {
    throw new Error("Impossible d'ecouter les taches: callback invalide.");
  }

  try {
    const tasksQuery = query(getUserTasksCollection(userId), orderBy("createdAt", "desc"));

    return onSnapshot(
      tasksQuery,
      (snapshot) => {
        const tasks = snapshot.docs.map((taskDoc) => {
          const data = taskDoc.data();

          return {
            id: taskDoc.id,
            title: data.title ?? "",
            completed: Boolean(data.completed),
            priority: data.priority ?? "medium",
            createdAt: data.createdAt ?? null,
          };
        });

        callback(tasks);
      },
      (error) => {
        if (typeof onError === "function") {
          onError(
            `Erreur lors de l'ecoute des taches en temps reel: ${error?.message ?? "inconnue"}.`
          );
        }
      }
    );
  } catch (error) {
    throw new Error(
      `Erreur lors de l'initialisation de l'ecoute des taches: ${error?.message ?? "inconnue"}.`
    );
  }
}
