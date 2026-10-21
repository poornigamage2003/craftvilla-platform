import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ARTISANS, PRODUCTS } from "@/lib/data";
import ProductCard from "@/components/ProductCard";

interface ArtisanDetailPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return ARTISANS.map((artisan) => ({
    slug: artisan.slug,
  }));
}

export default async function ArtisanDetailPage({
  params,
}: ArtisanDetailPageProps) {
  const { slug } = await params;
  const artisan = ARTISANS.find((a) => a.slug === slug);

  if (!artisan) {
    notFound();
  }

  const artisanProducts = PRODUCTS.filter((p) => p.artisanSlug === slug);

  return (
    <div>
      <div className="mb-4">
        <Link
          href="/artisans"
          className="text-sm text-[var(--mut)] hover:text-[var(--ink)] inline-flex items-center gap-1 mb-3"
        >
          ← Back to all artisans
        </Link>
      </div>

      <div className="panel mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-5">
          <div className="av w-16 h-16 text-2xl" aria-hidden="true">
            {artisan.name.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h2>{artisan.name}</h2>
              {artisan.verified && (
                <span className="badge bg-[var(--ok)] text-white">
                  Verified Maker
                </span>
              )}
            </div>
            <p className="sub mt-1 mb-2">
              {artisan.location}, Sri Lanka · {artisan.category} craft · ★{" "}
              {artisan.rating} (Community rating)
            </p>
            <p className="text-[var(--ink)] max-w-2xl text-base leading-relaxed">
              {artisan.bio}
            </p>
          </div>
        </div>
      </div>

      <h3 className="text-2xl mb-4">Handcrafted by {artisan.name}</h3>
      {artisanProducts.length > 0 ? (
        <div className="grid">
          {artisanProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="panel empty">
          <p>No pieces listed currently. Check back soon!</p>
        </div>
      )}
    </div>
  );
}
