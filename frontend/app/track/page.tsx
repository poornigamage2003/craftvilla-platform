"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useOrderStore } from "@/lib/store/orderStore";
import { useAuthStore } from "@/lib/store/authStore";
import { formatLKR } from "@/lib/utils";
import { Search, Package, ArrowRight, Truck } from "lucide-react";

export default function TrackLookupPage() {
  const router = useRouter();
  const { orders } = useOrderStore();
  const { user } = useAuthStore();
  const [orderCode, setOrderCode] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderCode.trim()) {
      router.push(`/track/${orderCode.trim().toUpperCase()}`);
    }
  };

  const userOrders = user
    ? orders.filter(
        (o) => o.customerEmail.toLowerCase() === user.email.toLowerCase() || user.role === "CUSTOMER"
      ).slice(0, 3)
    : orders.slice(0, 3);

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-4">
      {/* Page Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--accent)] uppercase tracking-wider bg-[var(--accent)]/10 px-3 py-1 rounded-full">
          <Truck className="w-3.5 h-3.5" />
          <span>Real-time Artisan Tracking</span>
        </div>
        <h2>Track Your Bespoke Order</h2>
        <p className="sub text-sm">
          Enter your CraftVilla order reference (e.g. <b>CV-1024</b>) to view live progress from master artisan crafting to courier dispatch.
        </p>
      </div>

      {/* Lookup Form */}
      <form onSubmit={handleSearch} className="panel p-5 space-y-3">
        <label htmlFor="search-order" className="text-xs font-bold uppercase tracking-wider text-[var(--mut)] mb-0 block">
          Order Reference Code
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--mut)]" />
            <input
              id="search-order"
              type="text"
              placeholder="e.g. CV-1024, CV-1025..."
              value={orderCode}
              onChange={(e) => setOrderCode(e.target.value)}
              className="pl-10 text-sm py-2.5 font-mono"
              required
            />
          </div>
          <button type="submit" className="btn gold px-6 text-sm font-bold flex items-center gap-1.5">
            <span>Track</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Quick Demo Tracker Links */}
      <div className="panel space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[var(--line)]">
          <h3 className="text-sm font-bold text-[var(--ink)]">Recent Workshop Orders</h3>
          <span className="text-xs text-[var(--mut)]">Click any to inspect live stepper</span>
        </div>

        <div className="space-y-2.5">
          {userOrders.map((o) => (
            <div
              key={o.id}
              onClick={() => router.push(`/track/${o.code}`)}
              className="p-3 rounded-xl border border-[var(--line)] hover:border-[var(--ink)] cursor-pointer transition-colors flex items-center justify-between group bg-[var(--surface)]"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[var(--bg)] border border-[var(--line)] flex items-center justify-center text-sm font-bold text-[var(--ink)] shrink-0">
                  <Package className="w-4 h-4 text-[var(--accent)]" />
                </div>
                <div>
                  <b className="text-xs text-[var(--ink)] block group-hover:text-[var(--accent)] transition-colors">
                    #{o.code} · {o.name}
                  </b>
                  <span className="text-[11px] text-[var(--mut)]">
                    Recipient: {o.customerName} · {formatLKR(o.total)}
                  </span>
                </div>
              </div>

              <span className="text-xs font-semibold text-[var(--accent)] group-hover:translate-x-1 transition-transform">
                View Stepper →
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 5-Stage Explainer */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs text-[var(--mut)]">
        <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)]">
          <b className="text-[var(--ink)] block">1. Confirmed</b>
          <span className="text-[10px]">Proof approved</span>
        </div>
        <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)]">
          <b className="text-[var(--ink)] block">2. In Crafting</b>
          <span className="text-[10px]">Chiseling &amp; casting</span>
        </div>
        <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)]">
          <b className="text-[var(--ink)] block">3. Quality Check</b>
          <span className="text-[10px]">Finish inspection</span>
        </div>
        <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)]">
          <b className="text-[var(--ink)] block">4. Dispatched</b>
          <span className="text-[10px]">Courier in transit</span>
        </div>
      </div>
    </div>
  );
}
