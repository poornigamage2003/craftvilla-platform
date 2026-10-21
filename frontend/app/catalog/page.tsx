"use client";

import React, { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PRODUCTS } from "@/lib/data";
import { formatLKR } from "@/lib/utils";
import { SlidersHorizontal, RotateCcw, Clock, Sparkles } from "lucide-react";

const MATERIALS = ["All", "Wood", "Ceramic", "Leather", "Batik", "Metal", "Resin"];
const PERSONALIZATION_TYPES = ["All", "Engraving", "Photo Etching", "Text Stamp", "Hand-painted"];
const LEAD_TIMES = [
  { label: "All Lead Times", value: "all" },
  { label: "⚡ Express Crafting (1-2 days)", value: "express" },
  { label: "⏳ Standard Artisanal (3-5 days)", value: "standard" },
];

function CatalogContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialMaterial = searchParams.get("material") || "All";

  const [search, setSearch] = useState(initialQuery);
  const [selectedMaterial, setSelectedMaterial] = useState(initialMaterial);
  const [selectedPersonalization, setSelectedPersonalization] = useState("All");
  const [selectedLeadTime, setSelectedLeadTime] = useState("all");
  const [maxPrice, setMaxPrice] = useState<number>(7500);

  // Faceted Filtering
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // 1. Material
      if (selectedMaterial !== "All" && product.material !== selectedMaterial) {
        return false;
      }
      // 2. Personalization Type (inferred from name & description)
      if (selectedPersonalization !== "All") {
        if (selectedPersonalization === "Engraving" && !product.name.toLowerCase().includes("plaque") && !product.name.toLowerCase().includes("pen") && !product.name.toLowerCase().includes("tray")) {
          return false;
        }
        if (selectedPersonalization === "Photo Etching" && !product.name.toLowerCase().includes("coaster") && !product.name.toLowerCase().includes("plaque")) {
          return false;
        }
        if (selectedPersonalization === "Text Stamp" && !product.name.toLowerCase().includes("journal") && !product.name.toLowerCase().includes("lamp")) {
          return false;
        }
      }
      // 3. Price Slider
      if (product.basePrice > maxPrice) {
        return false;
      }
      // 4. Lead Time
      if (selectedLeadTime === "express" && product.leadTimeDays > 2) {
        return false;
      }
      if (selectedLeadTime === "standard" && product.leadTimeDays <= 2) {
        return false;
      }
      // 5. Text Search Query
      if (search.trim()) {
        const q = search.toLowerCase();
        const haystack = `${product.name} ${product.material} ${product.occasion} ${product.artisanName} ${product.description}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [search, selectedMaterial, selectedPersonalization, selectedLeadTime, maxPrice]);

  const handleResetFilters = () => {
    setSearch("");
    setSelectedMaterial("All");
    setSelectedPersonalization("All");
    setSelectedLeadTime("all");
    setMaxPrice(7500);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--accent)] uppercase tracking-wider mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Authentic Sri Lankan Handicrafts</span>
        </div>
        <h2>All Handcrafted Creations</h2>
        <p className="sub">
          Explore heirloom quality crafts with customizable inscriptions, fine timber finishes, and verified artisan provenance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Left: Faceted Filter Panel */}
        <aside className="panel lg:sticky lg:top-20 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
            <div className="flex items-center gap-2 font-bold text-sm text-[var(--ink)]">
              <SlidersHorizontal className="w-4 h-4 text-[var(--accent)]" />
              <span>Faceted Filters</span>
            </div>
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs text-[var(--mut)] hover:text-[var(--ink)] flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Search within catalog */}
          <div>
            <label htmlFor="cat-search" className="text-xs font-bold uppercase tracking-wider text-[var(--mut)] mb-1.5 block">
              Search Keyword
            </label>
            <input
              id="cat-search"
              type="search"
              placeholder="Search by name, wood, maker..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-xs py-2"
            />
          </div>

          {/* 1. Material Filter */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--mut)] mb-2 block">
              Material Media
            </span>
            <div className="flex flex-wrap gap-1.5">
              {MATERIALS.map((mat) => (
                <button
                  key={mat}
                  type="button"
                  className={`chip text-xs py-1 px-2.5 ${selectedMaterial === mat ? "active font-bold" : ""}`}
                  onClick={() => setSelectedMaterial(mat)}
                >
                  {mat}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Personalization Type Filter */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--mut)] mb-2 block">
              Personalization Type
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PERSONALIZATION_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  className={`chip text-xs py-1 px-2.5 ${selectedPersonalization === type ? "active font-bold" : ""}`}
                  onClick={() => setSelectedPersonalization(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Price Slider */}
          <div>
            <div className="flex justify-between items-center mb-1.5 text-xs">
              <span className="font-bold uppercase tracking-wider text-[var(--mut)]">
                Max Budget
              </span>
              <span className="font-bold text-[var(--ink)]">{formatLKR(maxPrice)}</span>
            </div>
            <input
              type="range"
              min={1500}
              max={7500}
              step={200}
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value, 10))}
              className="w-full accent-[var(--accent)] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-[var(--mut)] mt-1">
              <span>LKR 1,500</span>
              <span>LKR 7,500</span>
            </div>
          </div>

          {/* 4. Crafting Lead Time */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--mut)] mb-2 block flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>Crafting Lead Time</span>
            </span>
            <div className="space-y-1.5 text-xs">
              {LEAD_TIMES.map((lt) => (
                <label key={lt.value} className="flex items-center gap-2 cursor-pointer text-[var(--ink)] hover:text-[var(--accent)]">
                  <input
                    type="radio"
                    name="leadTime"
                    value={lt.value}
                    checked={selectedLeadTime === lt.value}
                    onChange={(e) => setSelectedLeadTime(e.target.value)}
                    className="accent-[var(--accent)]"
                  />
                  <span>{lt.label}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Right: Products Grid */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between text-xs text-[var(--mut)] pb-2 border-b border-[var(--line)]">
            <span>
              Showing <b className="text-[var(--ink)]">{filteredProducts.length}</b> handcrafted pieces
            </span>
            {(selectedMaterial !== "All" || selectedPersonalization !== "All" || selectedLeadTime !== "all" || search) && (
              <span className="text-[var(--ok)] font-medium">✓ Filter applied</span>
            )}
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {filteredProducts.map((product) => (
                <article key={product.id} className="card group flex flex-col justify-between">
                  <div>
                    <div
                      className="thumb relative group-hover:scale-102 transition-transform"
                      style={{ backgroundColor: product.bgColor }}
                      aria-hidden="true"
                    >
                      <span>{product.emoji}</span>
                      <span className="absolute top-2.5 right-2.5 badge text-[10px] bg-white/80 dark:bg-black/60 shadow-xs">
                        ⚡ {product.leadTimeDays}d Craft
                      </span>
                    </div>

                    <div className="in pb-1">
                      <span className="badge">Customizable</span>
                      <h3 className="text-base font-bold text-[var(--ink)] mt-1">
                        {product.name}
                      </h3>
                      <small className="text-[var(--mut)]">
                        By {product.artisanName} · {product.material}
                      </small>
                      <p className="text-xs text-[var(--mut)] mt-2 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 pt-2 mt-auto border-t border-[var(--line)]/60 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[var(--mut)] block uppercase tracking-wider">Starting at</span>
                      <span className="font-bold text-sm text-[var(--ink)]">
                        {formatLKR(product.basePrice)}
                      </span>
                    </div>
                    <Link
                      href={`/products/${product.id}/customize`}
                      className="btn gold text-xs py-2 px-3.5 shadow-xs"
                      aria-label={`Customize and buy ${product.name}`}
                    >
                      Customize &amp; Buy
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="panel empty py-16 text-center space-y-4">
              <p className="text-base text-[var(--ink)]">
                No crafts match your current filter selections.
              </p>
              <p className="text-xs text-[var(--mut)] max-w-sm mx-auto">
                Try loosening your price slider or changing the material selection.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="btn ghost text-xs py-2 px-4"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="panel empty">Loading craft catalog...</div>}>
      <CatalogContent />
    </Suspense>
  );
}
