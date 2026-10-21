"use client";

import React from "react";
import { useOrderStore } from "@/lib/store/orderStore";
import { useToastStore } from "@/lib/store/toastStore";
import { formatLKR } from "@/lib/utils";

export default function AdminDashboardPage() {
  const {
    orders,
    disputes,
    applications,
    resolveDispute,
    reviewApplication,
  } = useOrderStore();
  const { showToast } = useToastStore();

  const pendingApps = applications.filter((a) => a.status === "PENDING");
  const openDisputes = disputes.filter((d) => d.status === "OPEN");

  // Revenue calculation
  const totalGrossSales = 412000 + orders.reduce((acc, o) => acc + o.total, 0);
  const totalCommission = Math.round(totalGrossSales * 0.08);

  const handleApprove = (appId: string, name: string) => {
    reviewApplication(appId, "APPROVED");
    showToast(`${name} approved`);
  };

  const handleReject = (appId: string) => {
    reviewApplication(appId, "REJECTED");
    showToast("Application rejected");
  };

  const handleResolveDispute = (disputeId: string) => {
    resolveDispute(disputeId);
    showToast("Dispute resolved");
  };

  return (
    <div>
      <h2>Marketplace admin</h2>
      <p className="sub">Vet artisans, settle disputes and watch revenue.</p>

      {/* KPI Stats */}
      <div className="stats">
        <div className="panel stat">
          <b>{128 + orders.length}</b>
          Orders this month
        </div>
        <div className="panel stat">
          <b>{formatLKR(totalGrossSales)}</b>
          Gross sales
        </div>
        <div className="panel stat">
          <b>{formatLKR(totalCommission)}</b>
          Commission (8%)
        </div>
        <div className="panel stat">
          <b>{pendingApps.length}</b>
          Artisans to review
        </div>
      </div>

      {/* Artisan Verification Panel */}
      <div className="panel mt-6">
        <h3 className="text-xl mb-3">Artisan verification</h3>
        <table>
          <tbody>
            {pendingApps.length > 0 ? (
              pendingApps.map((artisan) => (
                <tr key={artisan.id}>
                  <td>
                    <b>{artisan.name}</b>
                    <br />
                    <small className="text-[var(--mut)]">
                      {artisan.location} · {artisan.category} craft
                    </small>
                  </td>
                  <td align="right">
                    <button
                      type="button"
                      className="btn text-xs py-1.5 px-3 mr-2"
                      onClick={() => handleApprove(artisan.id, artisan.name)}
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      className="btn ghost text-xs py-1.5 px-3"
                      onClick={() => handleReject(artisan.id)}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="empty py-6">
                  All applications reviewed.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Open Disputes Panel */}
      <div className="panel mt-6">
        <h3 className="text-xl mb-3">Open disputes</h3>
        <table>
          <tbody>
            {openDisputes.length > 0 ? (
              openDisputes.map((dispute) => (
                <tr key={dispute.id}>
                  <td>
                    <b>{dispute.orderCode}</b>
                    <br />
                    <small className="text-[var(--mut)]">{dispute.issue}</small>
                  </td>
                  <td align="right">
                    <button
                      type="button"
                      className="btn ghost text-xs py-1.5 px-3"
                      onClick={() => handleResolveDispute(dispute.id)}
                    >
                      Resolve
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="empty py-6">
                  No open disputes.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
