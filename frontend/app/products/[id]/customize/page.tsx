import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PRODUCTS } from "@/lib/data";
import Customizer from "@/components/Customizer";
import { ArrowLeft, Clock, ShieldCheck, Sparkles } from "lucide-react";

interface ProductCustomizePageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({
    id: p.id,
  }));
}

export default async function ProductCustomizePage({ params }: ProductCustomizePageProps) {
  const { id } = await params;
  const product = PRODUCTS.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--line)]">
        <Link
          href="/catalog"
          className="text-xs font-semibold text-[var(--mut)] hover:text-[var(--ink)] inline-flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Craft Catalog</span>
        </Link>

        {/* Quick customizable craft switcher */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--mut)] mr-1 shrink-0">
            Switch Craft:
          </span>
          {PRODUCTS.slice(0, 5).map((p) => (
            <Link
              key={p.id}
              href={`/products/${p.id}/customize`}
              className={`chip text-xs py-1 px-2.5 shrink-0 ${p.id === id ? "active font-bold" : ""}`}
            >
              {p.emoji} {p.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--accent)] uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Bespoke Studio</span>
          </div>
          <h2>Personalize: {product.name}</h2>
          <p className="sub mt-0.5">
            Handcrafted by <b>{product.artisanName}</b> · {product.material} · Dimensions: {product.dimensions || "Bespoke Sizing"}
          </p>
        </div>

        {/* Lead Time & Guarantee Badge */}
        <div className="flex items-center gap-4 bg-[var(--surface)] border border-[var(--line)] px-4 py-2 rounded-xl text-xs">
          <div className="flex items-center gap-1.5 text-[var(--ink)] font-semibold">
            <Clock className="w-4 h-4 text-[var(--accent)]" />
            <span>Lead time: {product.leadTimeDays} days</span>
          </div>
          <div className="border-l border-[var(--line)] pl-4 flex items-center gap-1.5 text-[var(--ok)] font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span>Proof Approval Guarantee</span>
          </div>
        </div>
      </div>

      {/* Customizer Core Component */}
      <Customizer product={product} />
    </div>
  );
}
