"use client";

import React from "react";
import KanbanBoard from "@/components/KanbanBoard";
import { useOrderStore } from "@/lib/store/orderStore";
import { useAuthStore } from "@/lib/store/authStore";

export default function ArtisanDashboardPage() {
  const { orders } = useOrderStore();
  const { user } = useAuthStore();

  const activeOrders = orders.filter((o) => o.col < 4);
  const dispatchedOrders = orders.filter((o) => o.col >= 4);

  return (
    <div>
      <div className="flex justify-between items-start flex-wrap gap-3 mb-2">
        <div>
          <h2>Artisan production board</h2>
          <p className="sub">
            Move each ticket forward. Customers see the change straight away.
          </p>
        </div>

        {user && (
          <div className="text-right">
            <span className="text-xs text-[var(--mut)] uppercase tracking-wider block">
              Workshop
            </span>
            <span className="font-bold text-[var(--ink)]">
              {user.name}
            </span>
          </div>
        )}
      </div>

      {/* Production Quick Stats */}
      <div className="stats mb-6">
        <div className="panel stat">
          <b>{activeOrders.length}</b>
          Active in workshop
        </div>
        <div className="panel stat">
          <b>{orders.filter((o) => o.col === 0).length}</b>
          Awaiting carving
        </div>
        <div className="panel stat">
          <b>{orders.filter((o) => o.col === 2).length}</b>
          Quality inspection
        </div>
        <div className="panel stat">
          <b>{dispatchedOrders.length}</b>
          Dispatched this cycle
        </div>
      </div>

      {/* 4-Column Kanban Board */}
      <KanbanBoard />
    </div>
  );
}
