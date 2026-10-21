"use client";

import React, { useState } from "react";
import KanbanBoard from "@/components/KanbanBoard";
import { useOrderStore } from "@/lib/store/orderStore";
import { useAuthStore } from "@/lib/store/authStore";
import { useToastStore } from "@/lib/store/toastStore";
import { PRODUCTS } from "@/lib/data";
import { formatLKR } from "@/lib/utils";
import { Clock, Star, DollarSign, PackageCheck, ToggleLeft, ToggleRight, Hammer, Settings } from "lucide-react";

export default function ArtisanDashboardPage() {
  const { orders } = useOrderStore();
  const { user } = useAuthStore();
  const { showToast } = useToastStore();

  const [acceptingOrders, setAcceptingOrders] = useState(true);
  const [isManagerOpen, setIsManagerOpen] = useState(false);
  const [productListings, setProductListings] = useState(PRODUCTS.slice(0, 4));
  const [newTitle, setNewTitle] = useState("");
  const [newMaterial, setNewMaterial] = useState("Wood");
  const [newPrice, setNewPrice] = useState(3800);
  const [newLeadDays, setNewLeadDays] = useState(3);

  const activeOrders = orders.filter((o) => o.col < 4);
  const totalCompleted = orders.filter((o) => o.col >= 4).length + 32;
  const pendingPayout = orders.reduce((sum, o) => sum + Math.round(o.total * 0.85), 0) + 142500;

  const handleToggleStatus = () => {
    const next = !acceptingOrders;
    setAcceptingOrders(next);
    showToast(next ? "Studio status: Accepting New Orders ✓" : "Studio status: On Break / Capacity Full");
  };

  const handleAddNewListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const newProd = {
      id: "prod-" + Date.now(),
      name: newTitle,
      material: newMaterial,
      occasion: "Anniversary",
      artisanName: user?.name || "Kandy Wood Studio",
      artisanSlug: "kandy-wood-studio",
      basePrice: newPrice,
      emoji: newMaterial === "Wood" ? "🪵" : newMaterial === "Resin" ? "🔮" : "🎨",
      bgColor: "#e7cfa8",
      description: "Custom hand-carved heritage creation made to order in our verified workshop.",
      dimensions: "Standard 30 × 20 cm",
      leadTimeDays: newLeadDays,
      customizable: true,
    };

    setProductListings([newProd, ...productListings]);
    setNewTitle("");
    showToast(`New listing "${newTitle}" created!`);
    setIsManagerOpen(false);
  };

  const handleUpdateLeadTime = (id: string, days: number) => {
    setProductListings((prev) =>
      prev.map((p) => (p.id === id ? { ...p, leadTimeDays: days } : p))
    );
    showToast("Production lead time updated");
  };

  return (
    <div className="space-y-8 py-2">
      {/* Studio Header */}
      <div className="panel p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 bg-[var(--surface)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Hammer className="w-5 h-5 text-[var(--accent)]" />
            <h2 className="text-2xl font-bold text-[var(--ink)]">
              {user ? user.name : "Kandy Wood Studio Workshop"}
            </h2>
          </div>
          <p className="text-xs text-[var(--mut)]">
            Verified Master Artisan Studio · Central Province, Sri Lanka · Since 1994
          </p>
        </div>

        {/* Studio Controls & Status Toggle */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={handleToggleStatus}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold transition-all ${
              acceptingOrders
                ? "bg-[var(--ok)]/10 text-[var(--ok)] border-[var(--ok)]"
                : "bg-amber-500/10 text-amber-600 border-amber-500"
            }`}
          >
            {acceptingOrders ? (
              <>
                <ToggleRight className="w-4 h-4" />
                <span>Accepting Orders</span>
              </>
            ) : (
              <>
                <ToggleLeft className="w-4 h-4" />
                <span>On Break (Paused)</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsManagerOpen(true)}
            className="btn ghost text-xs py-1.5 px-3 flex items-center gap-1.5"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Product &amp; Lead Times</span>
          </button>
        </div>
      </div>

      {/* Production Quick Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="panel p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[var(--mut)] mb-1">
            <span>Active Pipeline</span>
            <PackageCheck className="w-4 h-4 text-[var(--accent)]" />
          </div>
          <b className="text-2xl font-serif text-[var(--ink)]">{activeOrders.length}</b>
          <span className="text-[11px] text-[var(--ok)] mt-1 font-medium">In workshop crafting</span>
        </div>

        <div className="panel p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[var(--mut)] mb-1">
            <span>Pending Payouts</span>
            <DollarSign className="w-4 h-4 text-[var(--ok)]" />
          </div>
          <b className="text-2xl font-serif text-[var(--ink)]">{formatLKR(pendingPayout)}</b>
          <span className="text-[11px] text-[var(--mut)] mt-1">Disbursed bi-weekly</span>
        </div>

        <div className="panel p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[var(--mut)] mb-1">
            <span>Studio Rating</span>
            <Star className="w-4 h-4 text-amber-400 fill-current" />
          </div>
          <b className="text-2xl font-serif text-[var(--ink)]">4.9 ★</b>
          <span className="text-[11px] text-[var(--mut)] mt-1">From 84 customer proofs</span>
        </div>

        <div className="panel p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[var(--mut)] mb-1">
            <span>Completed Crafts</span>
            <Clock className="w-4 h-4 text-[var(--teak)]" />
          </div>
          <b className="text-2xl font-serif text-[var(--ink)]">{totalCompleted}</b>
          <span className="text-[11px] text-[var(--mut)] mt-1">Heirlooms delivered</span>
        </div>
      </div>

      {/* 4-Column Kanban Pipeline */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl">Production Kanban Pipeline</h3>
            <p className="sub text-xs mt-0.5">
              Advance tickets through each workshop milestone. Customer tracking updates immediately.
            </p>
          </div>
        </div>

        <KanbanBoard />
      </div>

      {/* Product & Lead Time Manager Drawer / Modal */}
      {isManagerOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="panel bg-[var(--surface)] max-w-2xl w-full p-6 rounded-2xl shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <h3 className="text-base font-bold text-[var(--ink)]">
                Studio Catalog &amp; Lead Time Manager
              </h3>
              <button
                type="button"
                onClick={() => setIsManagerOpen(false)}
                className="text-[var(--mut)] hover:text-[var(--ink)]"
              >
                ✕
              </button>
            </div>

            {/* Add New Listing Form */}
            <form onSubmit={handleAddNewListing} className="p-4 bg-[var(--bg)] rounded-xl space-y-3 border border-[var(--line)]">
              <h4 className="text-xs font-bold text-[var(--ink)] uppercase tracking-wider">
                + Add New Bespoke Craft Listing
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="new-name" className="text-xs">Craft Title</label>
                  <input
                    type="text"
                    id="new-name"
                    placeholder="e.g. Mahogony Keepsake Chest"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                    className="text-xs py-2"
                  />
                </div>
                <div>
                  <label htmlFor="new-mat" className="text-xs">Material</label>
                  <select
                    id="new-mat"
                    value={newMaterial}
                    onChange={(e) => setNewMaterial(e.target.value)}
                    className="text-xs py-2"
                  >
                    <option value="Wood">Woodwork</option>
                    <option value="Resin">Resin Art</option>
                    <option value="Ceramic">Ceramic</option>
                    <option value="Batik">Batik</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="new-pr" className="text-xs">Base Price (LKR)</label>
                  <input
                    type="number"
                    id="new-pr"
                    value={newPrice}
                    onChange={(e) => setNewPrice(parseInt(e.target.value, 10))}
                    className="text-xs py-2"
                  />
                </div>
                <div>
                  <label htmlFor="new-ld" className="text-xs">Crafting Lead Time (Days)</label>
                  <input
                    type="number"
                    id="new-ld"
                    min={1}
                    max={14}
                    value={newLeadDays}
                    onChange={(e) => setNewLeadDays(parseInt(e.target.value, 10))}
                    className="text-xs py-2"
                  />
                </div>
              </div>

              <button type="submit" className="btn gold text-xs py-2 px-4 font-bold">
                Create &amp; Publish Listing
              </button>
            </form>

            {/* Existing Studio Listings */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[var(--ink)] uppercase tracking-wider">
                Active Workshop Listings &amp; Lead Times
              </h4>
              {productListings.map((p) => (
                <div
                  key={p.id}
                  className="p-3 rounded-xl border border-[var(--line)] bg-[var(--surface)] flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{p.emoji}</span>
                    <div>
                      <b className="text-[var(--ink)] block">{p.name}</b>
                      <span className="text-[11px] text-[var(--mut)]">Base: {formatLKR(p.basePrice)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[var(--mut)]">Lead Time:</span>
                    <select
                      value={p.leadTimeDays}
                      onChange={(e) => handleUpdateLeadTime(p.id, parseInt(e.target.value, 10))}
                      className="text-xs py-1 px-2 border rounded-md"
                    >
                      <option value={1}>1 Day (Rush)</option>
                      <option value={2}>2 Days (Express)</option>
                      <option value={3}>3 Days (Standard)</option>
                      <option value={4}>4 Days</option>
                      <option value={5}>5 Days</option>
                      <option value={7}>7 Days</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setIsManagerOpen(false)}
                className="btn ghost text-xs py-2 px-4"
              >
                Close Manager
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
