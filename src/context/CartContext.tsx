import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { CartItem } from "../types";

const STORAGE_KEY = "wfu_cart_v1";

interface CartContextValue {
  items: CartItem[];
  // Adding never pops the drawer open on its own — the customer stays put
  // wherever they were (the pricing page, the booking modal) and sees the
  // item land via that surface's own feedback (the pricing card's "+1"
  // stepper, or the booking modal's itemized list). The cart FAB / "View
  // Cart" affordance is what opens the drawer.
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  // Patches one item's fields in place — used by the booking form to fill in
  // per-vehicle details (address, locality, dates, etc.) after the item's
  // already in the cart, without disturbing its id or plan/add-on selection.
  updateItem: (id: string, patch: Partial<Omit<CartItem, "id">>) => void;
  clear: () => void;
  total: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

function loadStoredItems(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    // Private browsing / storage disabled / corrupted data — start empty.
    return [];
  }
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<CartItem[]>(loadStoredItems);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore quota / privacy-mode errors — cart still works for this visit.
    }
  }, [items]);

  const addItem = useCallback((item: Omit<CartItem, "id">) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setItems((prev) => [...prev, { ...item, id }]);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateItem = useCallback(
    (id: string, patch: Partial<Omit<CartItem, "id">>) => {
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, ...patch } : i)),
      );
    },
    [],
  );

  const clear = useCallback(() => setItems([]), []);

  const total = items.reduce((sum, i) => sum + i.totalPrice, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateItem,
        clear,
        total,
        isOpen,
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
