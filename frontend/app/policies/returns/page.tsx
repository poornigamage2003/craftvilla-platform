import React from "react";
import Link from "next/link";
import { ShieldAlert, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";

export default function ReturnsPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--accent)] uppercase tracking-wider bg-[var(--accent)]/10 px-3 py-1 rounded-full">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Transparent Consumer Terms</span>
        </div>
        <h2>Bespoke &amp; Custom Goods Policy</h2>
        <p className="sub text-sm max-w-xl mx-auto">
          Because personalized crafts are permanently laser-etched, hand-carved, and cast to your unique specifications, our return terms balance customer peace of mind with artisan protection.
        </p>
      </div>

      {/* Proof Approval Binding Rule */}
      <div className="panel border-l-4 border-l-[var(--accent)] space-y-3 p-6">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-[var(--accent)]" />
          <h3 className="text-base font-bold text-[var(--ink)]">1. The Proof Approval Commitment</h3>
        </div>
        <p className="text-xs text-[var(--mut)] leading-relaxed">
          Before any piece is carved, dyed, or assembled, you must approve the digital proof in our customizer. <b>Once you approve the digital proof and your order enters &quot;IN_CRAFTING&quot;, the order cannot be cancelled or refunded for changes of mind</b>, as raw timber has been cut and materials permanently committed.
        </p>
      </div>

      {/* When Returns & Free Remakes ARE Granted */}
      <div className="panel space-y-4 p-6">
        <h3 className="text-base font-bold text-[var(--ok)] flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          <span>2. Full Remake &amp; Refund Guarantees</span>
        </h3>
        <p className="text-xs text-[var(--mut)]">
          CraftVilla guarantees 100% free workshop remake or full refund under the following conditions:
        </p>
        <ul className="space-y-2 text-xs text-[var(--ink)]">
          <li className="flex items-start gap-2">
            <span className="text-[var(--ok)] font-bold">✓</span>
            <span><b>Artisan Inscription Error:</b> The spelling or date on the physical piece does not match your approved digital proof.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[var(--ok)] font-bold">✓</span>
            <span><b>Transit Damage:</b> The item arrives cracked, chipped, or shattered by the courier.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[var(--ok)] font-bold">✓</span>
            <span><b>Material Flaw:</b> Unacceptable structural defects (e.g. split teak or defective brass casting) prior to delivery.</span>
          </li>
        </ul>
      </div>

      {/* Claim Window & Resolution Stepper */}
      <div className="panel space-y-3 p-6">
        <h3 className="text-base font-bold text-[var(--ink)]">3. How to File a Dispute</h3>
        <p className="text-xs text-[var(--mut)] leading-relaxed">
          Please notify our concierge team within <b>48 hours of parcel delivery</b> with clear photographs of the defect and packaging. Our Platform Admin resolves disputes within 2 business days.
        </p>
        <div className="pt-2">
          <Link href="/contact" className="btn gold text-xs py-2 px-4 inline-flex items-center gap-1.5">
            <span>Contact Support / File Dispute</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
