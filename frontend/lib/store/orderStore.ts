import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Order, OrderStage, Dispute, ArtisanApplication } from "../types";
import { INITIAL_ORDERS, INITIAL_DISPUTES, INITIAL_APPLICATIONS } from "../data";

interface OrderState {
  orders: Order[];
  disputes: Dispute[];
  applications: ArtisanApplication[];
  latestPlacedOrderId: number | null;
  placeOrder: (orderData: {
    name: string;
    items: Order["items"];
    subtotal: number;
    packagingFee: number;
    deliveryFee: number;
    total: number;
    deliveryAddress: string;
    customerName: string;
    customerEmail: string;
    giftWrap: boolean;
    giftMessage?: string;
    paymentMethod: Order["paymentMethod"];
  }) => Order;
  advanceOrder: (orderId: number) => { success: boolean; dispatched: boolean; order?: Order };
  getOrderById: (orderId: number | string) => Order | undefined;
  getUserOrders: (email?: string) => Order[];
  resolveDispute: (id: string) => void;
  reviewApplication: (id: string, status: "APPROVED" | "REJECTED") => void;
}

let nextOrderId = 1030;

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: INITIAL_ORDERS,
      disputes: INITIAL_DISPUTES,
      applications: INITIAL_APPLICATIONS,
      latestPlacedOrderId: 1024,

      placeOrder: (orderData) => {
        const id = nextOrderId++;
        const newOrder: Order = {
          ...orderData,
          id,
          code: `CV-${id}`,
          col: 0,
          stage: "CONFIRMED",
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          orders: [newOrder, ...state.orders],
          latestPlacedOrderId: id,
        }));

        return newOrder;
      },

      advanceOrder: (orderId) => {
        const { orders } = get();
        const target = orders.find((o) => o.id === orderId);
        if (!target) return { success: false, dispatched: false };

        const nextCol = target.col + 1;
        let nextStage: OrderStage = target.stage;

        if (nextCol === 1) nextStage = "IN_CRAFTING";
        else if (nextCol === 2) nextStage = "QUALITY_CHECK";
        else if (nextCol >= 3) nextStage = "DISPATCHED";

        const isDispatched = nextCol > 3;

        const updatedOrders = orders.map((o) =>
          o.id === orderId
            ? { ...o, col: Math.min(nextCol, 4), stage: nextStage }
            : o
        );

        set({ orders: updatedOrders });
        return {
          success: true,
          dispatched: isDispatched,
          order: updatedOrders.find((o) => o.id === orderId),
        };
      },

      getOrderById: (orderId) => {
        const idNum = typeof orderId === "string" ? parseInt(orderId.replace(/[^0-9]/g, ""), 10) : orderId;
        return get().orders.find((o) => o.id === idNum || o.code.toLowerCase() === String(orderId).toLowerCase());
      },

      getUserOrders: (email) => {
        const orders = get().orders;
        if (!email) return orders;
        return orders.filter(
          (o) => o.customerEmail.toLowerCase() === email.toLowerCase()
        );
      },

      resolveDispute: (id) => {
        set((state) => ({
          disputes: state.disputes.map((d) =>
            d.id === id ? { ...d, status: "RESOLVED" } : d
          ),
        }));
      },

      reviewApplication: (id, status) => {
        set((state) => ({
          applications: state.applications.map((a) =>
            a.id === id ? { ...a, status } : a
          ),
        }));
      },
    }),
    {
      name: "craftvilla-orders",
    }
  )
);
