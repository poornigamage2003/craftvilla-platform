"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { PRODUCTS, ARTISANS } from "@/lib/data";
import ProductCard from "@/components/ProductCard";
import { Sparkles, ArrowRight, ShieldCheck, Star, Users, HeartHandshake, PackageCheck, Award } from "lucide-react";

const CATEGORY_SHOWCASE = [
  {
    name: "Woodwork & Carvings",
    material: "Wood",
    emoji: "🪵",
    bgColor: "#e7cfa8",
    description: "Solid plantation teak & mahogany hand-carved with traditional joinery.",
    count: "18+ Pieces",
  },
  {
    name: "Resin Floral Art",
    material: "Resin",
    emoji: "🔮",
    bgColor: "#bfe3e0",
    description: "Crystal resin embedding natural pressed flowers & personal photographs.",
    count: "12+ Pieces",
  },
  {
    name: "Wheel-Thrown Pottery",
    material: "Ceramic",
    emoji: "🪔",
    bgColor: "#f1c9b2",
    description: "Terracotta ceremonial lamps and tableware wood-fired in clay kilns.",
    count: "15+ Pieces",
  },
  {
    name: "Wax-Resist Batik",
    material: "Batik",
    emoji: "🎨",
    bgColor: "#c9d4f0",
    description: "Hand-waxed textiles dyed with natural botanical and azo-free pigments.",
    count: "14+ Pieces",
  },
];

const CUSTOMER_REVIEWS = [
  {
    id: 1,
    name: "Dr. Kavinda Jayawardena",
    location: "Colombo 07",
    item: "Teak Name Plaque",
    rating: 5,
    date: "October 2026",
    comment:
      "Ordered a customized plaque for our clinic anniversary. The live proofing tool gave me total confidence, and the physical teak finish was even more breathtaking in person. Truly master-level craftsmanship.",
  },
  {
    id: 2,
    name: "Shenali Senaratne",
    location: "Kandy",
    item: "Handcrafted Gift Hamper",
    rating: 5,
    date: "October 2026",
    comment:
      "Built a custom birthday hamper with a leather journal and resin coasters. The handwritten card and wax seal packaging felt like a royal gift. Delivered right on time across the island!",
  },
  {
    id: 3,
    name: "Ruwan Wijesinghe",
    location: "Galle Fort",
    item: "Ceramic Oil Lamp Set",
    rating: 5,
    date: "September 2026",
    comment:
      "Knowing that over 85% of what I paid goes directly to rural potters in Kegalle makes this purchase feel meaningful. The tracking stepper kept me updated through every stage of crafting.",
  },
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"All" | "Wood" | "Batik" | "Ceramic" | "Resin">("All");
  const [heroInscription, setHeroInscription] = useState("For Amma, with endless love – Nimal & Family");

  const filteredTrending = activeTab === "All"
    ? PRODUCTS.slice(0, 6)
    : PRODUCTS.filter((p) => p.material === activeTab);

  return (
    <div className="space-y-16">
      {/* 1. Hero Section */}
      <section className="hero pt-4 pb-8 items-center">
        {/* Hero Left Content with Smooth Entrance */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent)]/15 border border-[var(--accent)]/30 text-[#172554] dark:text-amber-200 text-xs font-bold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#E5A93C]" />
            <span>Sri Lanka&apos;s Premier Bespoke Craft Platform</span>
          </div>

          {/* Main Headline with Playfair Display Serif Typography */}
          <h1
            className="text-4xl sm:text-5xl lg:text-[56px] font-normal tracking-tight text-[#172554] dark:text-[#f1f2fa] leading-[1.14] mb-4"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Gifts made by hand, with your words in them.
          </h1>

          <p className="mt-3 text-[var(--mut)] text-lg leading-relaxed max-w-xl">
            Choose an artisanal masterpiece from a rural Sri Lankan maker, personalize it with custom engravings or etched photos, approve your live digital proof, and track its creation from workshop chisel to your doorstep.
          </p>

          {/* CTA Buttons */}
          <div className="flex gap-3 flex-wrap mt-6 items-center">
            <Link
              href="/products/teak-name-plaque/customize"
              className="btn gold flex items-center gap-2 text-sm sm:text-base font-bold px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all"
              style={{ backgroundColor: "#E5A93C", color: "#172554" }}
            >
              <span>Personalize a Gift</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/catalog"
              className="btn ghost text-sm sm:text-base font-semibold px-6 py-3 rounded-xl hover:border-[#172554] transition-all"
            >
              Explore All Crafts
            </Link>
          </div>

          {/* Interactive Live Inscription Test Box */}
          <div className="mt-7 max-w-xl">
            <div className="flex items-center gap-2 p-1.5 pl-3.5 bg-white/85 dark:bg-stone-900/70 backdrop-blur-md rounded-full border border-stone-200/90 dark:border-stone-800 shadow-xs focus-within:ring-2 focus-within:ring-[#E5A93C]/40 focus-within:border-[#E5A93C] transition-all">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#172554] dark:text-amber-300 shrink-0 select-none">
                <Sparkles className="w-3.5 h-3.5 text-[#E5A93C]" />
                <span className="hidden sm:inline">Try your custom message:</span>
                <span className="sm:hidden">Try message:</span>
              </div>
              <input
                type="text"
                value={heroInscription}
                onChange={(e) => setHeroInscription(e.target.value)}
                placeholder="Type here..."
                maxLength={65}
                className="flex-1 min-w-0 bg-transparent px-2.5 py-1 text-sm text-[#172554] dark:text-stone-100 placeholder:text-stone-400 focus:outline-none border-none font-medium"
                aria-label="Try your custom message on the plaque"
              />
              {heroInscription && (
                <button
                  type="button"
                  onClick={() => setHeroInscription("")}
                  className="w-6 h-6 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 text-xs mr-1 transition-colors"
                  title="Clear text"
                  aria-label="Clear custom message"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Quick Preset Message Chips */}
            <div className="flex items-center gap-2 mt-2.5 pl-1 flex-wrap">
              <span className="text-[11px] text-[var(--mut)] font-medium">Try:</span>
              {[
                "For Amma, with endless love",
                "Mr. & Mrs. Perera · Est. 2026",
                "To My Hero Thatha",
                "Ayubowan · Galle Fort",
              ].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setHeroInscription(preset)}
                  className="text-[11px] px-2.5 py-0.5 rounded-full bg-stone-200/60 dark:bg-stone-800/60 text-[#172554] dark:text-stone-300 hover:bg-amber-100 hover:text-amber-900 dark:hover:bg-amber-950/60 dark:hover:text-amber-200 transition-colors cursor-pointer border border-transparent hover:border-amber-300/40"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Trust Badges */}
          <div className="flex items-center gap-6 mt-7 pt-5 border-t border-[var(--line)] text-xs text-[var(--mut)] flex-wrap">
            <div className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-[var(--ok)]" />
              <span>Verified Fair-Trade</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <Award className="w-4 h-4 text-[#E5A93C]" />
              <span>Approval Before Crafting</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <PackageCheck className="w-4 h-4 text-[var(--teak)]" />
              <span>Island-wide Transit</span>
            </div>
          </div>
        </motion.div>

        {/* Hero Plaque Container with Fade-in-up Entrance & Floating Breathing Loop */}
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-lg mx-auto"
        >
          {/* Continuous breathing float animation: animate y from 0 to -6 to 0 over 4s */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative"
          >
            {/* Floating Badge / Wax-Seal Stamp Accent at Corner */}
            <div
              className="absolute top-2 right-2 sm:-top-4 sm:-right-4 z-20 flex items-center justify-center rounded-full shadow-xl shadow-stone-900/30 rotate-6 hover:rotate-0 transition-transform duration-300 select-none cursor-default group w-20 h-20 sm:w-[90px] sm:h-[90px]"
              style={{
                background: "radial-gradient(circle at 35% 35%, #a53222 0%, #7d1c10 70%, #4a0d06 100%)",
                border: "2px solid rgba(245, 158, 11, 0.45)",
                boxShadow:
                  "inset 0 1px 2px rgba(255, 255, 255, 0.4), inset 0 -2px 5px rgba(0, 0, 0, 0.65), 0 10px 25px -5px rgba(0, 0, 0, 0.45)",
              }}
              title="100% Certified Ceylon Teak"
            >
              <div className="w-[66px] h-[66px] sm:w-[76px] sm:h-[76px] rounded-full border border-dashed border-amber-300/60 flex flex-col items-center justify-center p-1 text-center">
                <span className="text-[6.5px] sm:text-[7.5px] font-bold uppercase tracking-widest text-amber-200/90 leading-none mb-0.5">
                  100% Certified
                </span>
                <span
                  className="text-[9.5px] sm:text-[11px] font-serif font-black tracking-wider text-amber-100 uppercase leading-none my-0.5"
                  style={{ textShadow: "0 1px 2px rgba(0,0,0,0.8)" }}
                >
                  Ceylon
                </span>
                <span className="text-[7.5px] sm:text-[8.5px] font-bold uppercase tracking-wider text-amber-300/90 leading-none">
                  Teak
                </span>
                <span className="text-[6px] sm:text-[6.5px] tracking-widest text-amber-200/75 uppercase mt-0.5">
                  ★ Verified ★
                </span>
              </div>
            </div>

            {/* Realistic Handcrafted Wooden Plaque Container */}
            <div
              className="plaque shadow-2xl shadow-stone-900/15 relative overflow-hidden rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center p-8 sm:p-12 aspect-4/3 text-center"
              style={{
                background: "linear-gradient(135deg, #c79054 0%, #ad763e 28%, #8f5727 65%, #b5814b 100%)",
                boxShadow:
                  "inset 0 1.5px 2px rgba(255, 255, 255, 0.4), inset 0 -3px 8px rgba(0, 0, 0, 0.45), 0 25px 50px -12px rgba(28, 25, 23, 0.25)",
              }}
              aria-label="Live preview of engraved Ceylon teak plaque"
            >
              {/* Routed decorative groove border inside plaque */}
              <div className="absolute inset-3 sm:inset-4 rounded-xl sm:rounded-2xl border border-amber-950/20 pointer-events-none shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)]" />

              {/* Subtle wood grain texture overlay */}
              <div className="absolute inset-0 opacity-20 pointer-events-none bg-[repeating-linear-gradient(93deg,transparent_0px,transparent_11px,rgba(0,0,0,0.06)_11px,rgba(0,0,0,0.06)_12px,transparent_12px,transparent_24px,rgba(255,255,255,0.04)_24px,rgba(255,255,255,0.04)_25px)]" />

              {/* Brass Fastener Accents at 4 corners */}
              <div className="absolute top-4 left-4 w-2 h-2 rounded-full bg-amber-300/70 shadow-[0_1px_2px_rgba(0,0,0,0.4)] pointer-events-none" />
              <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-amber-300/70 shadow-[0_1px_2px_rgba(0,0,0,0.4)] pointer-events-none" />
              <div className="absolute bottom-4 left-4 w-2 h-2 rounded-full bg-amber-300/70 shadow-[0_1px_2px_rgba(0,0,0,0.4)] pointer-events-none" />
              <div className="absolute bottom-4 right-4 w-2 h-2 rounded-full bg-amber-300/70 shadow-[0_1px_2px_rgba(0,0,0,0.4)] pointer-events-none" />

              {/* Live Inscription with Real-time Smooth Morphing & Multi-layer Text Shadows */}
              <motion.div
                key={heroInscription}
                initial={{ opacity: 0.85, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="relative z-10 w-full flex flex-col items-center justify-center"
              >
                <span
                  style={{
                    fontFamily: "var(--font-caveat), cursive",
                    textShadow: "1px 1px 1px rgba(255, 255, 255, 0.35), -1px -1px 1px rgba(0, 0, 0, 0.55)",
                    color: "rgba(45, 20, 5, 0.92)",
                  }}
                  className="text-2xl sm:text-3xl lg:text-[42px] leading-[1.2] whitespace-pre-line break-words max-w-[90%] text-center select-none"
                >
                  {(() => {
                    const trimmed = heroInscription.trim();
                    if (!trimmed) {
                      return (
                        <span className="opacity-40 italic text-xl sm:text-2xl">
                          Type your custom words above...
                        </span>
                      );
                    }
                    if (trimmed.includes("\n")) {
                      return trimmed;
                    }
                    if (trimmed.includes("–") || trimmed.includes(" - ")) {
                      const delimiter = trimmed.includes("–") ? "–" : " - ";
                      const parts = trimmed.split(delimiter);
                      return (
                        <>
                          <span>{parts[0].trim()}</span>
                          {parts.length > 1 && parts.slice(1).join(delimiter).trim() && (
                            <>
                              <br />
                              <span className="text-xl sm:text-2xl opacity-90 inline-block mt-0.5">
                                – {parts.slice(1).join(delimiter).trim()}
                              </span>
                            </>
                          )}
                        </>
                      );
                    }
                    return trimmed;
                  })()}
                </span>
              </motion.div>

              {/* Subtle bottom finish badge */}
              <div className="absolute bottom-3 left-4 z-10 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-950/40 backdrop-blur-xs border border-amber-400/20 text-[#FAF8F5] text-[10px] font-medium pointer-events-none">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>Hand-oiled Teak Finish</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* 2. Category Showcase Grid */}
      <section className="space-y-6">
        <div className="flex justify-between items-end flex-wrap gap-4">
          <div>
            <h2 className="text-3xl">Artisanal Craft Disciplines</h2>
            <p className="sub mt-1">Explore authentic traditional media kept alive across generations.</p>
          </div>
          <Link href="/catalog" className="text-sm font-bold text-[var(--accent)] hover:underline inline-flex items-center gap-1">
            Browse full catalog <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORY_SHOWCASE.map((cat) => (
            <Link
              key={cat.material}
              href={`/catalog?material=${cat.material}`}
              className="panel group hover:border-[var(--ink)] transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-105 transition-transform"
                  style={{ backgroundColor: cat.bgColor }}
                >
                  {cat.emoji}
                </div>
                <h3 className="text-lg font-bold text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-[var(--mut)] mt-1.5 leading-relaxed">
                  {cat.description}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[var(--line)] flex justify-between items-center text-xs font-semibold text-[var(--mut)]">
                <span>{cat.count}</span>
                <span className="group-hover:translate-x-1 transition-transform text-[var(--ink)]">Explore →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Featured Verified Artisans */}
      <section className="space-y-6">
        <div className="flex justify-between items-end flex-wrap gap-4">
          <div>
            <h2 className="text-3xl">Meet Our Master Makers</h2>
            <p className="sub mt-1">Every artisan is verified for heritage technique, ethics, and material purity.</p>
          </div>
          <Link href="/artisans" className="text-sm font-bold text-[var(--accent)] hover:underline inline-flex items-center gap-1">
            View all 6 artisans <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ARTISANS.slice(0, 3).map((artisan) => (
            <article key={artisan.id} className="card p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="av w-12 h-12 text-lg font-bold">
                  {artisan.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-[var(--ink)] leading-snug">
                    {artisan.name}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-[var(--mut)]">
                    <span>{artisan.location}</span>
                    <span>·</span>
                    <span className="flex items-center text-[var(--accent)] font-semibold">
                      <Star className="w-3 h-3 fill-current inline mr-0.5" />
                      {artisan.rating}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-[var(--mut)] leading-relaxed mb-4 flex-1">
                {artisan.bio}
              </p>
              <div className="pt-3 border-t border-[var(--line)] flex items-center justify-between">
                <span className="text-xs text-[var(--ok)] font-semibold">
                  ✓ Verified Studio
                </span>
                <Link
                  href={`/artisans/${artisan.slug}`}
                  className="btn ghost text-xs py-1.5 px-3"
                >
                  View Pieces
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 4. Trending Bespoke Gifts */}
      <section className="space-y-6">
        <div className="flex justify-between items-end flex-wrap gap-4">
          <div>
            <h2 className="text-3xl">Trending Bespoke Gifts</h2>
            <p className="sub mt-1">Personalized with names, dates, or photos before crafting.</p>
          </div>
          {/* Material Filter Tabs */}
          <div className="flex gap-2 flex-wrap">
            {(["All", "Wood", "Batik", "Ceramic", "Resin"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                className={`chip text-xs py-1 px-3 ${activeTab === tab ? "active font-bold" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid">
          {filteredTrending.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. Social Proof & Impact Statistics */}
      <section className="panel bg-[var(--ink)] text-[var(--bg)] p-8 md:p-12 rounded-3xl relative overflow-hidden">
        <div className="max-w-2xl mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent)] block mb-1">
            Empowering Rural Sri Lanka
          </span>
          <h2 className="text-2xl md:text-4xl text-[var(--bg)] font-serif">
            Every bespoke order directly fuels generational heritage workshops.
          </h2>
        </div>

        {/* Impact Numbers */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-y border-[var(--bg)]/15 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-5 h-5 text-[var(--accent)]" />
              <b className="text-3xl font-serif text-[var(--bg)]">50+</b>
            </div>
            <p className="text-xs text-[var(--bg)]/70">Rural Artisan Families Sustained</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <PackageCheck className="w-5 h-5 text-[var(--ok)]" />
              <b className="text-3xl font-serif text-[var(--bg)]">1,400+</b>
            </div>
            <p className="text-xs text-[var(--bg)]/70">Custom Proofs Approved &amp; Delivered</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <HeartHandshake className="w-5 h-5 text-[var(--accent)]" />
              <b className="text-3xl font-serif text-[var(--bg)]">85%+</b>
            </div>
            <p className="text-xs text-[var(--bg)]/70">Proceeds Direct to Craftsperson</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Star className="w-5 h-5 text-amber-300 fill-current" />
              <b className="text-3xl font-serif text-[var(--bg)]">4.9 / 5</b>
            </div>
            <p className="text-xs text-[var(--bg)]/70">Customer Happiness Rating</p>
          </div>
        </div>

        {/* Customer Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {CUSTOMER_REVIEWS.map((review) => (
            <div
              key={review.id}
              className="bg-[var(--surface)] text-[var(--ink)] p-5 rounded-2xl shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex text-amber-500">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-[11px] text-[var(--ok)] font-bold">✓ Verified Purchase</span>
                </div>
                <p className="text-xs italic text-[var(--ink)] leading-relaxed mb-4">
                  &ldquo;{review.comment}&rdquo;
                </p>
              </div>
              <div className="pt-2 border-t border-[var(--line)] text-xs">
                <p className="font-bold text-[var(--ink)]">{review.name}</p>
                <p className="text-[11px] text-[var(--mut)]">{review.item} · {review.location}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
