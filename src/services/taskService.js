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

function getFirestoreErrorMessage(error) {
  const code = error?.code ?? "";

  switch (code) {
    case "permission-denied":
      return "Acces refuse. Vous n'avez pas la permission.";
    case "not-found":
      return "Cette ressource n'existe plus.";
    case "unavailable":
      return "Service temporairement indisponible. Verifiez votre connexion.";
    case "unauthenticated":
      return "Vous devez etre connecte pour effectuer cette action.";
    default:
      return "Une erreur est survenue. Veuillez reessayer.";
  }
}

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
        description: data.description ?? "",
        dueDate: data.dueDate ?? null,
        completed: Boolean(data.completed),
        priority: data.priority ?? "medium",
        createdAt: data.createdAt ?? null,
      };
    });
  } catch (error) {
    throw new Error(getFirestoreErrorMessage(error));
  }
}

export async function addTask(userId, task = {}) {
  if (!userId) {
    throw new Error("Impossible d'ajouter la tache: userId manquant.");
  }

  try {
    const title = typeof task.title === "string" ? task.title.trim() : "";
    const description = typeof task.description === "string" ? task.description.trim() : "";
    const dueDate = typeof task.dueDate === "string" ? task.dueDate : null;

    if (!title) {
      throw new Error("Le titre de la tache est requis.");
    }

    await addDoc(getUserTasksCollection(userId), {
      title,
      description,
      dueDate,
      completed: false,
      priority: task.priority ?? "medium",
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    throw new Error(getFirestoreErrorMessage(error));
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
    throw new Error(getFirestoreErrorMessage(error));
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
    throw new Error(getFirestoreErrorMessage(error));
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
            description: data.description ?? "",
            dueDate: data.dueDate ?? null,
            completed: Boolean(data.completed),
            priority: data.priority ?? "medium",
            createdAt: data.createdAt ?? null,
          };
        });

        callback(tasks);
      },
      (error) => {
        if (typeof onError === "function") {
          onError(getFirestoreErrorMessage(error));
        }
      }
    );
  } catch (error) {
    throw new Error(getFirestoreErrorMessage(error));
  }
}
