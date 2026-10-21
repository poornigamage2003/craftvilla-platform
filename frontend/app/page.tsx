"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { PRODUCTS } from "@/lib/data";
import ProductCard from "@/components/ProductCard";

const CATEGORIES = [
  "All",
  "Wood",
  "Ceramic",
  "Leather",
  "Batik",
  "Metal",
  "Resin",
  "Anniversary",
  "Birthday",
  "Corporate",
];

export default function HomePage() {
  const [filter, setFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredProducts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return PRODUCTS.filter((product) => {
      const matchesFilter =
        filter === "All" ||
        product.material === filter ||
        product.occasion === filter;

      const searchableText = `${product.name} ${product.material} ${product.occasion} ${product.artisanName} ${product.description}`.toLowerCase();
      const matchesQuery = !q || searchableText.includes(q);

      return matchesFilter && matchesQuery;
    });
  }, [filter, searchQuery]);

  const scrollToShop = () => {
    document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div>
          <h1>Gifts made by hand, with your words in them.</h1>
          <p>
            Pick a piece from a Sri Lankan craftsperson, add a name or a photo,
            check the proof, and follow it from the workshop to your door.
          </p>
          <div className="flex gap-3 flex-wrap">
            <Link href="/customize/teak-name-plaque" className="btn gold">
              Personalize a gift
            </Link>
            <button type="button" onClick={scrollToShop} className="btn ghost">
              Browse the catalog
            </button>
          </div>
        </div>

        <div className="plaque" aria-hidden="true">
          <span style={{ fontFamily: "var(--font-caveat), cursive", fontSize: "clamp(34px, 5vw, 54px)" }}>
            For Amma,
            <br />
            with love
            <br />
            – Nimal
          </span>
        </div>
      </section>

      {/* Catalog Section */}
      <section id="shop" className="pt-6">
        <h2>Catalog</h2>
        <p className="sub">Filter by material or occasion.</p>

        <input
          className="search"
          type="search"
          placeholder="Search gifts, materials or artisans"
          aria-label="Search gifts, materials or artisans"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="chips" role="group" aria-label="Filter products">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className="chip"
              aria-pressed={filter === cat}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="empty">
            No gifts match. Clear the search or pick another filter.
          </p>
        )}
      </section>
    </div>
  );
}
