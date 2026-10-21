"use client";

import React, { useState } from "react";
import { useOrderStore } from "@/lib/store/orderStore";
import { useToastStore } from "@/lib/store/toastStore";
import { formatLKR } from "@/lib/utils";
import { ArtisanApplication } from "@/lib/types";
import { BarChart3, ShieldCheck, DollarSign, AlertCircle, Eye, TrendingUp } from "lucide-react";

export default function AdminDashboardPage() {
  const {
    orders,
    disputes,
    applications,
    resolveDispute,
    reviewApplication,
  } = useOrderStore();
  const { showToast } = useToastStore();

  const [inspectingApp, setInspectingApp] = useState<ArtisanApplication | null>(null);

  const pendingApps = applications.filter((a) => a.status === "PENDING");
  const openDisputes = disputes.filter((d) => d.status === "OPEN");

  // Revenue & ledger calculations
  const totalGrossSales = 412000 + orders.reduce((acc, o) => acc + o.total, 0);
  const totalCommission = Math.round(totalGrossSales * 0.08);
  const totalArtisanPayouts = totalGrossSales - totalCommission;

  const handleApprove = (appId: string, name: string) => {
    reviewApplication(appId, "APPROVED");
    showToast(`Artisan application for "${name}" approved ✓`);
    setInspectingApp(null);
  };

  const handleReject = (appId: string, name: string) => {
    reviewApplication(appId, "REJECTED");
    showToast(`Application for "${name}" rejected.`);
    setInspectingApp(null);
  };

  const handleResolveDispute = (disputeId: string) => {
    resolveDispute(disputeId);
    showToast("Dispute resolved with customer and artisan.");
  };

  return (
    <div className="space-y-8 py-2">
      {/* Admin Title */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--accent)] uppercase tracking-wider mb-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Platform Governance &amp; Analytics</span>
        </div>
        <h2>Super Admin Portal</h2>
        <p className="sub">
          Monitor platform sales velocity, verify artisan applications, audit financial ledgers, and resolve customer disputes.
        </p>
      </div>

      {/* 1. Platform Analytics Dashboard Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="panel p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[var(--mut)] mb-1">
            <span>Gross Platform GMV</span>
            <TrendingUp className="w-4 h-4 text-[var(--ok)]" />
          </div>
          <b className="text-2xl font-serif text-[var(--ink)]">{formatLKR(totalGrossSales)}</b>
          <span className="text-[11px] text-[var(--ok)] font-medium mt-1">↑ +18.4% this month</span>
        </div>

        <div className="panel p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[var(--mut)] mb-1">
            <span>Net Commission (8%)</span>
            <DollarSign className="w-4 h-4 text-[var(--accent)]" />
          </div>
          <b className="text-2xl font-serif text-[var(--ink)]">{formatLKR(totalCommission)}</b>
          <span className="text-[11px] text-[var(--mut)] mt-1">Platform operational revenue</span>
        </div>

        <div className="panel p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[var(--mut)] mb-1">
            <span>Artisan Payouts</span>
            <BarChart3 className="w-4 h-4 text-blue-500" />
          </div>
          <b className="text-2xl font-serif text-[var(--ink)]">{formatLKR(totalArtisanPayouts)}</b>
          <span className="text-[11px] text-[var(--ok)] mt-1">Direct to rural workshops</span>
        </div>

        <div className="panel p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[var(--mut)] mb-1">
            <span>Action Required</span>
            <AlertCircle className="w-4 h-4 text-amber-500" />
          </div>
          <b className="text-2xl font-serif text-[var(--ink)]">
            {pendingApps.length + openDisputes.length}
          </b>
          <span className="text-[11px] text-amber-600 font-medium mt-1">
            {pendingApps.length} Artisans · {openDisputes.length} Disputes
          </span>
        </div>
      </div>

      {/* Analytics Charts & Material Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="panel md:col-span-2 space-y-4 p-6">
          <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
            <h3 className="text-base font-bold text-[var(--ink)]">Top Selling Craft Materials</h3>
            <span className="text-xs text-[var(--mut)]">By order revenue volume</span>
          </div>

          <div className="space-y-3.5">
            <div>
              <div className="flex justify-between text-xs font-semibold text-[var(--ink)] mb-1">
                <span>Solid Plantation Teak (Woodwork)</span>
                <span>46% · LKR 189,520</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-[var(--line)]/50 overflow-hidden">
                <div className="h-full bg-[var(--accent)] rounded-full" style={{ width: "46%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-[var(--ink)] mb-1">
                <span>Hand-Waxed Cotton (Batik Tapestries)</span>
                <span>24% · LKR 98,880</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-[var(--line)]/50 overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: "24%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-[var(--ink)] mb-1">
                <span>Terracotta Clay Kilns (Pottery)</span>
                <span>18% · LKR 74,160</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-[var(--line)]/50 overflow-hidden">
                <div className="h-full bg-[var(--teak)] rounded-full" style={{ width: "18%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-[var(--ink)] mb-1">
                <span>Botanical Pressed Floral (Resin Art)</span>
                <span>12% · LKR 49,440</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-[var(--line)]/50 overflow-hidden">
                <div className="h-full bg-teal-500 rounded-full" style={{ width: "12%" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Operational Quality Ratios */}
        <div className="panel space-y-4 p-6">
          <h3 className="text-base font-bold text-[var(--ink)] border-b border-[var(--line)] pb-3">
            Workshop Performance
          </h3>
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-[var(--bg)] border border-[var(--line)]">
              <span className="text-[var(--mut)] block">Proof Approval Rate</span>
              <b className="text-xl text-[var(--ok)] font-serif">99.4%</b>
              <p className="text-[10px] text-[var(--mut)] mt-0.5">Approved prior to carving</p>
            </div>
            <div className="p-3 rounded-xl bg-[var(--bg)] border border-[var(--line)]">
              <span className="text-[var(--mut)] block">Average Lead Time</span>
              <b className="text-xl text-[var(--ink)] font-serif">2.8 Days</b>
              <p className="text-[10px] text-[var(--mut)] mt-0.5">From order to dispatch</p>
            </div>
            <div className="p-3 rounded-xl bg-[var(--bg)] border border-[var(--line)]">
              <span className="text-[var(--mut)] block">Dispute Rate</span>
              <b className="text-xl text-[var(--ok)] font-serif">0.6%</b>
              <p className="text-[10px] text-[var(--mut)] mt-0.5">Well under 2% industry cap</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Artisan Verification Queue */}
      <div className="panel space-y-4 p-6">
        <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
          <div>
            <h3 className="text-base font-bold text-[var(--ink)]">Artisan Verification Queue</h3>
            <p className="text-xs text-[var(--mut)] mt-0.5">
              Review master workshop credentials and inspect sample craft portfolios before granting storefront access.
            </p>
          </div>
          <span className="badge">{pendingApps.length} Pending Review</span>
        </div>

        <table>
          <tbody>
            {pendingApps.length > 0 ? (
              pendingApps.map((artisan) => (
                <tr key={artisan.id} className="hover:bg-[var(--bg)]/40 transition-colors">
                  <td className="py-3">
                    <b className="text-sm text-[var(--ink)] block">{artisan.name}</b>
                    <small className="text-[var(--mut)]">
                      {artisan.location} Province · {artisan.category} craft discipline · Submitted today
                    </small>
                  </td>
                  <td align="right" className="py-3 space-x-2">
                    <button
                      type="button"
                      onClick={() => setInspectingApp(artisan)}
                      className="btn ghost text-xs py-1.5 px-3 inline-flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5 text-[var(--accent)]" />
                      <span>Inspect Samples</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApprove(artisan.id, artisan.name)}
                      className="btn gold text-xs py-1.5 px-3 font-bold"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReject(artisan.id, artisan.name)}
                      className="btn ghost text-xs py-1.5 px-3 text-red-500 hover:border-red-500"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="empty py-8 text-center text-xs text-[var(--mut)]">
                  All artisan applications have been reviewed and verified.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 3. Financial Ledger & Open Customer Disputes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Financial Disbursements Ledger */}
        <div className="panel p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--line)] pb-2">
            <h3 className="text-base font-bold text-[var(--ink)]">Bi-Weekly Payout Ledger</h3>
            <span className="text-[11px] text-[var(--ok)] font-medium">Auto-calculated (85%)</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-lg border border-[var(--line)] bg-[var(--bg)] flex justify-between items-center">
              <div>
                <b>Kandy Wood Studio</b>
                <span className="text-[11px] text-[var(--mut)] block">Commercial Bank Acc #8102938471</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-[var(--ink)] block">{formatLKR(58400)}</span>
                <span className="text-[10px] text-[var(--ok)]">Ready to release</span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg border border-[var(--line)] bg-[var(--bg)] flex justify-between items-center">
              <div>
                <b>Weligama Batik Co.</b>
                <span className="text-[11px] text-[var(--mut)] block">Sampath Bank Acc #109283741</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-[var(--ink)] block">{formatLKR(42100)}</span>
                <span className="text-[10px] text-[var(--ok)]">Ready to release</span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg border border-[var(--line)] bg-[var(--bg)] flex justify-between items-center">
              <div>
                <b>Molagoda Potters</b>
                <span className="text-[11px] text-[var(--mut)] block">Bank of Ceylon Acc #7482910</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-[var(--ink)] block">{formatLKR(24650)}</span>
                <span className="text-[10px] text-[var(--ok)]">Ready to release</span>
              </div>
            </div>
          </div>
        </div>

        {/* Open Disputes Management */}
        <div className="panel p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--line)] pb-2">
            <h3 className="text-base font-bold text-[var(--ink)]">Customer Disputes ({openDisputes.length})</h3>
            <span className="text-[11px] text-amber-600 font-medium">Bespoke SLA: 48h</span>
          </div>

          <div className="space-y-2 text-xs">
            {openDisputes.length > 0 ? (
              openDisputes.map((dispute) => (
                <div
                  key={dispute.id}
                  className="p-3 rounded-xl border border-[var(--line)] bg-[var(--bg)] flex items-center justify-between"
                >
                  <div>
                    <b className="text-[var(--ink)] block">#{dispute.orderCode}</b>
                    <span className="text-[11px] text-[var(--mut)]">{dispute.issue}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleResolveDispute(dispute.id)}
                    className="btn ghost text-[11px] py-1 px-3 text-[var(--ok)] border-[var(--ok)] hover:bg-[var(--ok)]/10"
                  >
                    Resolve &amp; Free Remake
                  </button>
                </div>
              ))
            ) : (
              <div className="empty py-6 text-center text-xs text-[var(--mut)]">
                No active consumer disputes.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Workshop Portfolio Inspection Modal */}
      {inspectingApp && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="panel bg-[var(--surface)] max-w-lg w-full p-6 rounded-2xl shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <h3 className="text-base font-bold text-[var(--ink)]">
                Workshop Verification: {inspectingApp.name}
              </h3>
              <button
                type="button"
                onClick={() => setInspectingApp(null)}
                className="text-[var(--mut)] hover:text-[var(--ink)]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <p>Location: <b>{inspectingApp.location} District</b></p>
              <p>Primary Craft: <b>{inspectingApp.category}</b></p>
              <p className="text-[var(--mut)]">
                Workshop verified with certified sustainable timber sourcing, local river clay beds, and fair employment terms for apprentices.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 py-2">
              <div className="aspect-square bg-[var(--bg)] rounded-lg border border-[var(--line)] flex items-center justify-center text-2xl">
                🪵
              </div>
              <div className="aspect-square bg-[var(--bg)] rounded-lg border border-[var(--line)] flex items-center justify-center text-2xl">
                🔨
              </div>
              <div className="aspect-square bg-[var(--bg)] rounded-lg border border-[var(--line)] flex items-center justify-center text-2xl">
                ✨
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleReject(inspectingApp.id, inspectingApp.name)}
                className="btn ghost text-xs py-2 px-4 text-red-500 hover:border-red-500"
              >
                Decline Application
              </button>
              <button
                type="button"
                onClick={() => handleApprove(inspectingApp.id, inspectingApp.name)}
                className="btn gold text-xs py-2 px-4 font-bold"
              >
                Approve &amp; Grant Verified Badge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
