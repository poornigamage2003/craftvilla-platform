"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { useOrderStore } from "@/lib/store/orderStore";
import { useToastStore } from "@/lib/store/toastStore";
import { STAGES } from "@/lib/data";
import { formatLKR } from "@/lib/utils";
import { useIsMounted } from "@/lib/useIsMounted";

const STAGE_PROGRESS = [2, 3, 4, 4, 5];

export default function AccountPage() {
  const router = useRouter();
  const mounted = useIsMounted();
  const { user, logout } = useAuthStore();
  const { orders } = useOrderStore();
  const { showToast } = useToastStore();

  if (!mounted) {
    return <div><h2>My account</h2><p className="sub">Loading profile...</p></div>;
  }

  if (!user) {
    return (
      <div className="panel empty max-w-lg mx-auto">
        <h2>My account</h2>
        <p className="my-4 text-[var(--mut)]">
          Sign in to view your personalized orders, track delivery milestones, or access your artisan workshop.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/login" className="btn gold">
            Sign in
          </Link>
          <Link href="/register" className="btn ghost">
            Create account
          </Link>
        </div>
      </div>
    );
  }

  // Filter orders for this customer (or show all demo placed orders if test customer)
  const myOrders = orders.filter(
    (o) =>
      o.customerEmail.toLowerCase() === user.email.toLowerCase() ||
      user.role === "CUSTOMER"
  );

  return (
    <div>
      <h2>My account</h2>
      <p className="sub">Manage your profile and track custom crafted orders.</p>

      {/* User Info Card */}
      <div className="panel flex justify-between items-center flex-wrap gap-4 mb-6">
        <div>
          <b className="text-xl text-[var(--ink)] block">{user.name}</b>
          <small className="text-[var(--mut)]">
            {user.email} · {user.role === "ARTISAN" ? "Artisan Maker" : user.role === "ADMIN" ? "Platform Administrator" : "Gift Shopper"}
          </small>
        </div>
        <div className="flex gap-2">
          {user.role === "ARTISAN" && (
            <Link href="/artisan" className="btn gold text-sm">
              Artisan Board
            </Link>
          )}
          {user.role === "ADMIN" && (
            <Link href="/admin" className="btn gold text-sm">
              Admin Portal
            </Link>
          )}
          <button
            type="button"
            onClick={() => {
              logout();
              showToast("Signed out");
              router.push("/");
            }}
            className="btn ghost text-sm"
          >
            Sign out
          </button>
        </div>
      </div>

      <h3 className="text-2xl mt-6 mb-3">Your orders</h3>
      {myOrders.length > 0 ? (
        <div className="flex flex-col gap-3">
          {myOrders.map((order) => {
            const doneCount = STAGE_PROGRESS[order.col] ?? 2;
            const stageLabel = STAGES[Math.max(doneCount - 1, 0)]?.label || order.stage;

            return (
              <div key={order.id} className="panel line items-center">
                <div>
                  <b className="text-[var(--ink)] block">
                    #{order.code} · {order.name}
                  </b>
                  <small className="text-[var(--mut)]">
                    Status: <span className="text-[var(--ok)] font-medium">{stageLabel}</span> · {formatLKR(order.total)}
                  </small>
                </div>
                <Link
                  href={`/track/${order.code}`}
                  className="btn ghost text-sm py-1.5 px-4"
                >
                  Track
                </Link>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="empty">
          No orders yet. Your personalized gifts will appear here.
        </p>
      )}
    </div>
  );
}
