import React from "react";
import Link from "next/link";
import { ARTISANS } from "@/lib/data";

export default function ArtisansPage() {
  return (
    <div>
      <h2>Meet the makers</h2>
      <p className="sub">Every artisan is verified before they can sell.</p>

      <div className="grid">
        {ARTISANS.map((artisan) => (
          <article key={artisan.id} className="card">
            <div className="in">
              <div className="av" aria-hidden="true">
                {artisan.name.charAt(0)}
              </div>
              <b className="text-[17px] text-[var(--ink)]">{artisan.name}</b>
              <small className="text-[var(--mut)]">
                {artisan.location} · {artisan.category} · ★ {artisan.rating}
              </small>
              <p className="my-2 text-sm leading-relaxed text-[var(--ink)]">
                {artisan.bio}
              </p>
              <div className="mt-auto pt-3">
                <Link
                  href={`/artisans/${artisan.slug}`}
                  className="btn w-full text-sm py-2"
                >
                  View pieces
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="panel mt-6 flex justify-between items-center gap-4 flex-wrap">
        <div>
          <h3>Do you craft by hand?</h3>
          <small className="text-[var(--mut)]">
            Open your own storefront and keep more of every sale.
          </small>
        </div>
        <Link href="/register?role=artisan" className="btn gold">
          Apply as an artisan
        </Link>
      </div>
    </div>
  );
}
