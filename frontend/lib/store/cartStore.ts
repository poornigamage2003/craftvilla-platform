import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem } from "../types";

interface CartState {
  items: CartItem[];
  giftWrap: boolean;
  giftMessage: string;
  deliveryAddress: string;
  paymentMethod: "Card" | "Digital wallet" | "Bank slip upload";
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  setGiftWrap: (wrap: boolean) => void;
  setGiftMessage: (msg: string) => void;
  setDeliveryAddress: (addr: string) => void;
  setPaymentMethod: (method: "Card" | "Digital wallet" | "Bank slip upload") => void;
  getSubtotal: () => number;
  getTotalCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      giftWrap: false,
      giftMessage: "",
      deliveryAddress: "",
      paymentMethod: "Card",
      addItem: (item) => {
        set((state) => {
          // Check if identical item already exists (same product, text, font, finish)
          const existingIndex = state.items.findIndex(
            (i) =>
              i.productId === item.productId &&
              i.text === item.text &&
              i.font === item.font &&
              i.finish === item.finish &&
              !i.isHamper
          );
          if (existingIndex > -1) {
            const updated = [...state.items];
            const existing = updated[existingIndex];
            const newQty = existing.qty + item.qty;
            const unitPrice = existing.price / existing.qty;
            updated[existingIndex] = {
              ...existing,
              qty: newQty,
              price: unitPrice * newQty,
            };
            return { items: updated };
          }
          return { items: [...state.items, item] };
        });
      },
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },
      updateQty: (id, qty) => {
        set((state) => ({
          items: state.items.map((item) => {
            if (item.id === id) {
              const unitPrice = item.price / item.qty;
              return {
                ...item,
                qty,
                price: unitPrice * qty,
              };
            }
            return item;
          }),
        }));
      },
      clearCart: () => set({ items: [], giftWrap: false, giftMessage: "" }),
      setGiftWrap: (wrap) => set({ giftWrap: wrap }),
      setGiftMessage: (msg) => set({ giftMessage: msg }),
      setDeliveryAddress: (addr) => set({ deliveryAddress: addr }),
      setPaymentMethod: (method) => set({ paymentMethod: method }),
      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.price, 0);
      },
      getTotalCount: () => {
        return get().items.reduce((sum, item) => sum + item.qty, 0);
      },
    }),
    {
      name: "craftvilla-cart",
    }
  )
);
