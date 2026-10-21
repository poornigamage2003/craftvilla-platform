"use client";

import { useOrderStore } from "@/lib/store/orderStore";
import { useToastStore } from "@/lib/store/toastStore";
import { KANBAN_COLUMNS } from "@/lib/data";

interface KanbanBoardProps {
  artisanFilter?: string;
}

export default function KanbanBoard({ artisanFilter }: KanbanBoardProps) {
  const { orders, advanceOrder } = useOrderStore();
  const { showToast } = useToastStore();

  const handleAdvance = (orderId: number) => {
    const res = advanceOrder(orderId);
    if (res.success) {
      if (res.dispatched) {
        showToast("Dispatched. Customer notified.");
      } else {
        showToast("Moved. Customer notified.");
      }
    }
  };

  // Filter orders by artisan if specified, otherwise show all
  const filteredOrders = artisanFilter
    ? orders.filter((o) =>
        o.items.some((item) => item.name.toLowerCase().includes(artisanFilter.toLowerCase()))
      )
    : orders;

  return (
    <div className="board" role="region" aria-label="Artisan production board">
      {KANBAN_COLUMNS.map((colName, colIndex) => {
        const columnOrders = filteredOrders.filter(
          (o) => o.col === colIndex
        );

        return (
          <div key={colName} className="col">
            <h3>
              <span>{colName}</span>
              <small className="bg-[var(--surface)] text-[var(--ink)] px-2 py-0.5 rounded-full text-xs font-bold border border-[var(--line)]">
                {columnOrders.length}
              </small>
            </h3>

            <div className="flex flex-col gap-2 mt-2">
              {columnOrders.length > 0 ? (
                columnOrders.map((order) => (
                  <div key={order.id} className="tk">
                    <b className="text-[var(--ink)]">#{order.code}</b>
                    <span className="text-[var(--ink)] block text-sm font-medium">
                      {order.name}
                    </span>
                    <small className="text-[var(--mut)] block mt-0.5">
                      Deadline: in {Math.max(5 - colIndex, 1)} days
                    </small>
                    <button
                      type="button"
                      onClick={() => handleAdvance(order.id)}
                      className="btn text-xs py-1.5 px-3 mt-2 w-full"
                      aria-label={`Advance order ${order.code}`}
                    >
                      {colIndex < 3
                        ? `Move to ${KANBAN_COLUMNS[colIndex + 1]}`
                        : "Mark dispatched"}
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-xs text-[var(--mut)]">
                  Nothing here
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
