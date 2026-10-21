"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useOrderStore } from "@/lib/store/orderStore";
import Stepper from "@/components/Stepper";
import { formatLKR } from "@/lib/utils";

import { useIsMounted } from "@/lib/useIsMounted";

// Done stages count mapping matching prototype: DONE=[2, 3, 4, 4, 5]
const DONE_STAGES = [2, 3, 4, 4, 5];

function TrackerContent() {
  const params = useParams();
  const router = useRouter();
  const rawOrderId = (params?.orderId as string) || "";
  const mounted = useIsMounted();

  const { getOrderById } = useOrderStore();
  const [searchCode, setSearchCode] = useState(rawOrderId);

  if (!mounted) {
    return (
      <div>
        <h2>Track your order</h2>
        <p className="sub">Locating order status...</p>
      </div>
    );
  }

  const order = getOrderById(rawOrderId);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCode.trim()) {
      router.push(`/track/${searchCode.trim()}`);
    }
  };

  const doneCount = order ? (DONE_STAGES[order.col] ?? 2) : 0;

  return (
    <div>
      <h2>Track your order</h2>
      <p className="sub">
        {order
          ? `Order #${order.code} · ${order.name}`
          : "Enter your order ID or place an order to see progress."}
      </p>

      {/* Lookup Bar */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-6 max-w-md">
        <input
          type="text"
          placeholder="Look up order (e.g. CV-1024)"
          value={searchCode}
          onChange={(e) => setSearchCode(e.target.value)}
          className="search mb-0"
          aria-label="Order ID lookup"
        />
        <button type="submit" className="btn whitespace-nowrap">
          Track
        </button>
      </form>

      {order ? (
        <div className="panel" id="tbody">
          <div className="line total mb-2">
            <span>Order #{order.code}</span>
            <span className="text-base text-[var(--ok)] font-medium">
              {order.col === 4 ? "On its way" : "Estimated dispatch in 3 days"}
            </span>
          </div>

          <p className="text-sm text-[var(--mut)] mb-4">
            Recipient: <b>{order.customerName}</b> · Delivering to: {order.deliveryAddress}
          </p>

          <Stepper currentStageIndex={doneCount} />

          <div className="mt-8 pt-4 border-t border-[var(--line)] flex justify-between items-center flex-wrap gap-3">
            <div>
              <span className="text-xs text-[var(--mut)] uppercase tracking-wider block">
                Total paid
              </span>
              <span className="font-bold text-[var(--ink)]">
                {formatLKR(order.total)} ({order.paymentMethod})
              </span>
            </div>

            <Link href="/artisan" className="btn ghost text-sm">
              See the artisan’s view
            </Link>
          </div>
        </div>
      ) : (
        <div className="panel empty">
          <p className="mb-4">
            No order found matching &quot;{rawOrderId}&quot;.<br />
            Try tracking CV-1024, CV-1025, CV-1026, or place a new customized piece.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button
              type="button"
              onClick={() => router.push("/track/CV-1024")}
              className="btn ghost text-sm"
            >
              Demo: Track CV-1024
            </button>
            <Link href="/" className="btn gold text-sm">
              Start shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrderTrackPage() {
  return (
    <Suspense fallback={<div className="panel empty">Loading order details...</div>}>
      <TrackerContent />
    </Suspense>
  );
}
