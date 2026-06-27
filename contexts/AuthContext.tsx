"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  type User,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import api, { setStoredJwt, clearStoredJwt } from "@/lib/axios";
import { readDbUser, clearDbUser, type DbUser } from "@/lib/cookies";

interface AuthContextType {
  user: DbUser | null;
  firebaseUser: User | null;
  loading: boolean;
  isAdmin: boolean;
  role: "READER" | "ADMIN" | null;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [dbUser, setDbUser] = useState<DbUser | null>(null);
  const [loading, setLoading] = useState(true);
  const initializedRef = useRef(false);

  useEffect(() => {
    const cached = readDbUser()
    if (cached) setDbUser(cached)

    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      setFirebaseUser(fbUser)

      if (!initializedRef.current) {
        initializedRef.current = true
        if (!fbUser && !readDbUser()) {
          setDbUser(null)
          clearStoredJwt()
        }
        setLoading(false)
        return
      }

      if (!fbUser) {
        setDbUser(null)
        clearDbUser()
        clearStoredJwt()
      }
    })
    return unsubscribe
  }, [])

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const firebaseUser = result.user;
    if (!firebaseUser) return;

    const idToken = await firebaseUser.getIdToken()

    const { data: synced } = await api.post<DbUser>("/api/auth/sync", {
      firebaseUid: firebaseUser.uid,
      email: firebaseUser.email,
      name: firebaseUser.displayName,
      avatarUrl: firebaseUser.photoURL,
    })
    setDbUser(synced)

    const { data: loginData } = await api.post<{ jwt: string; user: DbUser }>("/api/auth/login", { idToken })
    setStoredJwt(loginData.jwt)
  };

  const logout = async () => {
    await signOut(auth);
    setDbUser(null)
    clearDbUser()
    clearStoredJwt()
    try { await api.post("/api/auth/logout") } catch { /* ignore */ }
  };

  return (
    <AuthContext.Provider
      value={{
        user: dbUser,
        firebaseUser,
        loading,
        role: dbUser?.role ?? null,
        isAdmin: dbUser?.role === "ADMIN",
        signInWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
