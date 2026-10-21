import React from "react";
import Link from "next/link";
import { Heart, ShieldCheck, Truck, RefreshCw, MapPin, Globe, Share2, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[var(--surface)] border-t border-[var(--line)] text-[var(--ink)] mt-16 transition-colors">
      {/* Value Proposition Ribbon */}
      <div className="border-b border-[var(--line)] py-8 px-5 bg-[var(--bg)]/40">
        <div className="max-w-[1120px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-[var(--accent)] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[var(--ink)]">100% Verified Artisans</h4>
              <p className="text-xs text-[var(--mut)] mt-1">Directly empowering master makers across rural Sri Lanka.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-[var(--ok)] shrink-0">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[var(--ink)]">Bespoke Customization</h4>
              <p className="text-xs text-[var(--mut)] mt-1">Live proofs with approval before carving and casting begins.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-[var(--accent)] shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[var(--ink)]">Island-wide Courier</h4>
              <p className="text-xs text-[var(--mut)] mt-1">Safe transit with real-time milestone order tracking.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-[var(--mut)] shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[var(--ink)]">Fair-Trade Guarantee</h4>
              <p className="text-xs text-[var(--mut)] mt-1">Over 85% of item price goes straight to the workshop hands.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-[1120px] mx-auto py-12 px-5 grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Brand Mission Column */}
        <div className="md:col-span-2">
          <Link href="/" className="logo text-xl inline-flex items-center gap-1.5 mb-3">
            <span>🎨</span> Craft<b>Villa</b> <span className="text-xs font-sans text-[var(--mut)] border-l border-[var(--line)] pl-2">Artisan Gifts</span>
          </Link>
          <p className="text-sm text-[var(--mut)] leading-relaxed max-w-sm mb-4">
            CraftVilla is a dedicated platform connecting authentic Sri Lankan heritage crafts with modern personalized gifting. From Kandy woodcarvers to Southern coast batik artisans, we preserve age-old traditions through ethical fair-trade commerce.
          </p>
          <div className="flex items-center gap-2 text-xs text-[var(--mut)] mb-4">
            <MapPin className="w-4 h-4 text-[var(--accent)] shrink-0" />
            <span>Colombo, Kandy &amp; Galle workshops, Sri Lanka</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full border border-[var(--line)] text-[var(--mut)] hover:text-[var(--ink)] hover:border-[var(--ink)] transition-colors" aria-label="CraftVilla Online">
              <Globe className="w-4 h-4" />
            </a>
            <a href="mailto:support@craftvilla.lk" className="p-2 rounded-full border border-[var(--line)] text-[var(--mut)] hover:text-[var(--ink)] hover:border-[var(--ink)] transition-colors" aria-label="Email Support">
              <Mail className="w-4 h-4" />
            </a>
            <Link href="/about" className="p-2 rounded-full border border-[var(--line)] text-[var(--mut)] hover:text-[var(--ink)] hover:border-[var(--ink)] transition-colors" aria-label="Share Stories">
              <Share2 className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Categories */}
        <div>
          <h4 className="font-bold text-sm text-[var(--ink)] uppercase tracking-wider mb-3">Craft Categories</h4>
          <ul className="space-y-2 text-sm text-[var(--mut)]">
            <li><Link href="/catalog?material=Wood" className="hover:text-[var(--ink)] transition-colors">Woodwork & Carvings</Link></li>
            <li><Link href="/catalog?material=Resin" className="hover:text-[var(--ink)] transition-colors">Resin Floral Art</Link></li>
            <li><Link href="/catalog?material=Ceramic" className="hover:text-[var(--ink)] transition-colors">Wheel-Thrown Pottery</Link></li>
            <li><Link href="/catalog?material=Batik" className="hover:text-[var(--ink)] transition-colors">Wax-Resist Batik</Link></li>
            <li><Link href="/catalog?material=Leather" className="hover:text-[var(--ink)] transition-colors">Hand-Stitched Leather</Link></li>
            <li><Link href="/catalog?material=Metal" className="hover:text-[var(--ink)] transition-colors">Kandyan Brass & Copper</Link></li>
          </ul>
        </div>

        {/* Artisan Network */}
        <div>
          <h4 className="font-bold text-sm text-[var(--ink)] uppercase tracking-wider mb-3">Artisan Network</h4>
          <ul className="space-y-2 text-sm text-[var(--mut)]">
            <li><Link href="/artisans" className="hover:text-[var(--ink)] transition-colors">Meet the Makers</Link></li>
            <li><Link href="/artisan/register" className="hover:text-[var(--ink)] transition-colors">Become an Artisan</Link></li>
            <li><Link href="/artisan" className="hover:text-[var(--ink)] transition-colors">Workshop Studio Portal</Link></li>
            <li><Link href="/about#standards" className="hover:text-[var(--ink)] transition-colors">Fair-Trade Standards</Link></li>
            <li><Link href="/admin" className="hover:text-[var(--ink)] transition-colors">Marketplace Governance</Link></li>
          </ul>
        </div>

        {/* Customer Care & Policies */}
        <div>
          <h4 className="font-bold text-sm text-[var(--ink)] uppercase tracking-wider mb-3">Customer Care</h4>
          <ul className="space-y-2 text-sm text-[var(--mut)]">
            <li><Link href="/track" className="hover:text-[var(--ink)] transition-colors">Track Your Order</Link></li>
            <li><Link href="/policies/returns" className="hover:text-[var(--ink)] transition-colors">Bespoke Returns Policy</Link></li>
            <li><Link href="/about" className="hover:text-[var(--ink)] transition-colors">Our Mission & Story</Link></li>
            <li><Link href="/contact" className="hover:text-[var(--ink)] transition-colors">Help & Direct Contact</Link></li>
            <li><Link href="/hampers" className="hover:text-[var(--ink)] transition-colors">Corporate Gift Hampers</Link></li>
          </ul>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-[var(--line)] py-5 px-5 text-center text-xs text-[var(--mut)]">
        <div className="max-w-[1120px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>© 2026 CraftVilla by Poorni Gamage. All Rights Reserved.</span>
          <div className="flex gap-4">
            <Link href="/policies/returns" className="hover:underline">Terms & Conditions</Link>
            <Link href="/policies/returns" className="hover:underline">Privacy Policy</Link>
            <Link href="/contact" className="hover:underline">Contact Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
