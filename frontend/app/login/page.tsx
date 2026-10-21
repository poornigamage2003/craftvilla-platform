"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { useToastStore } from "@/lib/store/toastStore";
import { UserRole } from "@/lib/types";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "";

  const { login } = useAuthStore();
  const { showToast } = useToastStore();

  const [role, setRole] = useState<UserRole>("CUSTOMER");
  const [email, setEmail] = useState<string>("shopper@craftvilla.lk");
  const [password, setPassword] = useState<string>("craft123");
  const [error, setError] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const em = email.trim();

    if (!/^\S+@\S+\.\S+$/.test(em)) {
      setError("Enter a valid email, like name@example.com.");
      return;
    }

    if (password.length < 6) {
      setError("Password needs at least 6 characters.");
      return;
    }

    setError("");
    const user = login(em, role);
    showToast(`Welcome, ${user.name}`);

    if (redirect === "cart") {
      router.push("/cart");
    } else if (redirect === "checkout") {
      router.push("/checkout");
    } else if (role === "ARTISAN") {
      router.push("/artisan");
    } else if (role === "ADMIN") {
      router.push("/admin");
    } else {
      router.push("/account");
    }
  };

  return (
    <div className="panel">
      <div className="tabs mb-4">
        <Link href="/login" className="chip active">
          Sign in
        </Link>
        <Link href="/register" className="chip">
          Create account
        </Link>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="role">I am a</label>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value as UserRole)}
        >
          <option value="CUSTOMER">Gift shopper</option>
          <option value="ARTISAN">Artisan</option>
          <option value="ADMIN">Platform admin</option>
        </select>

        <label htmlFor="em">Email</label>
        <input
          type="email"
          id="em"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="pw">Password</label>
        <input
          type="password"
          id="pw"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && (
          <div className="note bad" role="alert">
            {error}
          </div>
        )}

        <button type="submit" className="btn gold w-full mt-4">
          Sign in
        </button>

        <div className="note text-xs mt-3">
          Demo credentials: select any role. Any valid email and password of 6+
          characters logs in. Real JWT authentication comes in Phase 2.
        </div>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="auth">
      <h2>Welcome to CraftVilla</h2>
      <p className="sub">Sign in to order, sell or manage the marketplace.</p>
      <Suspense fallback={<div className="panel text-center py-8">Loading sign-in...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
