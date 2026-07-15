import { createContext, useCallback, useContext, useEffect, useReducer, type ReactNode } from "react";
import { shopifyFetch, isShopifyConfigured } from "../lib/shopify/client";
import {
  CART_CREATE_MUTATION,
  CART_LINES_ADD_MUTATION,
  CART_LINES_UPDATE_MUTATION,
  CART_LINES_REMOVE_MUTATION,
  CART_BY_ID_QUERY,
} from "../lib/shopify/queries/cart";
import type { Cart, CartLine, MoneyV2, UserError } from "../types/shopify";

const STORAGE_KEY = "shopify_cart_id";

interface CartState {
  cartId: string | null;
  lines: CartLine[];
  checkoutUrl: string | null;
  subtotal: MoneyV2 | null;
  totalQuantity: number;
  status: "idle" | "loading" | "error";
  error: string | null;
  isOpen: boolean;
}

const initialState: CartState = {
  cartId: null,
  lines: [],
  checkoutUrl: null,
  subtotal: null,
  totalQuantity: 0,
  status: "idle",
  error: null,
  isOpen: false,
};

function normalizeCart(cart: Cart) {
  return {
    cartId: cart.id,
    lines: cart.lines.nodes,
    checkoutUrl: cart.checkoutUrl,
    subtotal: cart.cost.subtotalAmount,
    totalQuantity: cart.totalQuantity,
    status: "idle" as const,
    error: null,
  };
}

type CartAction =
  | { type: "CART_LOADING" }
  | { type: "CART_LOADED"; cart: Cart }
  | { type: "CART_EMPTY" }
  | { type: "CART_ERROR"; error: string }
  | { type: "CART_OPEN" }
  | { type: "CART_CLOSE" };

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "CART_LOADING":
      return { ...state, status: "loading", error: null };
    case "CART_LOADED":
      return { ...state, ...normalizeCart(action.cart) };
    case "CART_EMPTY": // no cart yet, or the stored id no longer resolves to one
      return { ...state, cartId: null, lines: [], totalQuantity: 0, status: "idle", error: null };
    case "CART_ERROR":
      return { ...state, status: "error", error: action.error };
    case "CART_OPEN":
      return { ...state, isOpen: true };
    case "CART_CLOSE":
      return { ...state, isOpen: false };
    default:
      return state;
  }
}

interface CartContextValue extends CartState {
  addToCart: (merchandiseId: string, quantity?: number) => Promise<void>;
  updateLineQuantity: (lineId: string, quantity: number) => Promise<void>;
  removeLine: (lineId: string) => Promise<void>;
  openCart: () => void;
  closeCart: () => void;
  goToCheckout: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Rehydrate from a previous session on first mount.
  useEffect(() => {
    if (!isShopifyConfigured) return;
    const storedId = localStorage.getItem(STORAGE_KEY);
    if (!storedId) return;

    (async () => {
      try {
        const data = await shopifyFetch<{ cart: Cart | null }>(CART_BY_ID_QUERY, { cartId: storedId });
        if (data.cart) {
          dispatch({ type: "CART_LOADED", cart: data.cart });
        } else {
          // Cart expired or already converted to an order.
          localStorage.removeItem(STORAGE_KEY);
          dispatch({ type: "CART_EMPTY" });
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
        dispatch({ type: "CART_EMPTY" });
      }
    })();
  }, []);

  const addToCart = useCallback(
    async (merchandiseId: string, quantity: number = 1) => {
      dispatch({ type: "CART_LOADING" });
      try {
        const lines = [{ merchandiseId, quantity }];
        const data = state.cartId
          ? await shopifyFetch<{ cartLinesAdd: { cart: Cart; userErrors: UserError[] } }>(
              CART_LINES_ADD_MUTATION,
              { cartId: state.cartId, lines }
            )
          : await shopifyFetch<{ cartCreate: { cart: Cart; userErrors: UserError[] } }>(CART_CREATE_MUTATION, {
              lines,
            });
        const result = state.cartId
          ? (data as { cartLinesAdd: { cart: Cart; userErrors: UserError[] } }).cartLinesAdd
          : (data as { cartCreate: { cart: Cart; userErrors: UserError[] } }).cartCreate;
        if (result.userErrors?.length) throw new Error(result.userErrors.map((e) => e.message).join("; "));
        if (!state.cartId) localStorage.setItem(STORAGE_KEY, result.cart.id);
        dispatch({ type: "CART_LOADED", cart: result.cart });
        dispatch({ type: "CART_OPEN" });
      } catch (err) {
        dispatch({ type: "CART_ERROR", error: (err as Error).message || String(err) });
      }
    },
    [state.cartId]
  );

  const updateLineQuantity = useCallback(
    async (lineId: string, quantity: number) => {
      if (!state.cartId) return;
      dispatch({ type: "CART_LOADING" });
      try {
        // Shopify's cartLinesUpdate doesn't accept quantity: 0 for removal.
        const result =
          quantity > 0
            ? (
                await shopifyFetch<{ cartLinesUpdate: { cart: Cart; userErrors: UserError[] } }>(
                  CART_LINES_UPDATE_MUTATION,
                  { cartId: state.cartId, lines: [{ id: lineId, quantity }] }
                )
              ).cartLinesUpdate
            : (
                await shopifyFetch<{ cartLinesRemove: { cart: Cart; userErrors: UserError[] } }>(
                  CART_LINES_REMOVE_MUTATION,
                  { cartId: state.cartId, lineIds: [lineId] }
                )
              ).cartLinesRemove;
        if (result.userErrors?.length) throw new Error(result.userErrors.map((e) => e.message).join("; "));
        dispatch({ type: "CART_LOADED", cart: result.cart });
      } catch (err) {
        dispatch({ type: "CART_ERROR", error: (err as Error).message || String(err) });
      }
    },
    [state.cartId]
  );

  const removeLine = useCallback((lineId: string) => updateLineQuantity(lineId, 0), [updateLineQuantity]);

  const openCart = useCallback(() => dispatch({ type: "CART_OPEN" }), []);
  const closeCart = useCallback(() => dispatch({ type: "CART_CLOSE" }), []);

  // A real cross-origin browser navigation (not the SPA router), since
  // checkoutUrl points at Shopify's own hosted checkout domain.
  const goToCheckout = useCallback(() => {
    if (state.checkoutUrl) window.location.href = state.checkoutUrl;
  }, [state.checkoutUrl]);

  const value: CartContextValue = {
    ...state,
    addToCart,
    updateLineQuantity,
    removeLine,
    openCart,
    closeCart,
    goToCheckout,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
