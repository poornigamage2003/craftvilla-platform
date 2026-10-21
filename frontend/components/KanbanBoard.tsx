"use client";

import React, { useState } from "react";
import { useOrderStore } from "@/lib/store/orderStore";
import { useToastStore } from "@/lib/store/toastStore";
import { KANBAN_COLUMNS } from "@/lib/data";
import { Order } from "@/lib/types";
import { formatLKR } from "@/lib/utils";
import { Download, UploadCloud, Printer, CheckCircle2, X } from "lucide-react";

interface KanbanBoardProps {
  artisanFilter?: string;
}

export default function KanbanBoard({ artisanFilter }: KanbanBoardProps) {
  const { orders, advanceOrder } = useOrderStore();
  const { showToast } = useToastStore();

  const [activeManifestOrder, setActiveManifestOrder] = useState<Order | null>(null);
  const [activeProofOrder, setActiveProofOrder] = useState<Order | null>(null);
  const [proofPhotoUploaded, setProofPhotoUploaded] = useState(false);

  const handleAdvance = (orderId: number) => {
    const res = advanceOrder(orderId);
    if (res.success) {
      if (res.dispatched) {
        showToast("Handed to courier. Milestone tracking updated!");
      } else {
        showToast("Ticket advanced to next pipeline stage.");
      }
    }
  };

  const handleDownloadSpecs = (order: Order) => {
    const item = order.items[0];
    const specContent = `CRAFTVILLA ARTISANAL SPECIFICATION SHEET
=============================================
Order Reference: #${order.code}
Customer: ${order.customerName}
Delivery To: ${order.deliveryAddress}
Created Date: ${order.createdAt}
---------------------------------------------
Item: ${item?.name}
Custom Inscription: "${item?.text || 'N/A'}"
Font: ${item?.font || 'Artisanal'}
Finish / Stain: ${item?.finish}
Dimensions: Standard 30 x 20 cm
Reference Image: ${item?.imageUrl ? 'Attached (Base64)' : 'None'}
=============================================
Crafting Instructions: Season timber, laser inscribe approved text, oil finish.`;

    const blob = new Blob([specContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `SpecSheet_${order.code}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Downloaded Spec Sheet for #${order.code}`);
  };

  const handleUploadProofSuccess = () => {
    if (activeProofOrder) {
      handleAdvance(activeProofOrder.id);
      setActiveProofOrder(null);
      setProofPhotoUploaded(false);
      showToast(`Proof photo submitted for #${activeProofOrder.code}! Moved to Ready to Dispatch.`);
    }
  };

  // Filter orders by artisan if specified, otherwise show all
  const filteredOrders = artisanFilter
    ? orders.filter((o) =>
        o.items.some((item) => item.name.toLowerCase().includes(artisanFilter.toLowerCase()))
      )
    : orders;

  return (
    <>
      <div className="board" role="region" aria-label="Artisan production pipeline board">
        {KANBAN_COLUMNS.map((colName, colIndex) => {
          const columnOrders = filteredOrders.filter((o) => o.col === colIndex);

          return (
            <div key={colName} className="col flex flex-col justify-between">
              <div>
                <h3>
                  <span>{colName}</span>
                  <small className="bg-[var(--surface)] text-[var(--ink)] px-2 py-0.5 rounded-full text-xs font-bold border border-[var(--line)]">
                    {columnOrders.length}
                  </small>
                </h3>

                <div className="flex flex-col gap-2.5 mt-2">
                  {columnOrders.length > 0 ? (
                    columnOrders.map((order) => {
                      const firstItem = order.items[0];
                      return (
                        <div key={order.id} className="tk p-3.5 space-y-2 rounded-xl shadow-xs border border-[var(--line)]">
                          <div className="flex items-center justify-between">
                            <b className="text-xs font-mono text-[var(--ink)]">#{order.code}</b>
                            <span className="text-[10px] text-[var(--mut)] bg-[var(--bg)] px-2 py-0.5 rounded-full">
                              ⚡ {Math.max(5 - colIndex, 1)}d Left
                            </span>
                          </div>

                          <div>
                            <span className="text-xs font-bold text-[var(--ink)] block">
                              {order.name}
                            </span>
                            {firstItem && (
                              <p className="text-[11px] text-[var(--mut)] bg-[var(--bg)] p-1.5 rounded-md mt-1 border border-[var(--line)]/50">
                                Inscription: &ldquo;<b>{firstItem.text}</b>&rdquo;
                                <br />
                                <span className="text-[10px] text-[var(--mut)]">
                                  Finish: {firstItem.finish} · {firstItem.font || "Custom"}
                                </span>
                              </p>
                            )}
                          </div>

                          {/* Column 1: New Orders -> Accept & Lock */}
                          {colIndex === 0 && (
                            <button
                              type="button"
                              onClick={() => handleAdvance(order.id)}
                              className="btn gold text-xs py-1.5 px-3 w-full font-bold flex items-center justify-center gap-1"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Accept &amp; Lock Ticket</span>
                            </button>
                          )}

                          {/* Column 2: In Crafting -> Download Specs & Move to Quality Check */}
                          {colIndex === 1 && (
                            <div className="space-y-1.5 pt-1">
                              <button
                                type="button"
                                onClick={() => handleDownloadSpecs(order)}
                                className="btn ghost text-[11px] py-1 px-2.5 w-full flex items-center justify-center gap-1 border-dashed"
                              >
                                <Download className="w-3 h-3" />
                                <span>Download Customer Specs</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleAdvance(order.id)}
                                className="btn text-xs py-1.5 px-3 w-full font-bold"
                              >
                                <span>Move to Quality Check</span>
                              </button>
                            </div>
                          )}

                          {/* Column 3: Quality Check -> Upload Finished Proof Photo */}
                          {colIndex === 2 && (
                            <div className="space-y-1.5 pt-1">
                              <button
                                type="button"
                                onClick={() => setActiveProofOrder(order)}
                                className="btn gold text-[11px] py-1.5 px-2.5 w-full font-bold flex items-center justify-center gap-1"
                              >
                                <UploadCloud className="w-3.5 h-3.5" />
                                <span>Upload Inspection Proof</span>
                              </button>
                            </div>
                          )}

                          {/* Column 4: Ready to Dispatch -> Print Manifest & Mark Dispatched */}
                          {colIndex === 3 && (
                            <div className="space-y-1.5 pt-1">
                              <button
                                type="button"
                                onClick={() => setActiveManifestOrder(order)}
                                className="btn ghost text-[11px] py-1 px-2.5 w-full flex items-center justify-center gap-1"
                              >
                                <Printer className="w-3.5 h-3.5 text-[var(--accent)]" />
                                <span>Print Shipping Manifest</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleAdvance(order.id)}
                                className="btn gold text-xs py-1.5 px-3 w-full font-bold"
                              >
                                <span>Hand to Courier</span>
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-10 text-xs text-[var(--mut)]">
                      No active tickets
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Courier Shipping Manifest Modal */}
      {activeManifestOrder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="panel bg-[var(--surface)] max-w-lg w-full p-6 rounded-2xl shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-[var(--accent)]" />
                <h3 className="text-base font-bold text-[var(--ink)]">
                  Courier Shipping Label &amp; Manifest
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveManifestOrder(null)}
                className="text-[var(--mut)] hover:text-[var(--ink)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Printable Airway Bill Preview */}
            <div className="p-4 bg-[var(--bg)] border-2 border-dashed border-[var(--line)] rounded-xl space-y-3 text-xs font-mono">
              <div className="flex justify-between items-center border-b border-[var(--line)] pb-2">
                <span className="font-bold text-sm">CRAFTVILLA EXPRESS CARGO</span>
                <span className="bg-black text-white px-2 py-0.5 rounded text-[10px]">PREPAID</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-[var(--mut)] block">FROM SENDER:</span>
                  <b>CraftVilla Workshop Kandy</b>
                  <p>Central Province, Sri Lanka</p>
                </div>
                <div>
                  <span className="text-[var(--mut)] block">DELIVER TO:</span>
                  <b>{activeManifestOrder.customerName}</b>
                  <p>{activeManifestOrder.deliveryAddress}</p>
                </div>
              </div>
              <div className="border-t border-[var(--line)] pt-2 flex justify-between items-center">
                <span>Ref: <b>#{activeManifestOrder.code}</b></span>
                <span>Val: <b>{formatLKR(activeManifestOrder.total)}</b></span>
              </div>
              <div className="text-center pt-2">
                <p className="text-xl tracking-widest font-bold">||| | ||||| || |||| |||</p>
                <span className="text-[10px] text-[var(--mut)]">AWB-LK-{activeManifestOrder.id}-2026</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveManifestOrder(null)}
                className="btn ghost text-xs py-2 px-4"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  window.print();
                  showToast("Sending label to printer...");
                }}
                className="btn gold text-xs py-2 px-4 font-bold flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Physical Airway Bill</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quality Check Proof Photo Upload Modal */}
      {activeProofOrder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="panel bg-[var(--surface)] max-w-md w-full p-6 rounded-2xl shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <div className="flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-[var(--accent)]" />
                <h3 className="text-base font-bold text-[var(--ink)]">
                  Inspection Proof: #{activeProofOrder.code}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveProofOrder(null)}
                className="text-[var(--mut)] hover:text-[var(--ink)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[var(--mut)]">
              Photograph the finished piece with its approved inscription before wrapping. Customer receives this photo in their tracking portal.
            </p>

            <div
              onClick={() => setProofPhotoUploaded(true)}
              className="border-2 border-dashed border-[var(--line)] p-8 rounded-xl text-center cursor-pointer hover:border-[var(--accent)] transition-colors"
            >
              <UploadCloud className="w-8 h-8 text-[var(--accent)] mx-auto mb-2" />
              <p className="text-xs font-bold text-[var(--ink)]">
                {proofPhotoUploaded ? "✓ Finished proof photo attached!" : "Click to attach finished craft photo (JPG / PNG)"}
              </p>
              <p className="text-[11px] text-[var(--mut)] mt-1">High resolution inspection proof</p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveProofOrder(null)}
                className="btn ghost text-xs py-2 px-4"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!proofPhotoUploaded}
                onClick={handleUploadProofSuccess}
                className="btn gold text-xs py-2 px-4 font-bold"
              >
                Verify &amp; Pass Quality Inspection
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
