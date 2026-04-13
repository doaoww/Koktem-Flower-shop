"use client";

import { createContext, useContext, useReducer, useEffect, ReactNode } from "react";
import { Product } from "@/types";

interface WishlistState {
  items: Product[];
}

type WishlistAction =
  | { type: "TOGGLE"; product: Product }
  | { type: "HYDRATE"; items: Product[] };

function wishlistReducer(state: WishlistState, action: WishlistAction): WishlistState {
  switch (action.type) {
    case "TOGGLE": {
      const exists = state.items.find((i) => i.id === action.product.id);
      return {
        items: exists
          ? state.items.filter((i) => i.id !== action.product.id)
          : [...state.items, action.product],
      };
    }
    case "HYDRATE":
      return { items: action.items };
    default:
      return state;
  }
}

interface WishlistContextValue {
  items: Product[];
  toggle: (product: Product) => void;
  isWishlisted: (id: string) => boolean;
  count: number;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(wishlistReducer, { items: [] });

  useEffect(() => {
    try {
      const saved = localStorage.getItem("flower_wishlist");
      if (saved) dispatch({ type: "HYDRATE", items: JSON.parse(saved) });
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem("flower_wishlist", JSON.stringify(state.items));
  }, [state.items]);

  return (
    <WishlistContext.Provider value={{
      items: state.items,
      toggle: (product) => dispatch({ type: "TOGGLE", product }),
      isWishlisted: (id) => state.items.some((i) => i.id === id),
      count: state.items.length,
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}