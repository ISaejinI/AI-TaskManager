"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

const AuthContext = createContext(null);

const AUTH_ERROR_MESSAGES = {
  "auth/email-already-in-use": "Cette adresse e-mail est deja utilisee.",
  "auth/invalid-email": "L'adresse e-mail n'est pas valide.",
  "auth/weak-password": "Le mot de passe doit contenir au moins 6 caracteres.",
  "auth/user-not-found": "Aucun compte trouve avec cette adresse e-mail.",
  "auth/wrong-password": "Mot de passe incorrect.",
  "auth/too-many-requests": "Trop de tentatives. Reessayez plus tard.",
  "auth/invalid-credential": "Identifiants invalides. Verifiez votre e-mail et mot de passe.",
};

function getFirebaseErrorMessage(firebaseError) {
  return (
    AUTH_ERROR_MESSAGES[firebaseError?.code] ??
    "Une erreur est survenue. Veuillez reessayer."
  );
}

async function syncUserProfile(nextUser) {
  if (!nextUser?.uid) {
    return;
  }

  const normalizedEmail = String(nextUser.email ?? "").trim().toLowerCase();

  await setDoc(
    doc(db, "users", nextUser.uid),
    {
      uid: nextUser.uid,
      email: normalizedEmail,
      emailLowercase: normalizedEmail,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

async function syncCreatedUserProfile(nextUser, fallbackEmail = "") {
  if (!nextUser?.uid) {
    return;
  }

  const normalizedEmail = String(nextUser.email ?? fallbackEmail ?? "").trim().toLowerCase();

  await setDoc(
    doc(db, "users", nextUser.uid),
    {
      uid: nextUser.uid,
      email: normalizedEmail,
      emailLowercase: normalizedEmail,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (nextUser) => {
        try {
          await syncUserProfile(nextUser);
          setUser(nextUser);
          setError(null);
        } catch (syncError) {
          setUser(nextUser);
          setError(syncError?.message ?? "Impossible de synchroniser le profil utilisateur.");
        } finally {
          setLoading(false);
        }
      },
      (firebaseError) => {
        setUser(null);
        setLoading(false);
        setError(getFirebaseErrorMessage(firebaseError));
      }
    );

    return unsubscribe;
  }, []);

  const signUp = async (email, password) => {
    try {
      setError(null);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const createdUser = userCredential?.user;

      // Cree immediatement le document Firestore a l'inscription.
      await syncCreatedUserProfile(createdUser, email);

      return userCredential;
    } catch (firebaseError) {
      const readableError = getFirebaseErrorMessage(firebaseError);
      setError(readableError);
      throw new Error(readableError);
    }
  };

  const signIn = async (email, password) => {
    try {
      setError(null);
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (firebaseError) {
      const readableError = getFirebaseErrorMessage(firebaseError);
      setError(readableError);
      throw new Error(readableError);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setError(null);
      const provider = new GoogleAuthProvider();
      return await signInWithPopup(auth, provider);
    } catch (firebaseError) {
      const readableError = getFirebaseErrorMessage(firebaseError);
      setError(readableError);
      throw new Error(readableError);
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      await firebaseSignOut(auth);
    } catch (firebaseError) {
      const readableError = getFirebaseErrorMessage(firebaseError);
      setError(readableError);
      throw new Error(readableError);
    }
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      signUp,
      signIn,
      signInWithGoogle,
      signOut,
    }),
    [user, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth doit etre utilise dans un AuthProvider.");
  }

  return context;
}

export default AuthContext;
