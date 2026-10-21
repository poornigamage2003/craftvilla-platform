"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store/cartStore";
import { useAuthStore } from "@/lib/store/authStore";
import { useToastStore } from "@/lib/store/toastStore";
import { useIsMounted } from "@/lib/useIsMounted";
import { PRODUCTS } from "@/lib/data";
import { Sun, Moon, Search, ShoppingBag, User as UserIcon, X } from "lucide-react";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const mounted = useIsMounted();
  const { getTotalCount } = useCartStore();
  const { user, logout } = useAuthStore();
  const { showToast } = useToastStore();

  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim().toLowerCase());
    }, 220);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close search dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchResults = debouncedQuery
    ? PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(debouncedQuery) ||
          p.material.toLowerCase().includes(debouncedQuery) ||
          p.artisanName.toLowerCase().includes(debouncedQuery)
      ).slice(0, 5)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/catalog?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    if (typeof window !== "undefined") {
      localStorage.setItem("craftvilla-theme", next);
      document.documentElement.setAttribute("data-theme", next);
    }
  };

  const cartCount = mounted ? getTotalCount() : 0;

  const handleSignOut = () => {
    logout();
    showToast("Signed out successfully");
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FAF8F5]/85 dark:bg-[#10132b]/85 backdrop-blur-md border-b border-stone-200/50 dark:border-stone-800/50 shadow-xs transition-colors">
      <div className="bar max-w-[1120px] mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link
          href="/"
          className="logo flex items-center gap-2 text-xl font-bold tracking-tight text-[var(--ink)] shrink-0"
          aria-label="CraftVilla Home"
        >
          <span className="text-2xl" aria-hidden="true">🎨</span>
          <span>Craft<b className="text-[var(--accent)]">Villa</b></span>
          <span className="hidden sm:inline-block text-xs font-sans font-medium text-[var(--mut)] pl-1.5 ml-1.5 border-l border-[var(--line)]">
            Artisan Gifts
          </span>
        </Link>

        {/* Live Search Bar */}
        <div ref={searchContainerRef} className="relative flex-1 max-w-xs md:max-w-sm hidden md:block">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--mut)]" />
            <input
              type="search"
              placeholder="Search gifts, wood, batik..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              className="w-full pl-9 pr-8 py-1.5 text-xs rounded-full border border-[var(--line)] bg-[var(--bg)] text-[var(--ink)] focus:outline-hidden focus:border-[var(--accent)] transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--mut)] hover:text-[var(--ink)]"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {/* Instant Search Dropdown Results */}
          {isSearchOpen && debouncedQuery && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--surface)] border border-[var(--line)] rounded-xl shadow-lg p-2 z-50 overflow-hidden">
              <div className="text-[11px] font-semibold text-[var(--mut)] px-2.5 py-1 uppercase tracking-wider">
                Matching Crafts ({searchResults.length})
              </div>
              {searchResults.length > 0 ? (
                <div className="space-y-1 mt-1">
                  {searchResults.map((item) => (
                    <Link
                      key={item.id}
                      href={`/products/${item.id}/customize`}
                      onClick={() => setIsSearchOpen(false)}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--bg)] transition-colors group"
                    >
                      <div
                        className="w-8 h-8 rounded-md flex items-center justify-center text-sm shrink-0"
                        style={{ backgroundColor: item.bgColor }}
                      >
                        {item.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-[var(--ink)] truncate group-hover:text-[var(--accent)]">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-[var(--mut)] truncate">
                          {item.artisanName} · LKR {item.basePrice.toLocaleString()}
                        </p>
                      </div>
                    </Link>
                  ))}
                  <Link
                    href={`/catalog?q=${encodeURIComponent(debouncedQuery)}`}
                    onClick={() => setIsSearchOpen(false)}
                    className="block text-center text-xs font-semibold text-[var(--accent)] py-2 border-t border-[var(--line)] mt-1 hover:underline"
                  >
                    View all catalog results →
                  </Link>
                </div>
              ) : (
                <div className="py-4 text-center text-xs text-[var(--mut)]">
                  No crafts match &quot;{debouncedQuery}&quot;
                </div>
              )}
            </div>
          )}
        </div>

        {/* Main Navigation Links */}
        <nav aria-label="Main Navigation" className="flex items-center gap-1 overflow-visible scrollbar-none">
          <Link
            href="/"
            aria-current={pathname === "/" ? "page" : undefined}
            className="text-xs font-medium px-2.5 py-1.5 rounded-full hover:bg-[var(--ink)]/5 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/catalog"
            aria-current={pathname === "/catalog" ? "page" : undefined}
            className="text-xs font-medium px-2.5 py-1.5 rounded-full hover:bg-[var(--ink)]/5 transition-colors"
          >
            All Crafts
          </Link>
          <Link
            href="/customizer"
            aria-current={pathname.startsWith("/customiz") || pathname.includes("/customize") ? "page" : undefined}
            className="text-xs font-medium px-2.5 py-1.5 rounded-full hover:bg-[var(--ink)]/5 transition-colors hidden sm:inline-flex"
          >
            Personalized Gifts
          </Link>
          <Link
            href="/hampers"
            aria-current={pathname === "/hampers" ? "page" : undefined}
            className="text-xs font-medium px-2.5 py-1.5 rounded-full hover:bg-[var(--ink)]/5 transition-colors hidden sm:inline-flex"
          >
            Gift Hampers
          </Link>
          <Link
            href="/artisans"
            aria-current={pathname.startsWith("/artisans") ? "page" : undefined}
            className="text-xs font-medium px-2.5 py-1.5 rounded-full hover:bg-[var(--ink)]/5 transition-colors hidden md:inline-flex"
          >
            Artisans
          </Link>
          <Link
            href="/track"
            aria-current={pathname.startsWith("/track") ? "page" : undefined}
            className="text-xs font-medium px-2.5 py-1.5 rounded-full hover:bg-[var(--ink)]/5 transition-colors"
          >
            Track Order
          </Link>

          {/* User Profile Avatar / Role Action Button */}
          {mounted && user ? (
            <div className="flex items-center gap-1.5 ml-1 pl-1 border-l border-[var(--line)]">
              {user.role === "ARTISAN" && (
                <Link
                  href="/artisan"
                  aria-current={pathname.startsWith("/artisan") ? "page" : undefined}
                  className="btn gold text-xs py-1 px-2.5 rounded-full whitespace-nowrap shadow-xs"
                >
                  Artisan Studio
                </Link>
              )}
              {user.role === "ADMIN" && (
                <Link
                  href="/admin"
                  aria-current={pathname.startsWith("/admin") ? "page" : undefined}
                  className="btn gold text-xs py-1 px-2.5 rounded-full whitespace-nowrap shadow-xs"
                >
                  Admin Panel
                </Link>
              )}
              {user.role === "CUSTOMER" && (
                <Link
                  href="/account"
                  aria-current={pathname === "/account" ? "page" : undefined}
                  className="flex items-center gap-1.5 text-xs font-semibold text-[var(--ink)] px-2.5 py-1 rounded-full bg-[var(--bg)] hover:border-[var(--line)] border border-transparent transition-colors"
                >
                  <UserIcon className="w-3.5 h-3.5 text-[var(--accent)]" />
                  <span>{user.name.split(" ")[0]}</span>
                </Link>
              )}
              <button
                type="button"
                onClick={handleSignOut}
                className="text-[11px] text-[var(--mut)] hover:text-[var(--ink)] p-1 transition-colors"
                title="Sign out"
              >
                Exit
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              aria-current={pathname === "/login" ? "page" : undefined}
              className="btn ghost text-xs py-1.5 px-3 rounded-full ml-1"
            >
              Sign In
            </Link>
          )}

          {/* Cart Trigger Badge */}
          <Link
            href="/cart"
            className="cartbtn flex items-center gap-1.5 text-xs font-bold bg-[var(--ink)] text-[var(--bg)] py-1.5 px-3 rounded-full ml-1 hover:opacity-90 transition-opacity"
            aria-label={`Shopping cart with ${cartCount} items`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cart</span>
            <b id="cc" className="bg-[var(--accent)] text-[var(--accent-ink)] text-[11px] px-1.5 py-0.2 rounded-full font-extrabold ml-0.5">
              {cartCount}
            </b>
          </Link>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-1.5 rounded-full text-[var(--mut)] hover:text-[var(--ink)] hover:bg-[var(--ink)]/5 transition-colors"
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            title="Toggle theme"
          >
            {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
        </nav>
      </div>
    </header>
  );
}
