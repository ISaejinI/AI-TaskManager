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
import { auth } from "../lib/firebase";

const AuthContext = createContext(null);

const AUTH_ERROR_MESSAGES = {
  "auth/email-already-in-use": "Cette adresse e-mail est deja utilisee.",
  "auth/invalid-email": "L'adresse e-mail n'est pas valide.",
  "auth/weak-password": "Le mot de passe doit contenir au moins 6 caracteres.",
  "auth/user-not-found": "Aucun compte trouve avec cette adresse e-mail.",
  "auth/wrong-password": "Mot de passe incorrect.",
  "auth/too-many-requests": "Trop de tentatives. Reessayez plus tard.",
  "auth/invalid-credential":
    "Identifiants invalides. Verifiez votre e-mail et mot de passe.",
};

function getFirebaseErrorMessage(firebaseError) {
  return (
    AUTH_ERROR_MESSAGES[firebaseError?.code] ??
    "Une erreur est survenue. Veuillez reessayer."
  );
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (nextUser) => {
        setUser(nextUser);
        setLoading(false);
        setError(null);
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
      return await createUserWithEmailAndPassword(auth, email, password);
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
