import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

const STORAGE_KEY = "mog:cart";

export type CartItem = {
  id: string;
  productId: string;
  name: string;
  image: string;
  fcfa: number;
  usd: number;
  size: string | null;
  availableSizes?: string[];
  fit: string;
  lapel: string;
  lining: string;
  monogram?: string;
  quantity: number;
};

type AddInput = Omit<CartItem, "id" | "quantity"> & { quantity?: number };

type CartContextValue = {
  items: CartItem[];
  add: (item: AddInput) => void;
  remove: (id: string) => void;
  setQuantity: (id: string, q: number) => void;
  setSize: (id: string, size: string) => void;
  clear: () => void;
  count: number;
  totalFcfa: number;
  totalUsd: number;
  ready: boolean;
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const lineKey = (i: AddInput) =>
  `${i.productId}|${i.size ?? "-"}|${i.fit}|${i.lapel}|${i.lining}|${i.monogram ?? ""}`;

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {
      // ignore
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items, ready]);

  const add = useCallback((input: AddInput) => {
    const id = lineKey(input);
    const qty = input.quantity ?? 1;
    setItems((prev) => {
      const existing = prev.find((p) => p.id === id);
      if (existing) {
        return prev.map((p) => (p.id === id ? { ...p, quantity: p.quantity + qty } : p));
      }
      return [{ ...input, id, quantity: qty }, ...prev];
    });
    setIsOpen(true);
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const setQuantity = useCallback((id: string, q: number) => {
    setItems((prev) =>
      prev
        .map((p) => (p.id === id ? { ...p, quantity: Math.max(0, q) } : p))
        .filter((p) => p.quantity > 0),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((s, i) => s + i.quantity, 0);
    const totalFcfa = items.reduce((s, i) => s + i.fcfa * i.quantity, 0);
    const totalUsd = items.reduce((s, i) => s + i.usd * i.quantity, 0);
    return {
      items,
      add,
      remove,
      setQuantity,
      clear,
      count,
      totalFcfa,
      totalUsd,
      ready,
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
    };
  }, [items, add, remove, setQuantity, clear, ready, isOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export function formatFcfa(n: number) {
  // Stable across SSR/CSR: simple thousands grouping with regular spaces
  return `${n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} FCFA`;
}
export function formatUsd(n: number) {
  return `$${n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}
