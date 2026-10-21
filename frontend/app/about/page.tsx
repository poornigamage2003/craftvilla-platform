import React from "react";
import Link from "next/link";
import { HeartHandshake, ShieldCheck, Sparkles, MapPin, Award, ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-12 py-4">
      {/* Hero Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--accent)] uppercase tracking-wider bg-[var(--accent)]/10 px-3 py-1 rounded-full">
          <HeartHandshake className="w-3.5 h-3.5" />
          <span>Our Heritage &amp; Fair-Trade Mission</span>
        </div>
        <h2>Empowering the Hands That Shape Sri Lanka</h2>
        <p className="sub text-base max-w-xl mx-auto">
          CraftVilla was established as a student initiative for Poorni Gamage to bridge rural Sri Lankan master craftspersons with personalized modern gifting.
        </p>
      </div>

      {/* Origin Story Panel */}
      <div className="panel space-y-4">
        <h3 className="text-xl">The CraftVilla Story</h3>
        <p className="text-sm text-[var(--mut)] leading-relaxed">
          Across the valleys of Kandy, the coastal villages of Weligama, and the red clay riverbanks of Kegalle, master artisans carry centuries of wood joinery, wheel-thrown terracotta, and wax-resist batik. Yet for generations, middlemen took up to 80% of sales, while modern consumers lacked any way to personalize handcrafted gifts.
        </p>
        <p className="text-sm text-[var(--mut)] leading-relaxed">
          CraftVilla reimagines this model. By offering our proprietary digital 1:1 customizer with proof approval, buyers can inscribe names and etch memories into heirloom pieces, while our verified artisans receive over 85% of each sale directly to their workshops.
        </p>
      </div>

      {/* 3 Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="panel space-y-2 text-center p-6">
          <ShieldCheck className="w-8 h-8 text-[var(--ok)] mx-auto mb-2" />
          <h4 className="font-bold text-base text-[var(--ink)]">100% Ethical Pay</h4>
          <p className="text-xs text-[var(--mut)] leading-relaxed">
            All artisans set their own base prices and retain dignity of labour with prompt disbursements.
          </p>
        </div>

        <div className="panel space-y-2 text-center p-6">
          <Award className="w-8 h-8 text-[var(--accent)] mx-auto mb-2" />
          <h4 className="font-bold text-base text-[var(--ink)]">Material Authenticity</h4>
          <p className="text-xs text-[var(--mut)] leading-relaxed">
            Certified sustainable plantation timber, chemical-free vegetable tanned leather, and natural plant dyes.
          </p>
        </div>

        <div className="panel space-y-2 text-center p-6">
          <Sparkles className="w-8 h-8 text-[var(--teak)] mx-auto mb-2" />
          <h4 className="font-bold text-base text-[var(--ink)]">Zero Guesswork Proofs</h4>
          <p className="text-xs text-[var(--mut)] leading-relaxed">
            Every customer reviews and approves their bespoke digital proof before an artisan lifts a chisel or wax pen.
          </p>
        </div>
      </div>

      {/* Workshop Regional Centers */}
      <div id="standards" className="panel space-y-4">
        <h3 className="text-xl">Artisanal Regional Hubs</h3>
        <div className="space-y-3 text-xs">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-[var(--bg)] border border-[var(--line)]">
            <MapPin className="w-4 h-4 text-[var(--accent)] shrink-0 mt-0.5" />
            <div>
              <b className="text-[var(--ink)] block text-sm">Central Province (Kandy &amp; Matale)</b>
              <p className="text-[var(--mut)] mt-0.5">
                Traditional Teak &amp; Mahogany woodcarving, chased brass platters, and ritual oil lamp casting.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-[var(--bg)] border border-[var(--line)]">
            <MapPin className="w-4 h-4 text-[var(--accent)] shrink-0 mt-0.5" />
            <div>
              <b className="text-[var(--ink)] block text-sm">Southern Coast (Galle &amp; Weligama)</b>
              <p className="text-[var(--mut)] mt-0.5">
                Vegetable-tanned leather journals inside Galle Fort and hand-waxed coastal cotton batik tapestries.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-[var(--bg)] border border-[var(--line)]">
            <MapPin className="w-4 h-4 text-[var(--accent)] shrink-0 mt-0.5" />
            <div>
              <b className="text-[var(--ink)] block text-sm">Western River Valleys (Kegalle &amp; Negombo)</b>
              <p className="text-[var(--mut)] mt-0.5">
                Alluvial wheel-thrown clay terracotta pottery and pressed-flower botanical UV resin coasters.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center pt-4">
        <Link href="/artisans" className="btn gold px-8 text-sm font-bold inline-flex items-center gap-2">
          <span>Explore Verified Artisan Profiles</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
