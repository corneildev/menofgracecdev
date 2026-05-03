<<<<<<< HEAD
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
=======
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
<<<<<<< HEAD
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
=======
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ error: string | null }>;
  signUp: (
    email: string,
    password: string,
    fullName: string,
  ) => Promise<{ error: string | null }>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  updatePassword: (password: string) => Promise<{ error: string | null }>;
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
<<<<<<< HEAD
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
=======
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (newSession?.user) {
        setTimeout(() => {
          void checkAdmin(newSession.user.id);
        }, 0);
      } else {
        setIsAdmin(false);
      }
    });

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) void checkAdmin(s.user.id);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdmin = async (userId: string) => {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();
    setIsAdmin(!!data);
  };

  const signIn = async (email: string, password: string) => {
<<<<<<< HEAD
    const { error } = await supabase.auth.signInWithPassword({ email, password });
=======
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
    return { error: error?.message ?? null };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
<<<<<<< HEAD
    const redirectUrl = typeof window !== "undefined" ? `${window.location.origin}/` : undefined;
=======
    const redirectUrl =
      typeof window !== "undefined" ? `${window.location.origin}/` : undefined;
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: redirectUrl,
      },
    });
    return { error: error?.message ?? null };
  };

<<<<<<< HEAD
=======
  const resetPassword = async (email: string) => {
    const redirectUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/update-password`
        : undefined;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });
    return { error: error?.message ?? null };
  };

  const updatePassword = async (password: string) => {
    const { error } = await supabase.auth.updateUser({ password });
    return { error: error?.message ?? null };
  };

>>>>>>> 9091cf2 (Initial commit of graceful-threads)
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = useMemo<AuthContextValue>(
<<<<<<< HEAD
    () => ({ user, session, isAdmin, loading, signIn, signUp, signOut }),
=======
    () => ({
      user,
      session,
      isAdmin,
      loading,
      signIn,
      signUp,
      resetPassword,
      updatePassword,
      signOut,
    }),
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
    [user, session, isAdmin, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
