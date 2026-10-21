import React from "react";
import Link from "next/link";
import { PRODUCTS } from "@/lib/data";
import { formatLKR } from "@/lib/utils";
import { Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";

export default function CustomizerHubPage() {
  const customizableProducts = PRODUCTS.filter((p) => p.customizable);

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--accent)] uppercase tracking-wider bg-[var(--accent)]/10 px-3 py-1 rounded-full">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Bespoke Studio</span>
        </div>
        <h2>Personalized Gifts &amp; Inscriptions</h2>
        <p className="sub text-base">
          Select a handmade Sri Lankan piece below to open our live 1:1 preview canvas. Inscribe family names, heartfelt wedding wishes, or etch a cherished photograph with wood stain finishes.
        </p>
      </div>

      {/* How It Works Banner */}
      <div className="panel bg-[var(--surface)] p-6 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-[var(--accent)] text-[var(--accent-ink)] font-bold flex items-center justify-center shrink-0 text-sm">
            1
          </div>
          <div>
            <h4 className="font-bold text-sm text-[var(--ink)]">Choose Heirloom Medium</h4>
            <p className="text-xs text-[var(--mut)] mt-1">Pick between aged plantation teak, resin botanical art, or leather parchment.</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-[var(--accent)] text-[var(--accent-ink)] font-bold flex items-center justify-center shrink-0 text-sm">
            2
          </div>
          <div>
            <h4 className="font-bold text-sm text-[var(--ink)]">Live Real-Time Proofing</h4>
            <p className="text-xs text-[var(--mut)] mt-1">Watch fonts, photo medallions, and timber stains update in real-time as you type.</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-[var(--ok)] text-white font-bold flex items-center justify-center shrink-0 text-sm">
            3
          </div>
          <div>
            <h4 className="font-bold text-sm text-[var(--ink)]">Approve Before Carving</h4>
            <p className="text-xs text-[var(--mut)] mt-1">The master artisan will only begin crafting after you give digital approval.</p>
          </div>
        </div>
      </div>

      {/* Customizable Products Grid */}
      <div className="space-y-4">
        <h3 className="text-xl">Select a Piece to Personalize</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          {customizableProducts.map((p) => (
            <div key={p.id} className="card p-4 flex flex-col justify-between group">
              <div>
                <div
                  className="thumb rounded-xl mb-3 group-hover:scale-102 transition-transform"
                  style={{ backgroundColor: p.bgColor }}
                >
                  {p.emoji}
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-[var(--ok)] font-semibold mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Live Preview Ready</span>
                </div>
                <h4 className="font-bold text-base text-[var(--ink)]">{p.name}</h4>
                <p className="text-xs text-[var(--mut)] mt-0.5">By {p.artisanName}</p>
                <p className="text-xs text-[var(--mut)] mt-2 line-clamp-2">
                  {p.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[var(--line)] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[var(--mut)] block">From</span>
                  <span className="font-bold text-sm text-[var(--ink)]">
                    {formatLKR(p.basePrice)}
                  </span>
                </div>
                <Link
                  href={`/products/${p.id}/customize`}
                  className="btn gold text-xs py-2 px-3.5 inline-flex items-center gap-1 shadow-xs"
                >
                  <span>Customize</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
