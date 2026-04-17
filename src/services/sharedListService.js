import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
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
      if (!code && typeof error?.message === "string" && error.message.trim()) {
        return error.message;
      }

      return "Une erreur est survenue. Veuillez reessayer.";
  }
}

function getSharedListsCollection() {
  return collection(db, "sharedLists");
}

function getSharedListTasksCollection(listId) {
  return collection(db, "sharedLists", listId, "tasks");
}

function mapSharedList(listDoc) {
  const data = listDoc.data();

  return {
    id: listDoc.id,
    name: data.name ?? "",
    ownerId: data.ownerId ?? "",
    members: Array.isArray(data.members) ? data.members : [],
    createdAt: data.createdAt ?? null,
  };
}

function mapSharedTask(taskDoc) {
  const data = taskDoc.data();

  return {
    id: taskDoc.id,
    title: data.title ?? "",
    description: data.description ?? "",
    dueDate: data.dueDate ?? null,
    completed: Boolean(data.completed),
    priority: data.priority ?? "medium",
    createdAt: data.createdAt ?? null,
    addedBy: data.addedBy ?? null,
  };
}

function getDateSortValue(value) {
  if (!value) {
    return 0;
  }

  if (typeof value?.toMillis === "function") {
    return value.toMillis();
  }

  if (typeof value?.seconds === "number") {
    return value.seconds * 1000;
  }

  const parsedDate = new Date(value).getTime();
  return Number.isNaN(parsedDate) ? 0 : parsedDate;
}

function sortByCreatedAtDesc(items) {
  return [...items].sort((a, b) => getDateSortValue(b.createdAt) - getDateSortValue(a.createdAt));
}

export async function createSharedList(userId, name) {
  if (!userId) {
    throw new Error("Impossible de creer la liste partagee: userId manquant.");
  }

  try {
    const normalizedName = typeof name === "string" ? name.trim() : "";

    if (!normalizedName) {
      throw new Error("Le nom de la liste partagee est requis.");
    }

    await addDoc(getSharedListsCollection(), {
      name: normalizedName,
      ownerId: userId,
      members: [userId],
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    throw new Error(getFirestoreErrorMessage(error));
  }
}

export async function getUserSharedLists(userId) {
  if (!userId) {
    throw new Error("Impossible de recuperer les listes partagees: userId manquant.");
  }

  try {
    const listsQuery = query(getSharedListsCollection(), where("members", "array-contains", userId));
    const snapshot = await getDocs(listsQuery);
    return sortByCreatedAtDesc(snapshot.docs.map(mapSharedList));
  } catch (error) {
    throw new Error(getFirestoreErrorMessage(error));
  }
}

export function subscribeToSharedLists(userId, callback, onError) {
  if (!userId) {
    throw new Error("Impossible d'ecouter les listes partagees: userId manquant.");
  }

  if (typeof callback !== "function") {
    throw new Error("Impossible d'ecouter les listes partagees: callback invalide.");
  }

  try {
    const listsQuery = query(getSharedListsCollection(), where("members", "array-contains", userId));

    return onSnapshot(
      listsQuery,
      (snapshot) => {
        callback(sortByCreatedAtDesc(snapshot.docs.map(mapSharedList)));
      },
      (error) => {
        if (typeof onError === "function") {
          onError(getFirestoreErrorMessage(error), error?.code ?? "");
        }
      }
    );
  } catch (error) {
    throw new Error(getFirestoreErrorMessage(error));
  }
}

export async function addMemberToList(listId, email) {
  if (!listId) {
    throw new Error("Impossible d'ajouter un membre: listId manquant.");
  }

  try {
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

    if (!normalizedEmail) {
      throw new Error("Impossible d'ajouter un membre: email manquant.");
    }

    const usersByLowercaseQuery = query(
      collection(db, "users"),
      where("emailLowercase", "==", normalizedEmail),
      limit(1)
    );
    const usersByLowercaseSnapshot = await getDocs(usersByLowercaseQuery);

    let memberUserId = null;

    if (!usersByLowercaseSnapshot.empty) {
      memberUserId = usersByLowercaseSnapshot.docs[0].id;
    } else {
      const usersByEmailQuery = query(
        collection(db, "users"),
        where("email", "==", normalizedEmail),
        limit(1)
      );
      const usersByEmailSnapshot = await getDocs(usersByEmailQuery);

      if (!usersByEmailSnapshot.empty) {
        memberUserId = usersByEmailSnapshot.docs[0].id;
      }
    }

    if (!memberUserId) {
      throw new Error("Aucun utilisateur trouve avec cet email.");
    }

    const listRef = doc(db, "sharedLists", listId);

    await updateDoc(listRef, {
      members: arrayUnion(memberUserId),
    });
  } catch (error) {
    throw new Error(getFirestoreErrorMessage(error));
  }
}

export async function removeMemberFromList(listId, userId, requesterUserId = userId) {
  if (!listId) {
    throw new Error("Impossible de retirer un membre: listId manquant.");
  }

  if (!userId) {
    throw new Error("Impossible de retirer un membre: userId manquant.");
  }

  try {
    const listRef = doc(db, "sharedLists", listId);
    const listSnapshot = await getDoc(listRef);

    if (!listSnapshot.exists()) {
      throw new Error("Liste partagee introuvable.");
    }

    const listData = listSnapshot.data();

    if (listData.ownerId !== requesterUserId) {
      throw new Error("Seul le proprietaire peut retirer un membre.");
    }

    await updateDoc(listRef, {
      members: arrayRemove(userId),
    });
  } catch (error) {
    throw new Error(getFirestoreErrorMessage(error));
  }
}

export async function deleteSharedList(listId, userId) {
  if (!listId) {
    throw new Error("Impossible de supprimer la liste partagee: listId manquant.");
  }

  if (!userId) {
    throw new Error("Impossible de supprimer la liste partagee: userId manquant.");
  }

  try {
    const listRef = doc(db, "sharedLists", listId);
    const listSnapshot = await getDoc(listRef);

    if (!listSnapshot.exists()) {
      throw new Error("Liste partagee introuvable.");
    }

    const listData = listSnapshot.data();

    if (listData.ownerId !== userId) {
      throw new Error("Seul le proprietaire peut supprimer la liste partagee.");
    }

    const tasksSnapshot = await getDocs(getSharedListTasksCollection(listId));

    await Promise.all(tasksSnapshot.docs.map((taskDoc) => deleteDoc(taskDoc.ref)));
    await deleteDoc(listRef);
  } catch (error) {
    throw new Error(getFirestoreErrorMessage(error));
  }
}

export async function getSharedListTasks(listId) {
  if (!listId) {
    throw new Error("Impossible de recuperer les taches partagees: listId manquant.");
  }

  try {
    const tasksQuery = query(getSharedListTasksCollection(listId), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(tasksQuery);
    return snapshot.docs.map(mapSharedTask);
  } catch (error) {
    throw new Error(getFirestoreErrorMessage(error));
  }
}

export async function addSharedTask(listId, userId, task = {}) {
  if (!listId) {
    throw new Error("Impossible d'ajouter une tache partagee: listId manquant.");
  }

  if (!userId) {
    throw new Error("Impossible d'ajouter une tache partagee: userId manquant.");
  }

  try {
    const title = typeof task.title === "string" ? task.title.trim() : "";
    const description = typeof task.description === "string" ? task.description.trim() : "";
    const dueDate = typeof task.dueDate === "string" ? task.dueDate : null;

    if (!title) {
      throw new Error("Le titre de la tache partagee est requis.");
    }

    await addDoc(getSharedListTasksCollection(listId), {
      title,
      description,
      dueDate,
      completed: Boolean(task.completed),
      priority: task.priority ?? "medium",
      createdAt: serverTimestamp(),
      addedBy: userId,
    });
  } catch (error) {
    throw new Error(getFirestoreErrorMessage(error));
  }
}

export async function updateSharedTask(listId, taskId, updates = {}) {
  if (!listId) {
    throw new Error("Impossible de mettre a jour la tache partagee: listId manquant.");
  }

  if (!taskId) {
    throw new Error("Impossible de mettre a jour la tache partagee: taskId manquant.");
  }

  try {
    const taskRef = doc(db, "sharedLists", listId, "tasks", taskId);
    await updateDoc(taskRef, updates);
  } catch (error) {
    throw new Error(getFirestoreErrorMessage(error));
  }
}

export async function deleteSharedTask(listId, taskId) {
  if (!listId) {
    throw new Error("Impossible de supprimer la tache partagee: listId manquant.");
  }

  if (!taskId) {
    throw new Error("Impossible de supprimer la tache partagee: taskId manquant.");
  }

  try {
    const taskRef = doc(db, "sharedLists", listId, "tasks", taskId);
    await deleteDoc(taskRef);
  } catch (error) {
    throw new Error(getFirestoreErrorMessage(error));
  }
}

export function subscribeToSharedTasks(listId, callback, onError) {
  if (!listId) {
    throw new Error("Impossible d'ecouter les taches partagees: listId manquant.");
  }

  if (typeof callback !== "function") {
    throw new Error("Impossible d'ecouter les taches partagees: callback invalide.");
  }

  try {
    const tasksQuery = query(getSharedListTasksCollection(listId), orderBy("createdAt", "desc"));

    return onSnapshot(
      tasksQuery,
      (snapshot) => {
        callback(snapshot.docs.map(mapSharedTask));
      },
      (error) => {
        if (typeof onError === "function") {
          onError(getFirestoreErrorMessage(error), error?.code ?? "");
        }
      }
    );
  } catch (error) {
    throw new Error(getFirestoreErrorMessage(error));
  }
}
