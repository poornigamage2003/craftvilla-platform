"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/lib/store/cartStore";
import { useAuthStore } from "@/lib/store/authStore";
import { useOrderStore } from "@/lib/store/orderStore";
import { useToastStore } from "@/lib/store/toastStore";
import { useIsMounted } from "@/lib/useIsMounted";
import { Sun, Moon } from "lucide-react";

export default function Header() {
  const pathname = usePathname();
  const mounted = useIsMounted();
  const { getTotalCount } = useCartStore();
  const { user, logout } = useAuthStore();
  const { latestPlacedOrderId } = useOrderStore();
  const { showToast } = useToastStore();

  const [theme, setTheme] = useState<"light" | "dark">("light");

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    if (typeof window !== "undefined") {
      localStorage.setItem("craftvilla-theme", next);
      document.documentElement.setAttribute("data-theme", next);
    }
  };

  const cartCount = mounted ? getTotalCount() : 0;

  const trackHref = latestPlacedOrderId
    ? `/track/CV-${latestPlacedOrderId}`
    : "/track/CV-1024";

  const getAccountHref = () => {
    if (!user) return "/login";
    if (user.role === "ARTISAN") return "/artisan";
    if (user.role === "ADMIN") return "/admin";
    return "/account";
  };

  const handleSignOut = () => {
    logout();
    showToast("Signed out");
  };

  return (
    <header>
      <div className="bar">
        <Link href="/" className="logo" aria-label="CraftVilla Home">
          Craft<b>Villa</b>
        </Link>

        <nav aria-label="Main Navigation">
          <Link
            href="/"
            aria-current={pathname === "/" ? "page" : undefined}
          >
            Shop
          </Link>
          <Link
            href="/artisans"
            aria-current={pathname.startsWith("/artisans") ? "page" : undefined}
          >
            Artisans
          </Link>
          <Link
            href="/customize/teak-name-plaque"
            aria-current={pathname.startsWith("/customize") ? "page" : undefined}
          >
            Customizer
          </Link>
          <Link
            href="/hampers"
            aria-current={pathname === "/hampers" ? "page" : undefined}
          >
            Hampers
          </Link>
          <Link
            href={trackHref}
            aria-current={pathname.startsWith("/track") ? "page" : undefined}
          >
            Track order
          </Link>

          {mounted && user ? (
            <>
              <Link
                href={getAccountHref()}
                aria-current={
                  pathname === "/account" ||
                  pathname === "/artisan" ||
                  pathname === "/admin"
                    ? "page"
                    : undefined
                }
              >
                {user.name.split(" ")[0]}
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                aria-label="Sign out"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              aria-current={pathname === "/login" || pathname === "/register" ? "page" : undefined}
            >
              Sign in
            </Link>
          )}

          <Link
            href="/cart"
            className="cartbtn"
            aria-current={pathname === "/cart" || pathname === "/checkout" ? "page" : undefined}
            aria-label={`Cart, ${cartCount} items`}
          >
            Cart
            <b id="cc">{cartCount}</b>
          </Link>

          <button
            type="button"
            onClick={toggleTheme}
            className="p-1.5 ml-1 rounded-full text-[var(--mut)] hover:text-[var(--ink)]"
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            title={`Toggle theme`}
          >
            {theme === "light" ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4" />
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}
