<<<<<<< HEAD
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
=======
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
>>>>>>> 9091cf2 (Initial commit of graceful-threads)

const STORAGE_KEY = "mog:wishlist";

type WishlistContextValue = {
  ids: string[];
  has: (id: string) => boolean;
  toggle: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  count: number;
  ready: boolean;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
<<<<<<< HEAD
        if (Array.isArray(parsed)) setIds(parsed.filter((x) => typeof x === "string"));
=======
        if (Array.isArray(parsed))
          setIds(parsed.filter((x) => typeof x === "string"));
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
      }
    } catch {
      // ignore
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {
      // ignore
    }
  }, [ids, ready]);

  // Cross-tab sync
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY || !e.newValue) return;
      try {
        const parsed = JSON.parse(e.newValue);
<<<<<<< HEAD
        if (Array.isArray(parsed)) setIds(parsed.filter((x) => typeof x === "string"));
=======
        if (Array.isArray(parsed))
          setIds(parsed.filter((x) => typeof x === "string"));
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
      } catch {
        // ignore
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const has = useCallback((id: string) => ids.includes(id), [ids]);
  const toggle = useCallback((id: string) => {
<<<<<<< HEAD
    setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [id, ...prev]));
=======
    setIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [id, ...prev],
    );
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
  }, []);
  const remove = useCallback((id: string) => {
    setIds((prev) => prev.filter((x) => x !== id));
  }, []);
  const clear = useCallback(() => setIds([]), []);

  const value = useMemo<WishlistContextValue>(
    () => ({ ids, has, toggle, remove, clear, count: ids.length, ready }),
    [ids, has, toggle, remove, clear, ready],
  );

<<<<<<< HEAD
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
=======
  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
