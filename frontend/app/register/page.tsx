"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { useToastStore } from "@/lib/store/toastStore";
import { UserRole } from "@/lib/types";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRoleParam = searchParams.get("role");

  const { register } = useAuthStore();
  const { showToast } = useToastStore();

  const defaultRole: UserRole =
    initialRoleParam?.toLowerCase() === "artisan"
      ? "ARTISAN"
      : initialRoleParam?.toLowerCase() === "admin"
      ? "ADMIN"
      : "CUSTOMER";

  const [role, setRole] = useState<UserRole>(defaultRole);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nm = name.trim();
    const em = email.trim();

    if (!nm) {
      setError("Enter your full name.");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(em)) {
      setError("Enter a valid email, like name@example.com.");
      return;
    }

    if (password.length < 6) {
      setError("Password needs at least 6 characters.");
      return;
    }

    setError("");
    const user = register(nm, em, role);
    showToast(`Welcome, ${user.name}`);

    if (role === "ARTISAN") {
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
        <Link href="/login" className="chip">
          Sign in
        </Link>
        <Link href="/register" className="chip active">
          Create account
        </Link>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="reg-role">I am a</label>
        <select
          id="reg-role"
          value={role}
          onChange={(e) => setRole(e.target.value as UserRole)}
        >
          <option value="CUSTOMER">Gift shopper</option>
          <option value="ARTISAN">Artisan (Maker)</option>
          <option value="ADMIN">Platform admin</option>
        </select>

        <label htmlFor="reg-name">Full name</label>
        <input
          type="text"
          id="reg-name"
          autoComplete="name"
          placeholder="e.g. Poorni Gamage"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label htmlFor="reg-email">Email</label>
        <input
          type="email"
          id="reg-email"
          inputMode="email"
          autoComplete="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="reg-pw">Password</label>
        <input
          type="password"
          id="reg-pw"
          autoComplete="new-password"
          placeholder="At least 6 characters"
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
          Create account
        </button>

        <div className="note text-xs mt-3">
          Demo registration: your profile will be created in local memory. Database persistence via Prisma is enabled in Phase 2.
        </div>
      </form>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="auth">
      <h2>Join CraftVilla</h2>
      <p className="sub">
        Create an account to track orders and save bespoke designs.
      </p>
      <Suspense fallback={<div className="panel text-center py-8">Loading form...</div>}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
