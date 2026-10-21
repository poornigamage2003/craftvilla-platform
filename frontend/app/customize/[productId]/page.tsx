import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PRODUCTS } from "@/lib/data";
import Customizer from "@/components/Customizer";

interface CustomizePageProps {
  params: Promise<{ productId: string }>;
}

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({
    productId: product.id,
  }));
}

export default async function CustomizePage({ params }: CustomizePageProps) {
  const { productId } = await params;
  const product = PRODUCTS.find((p) => p.id === productId);

  if (!product) {
    notFound();
  }

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
        <div>
          <h2>Personalize your gift</h2>
          <p className="sub">
            The preview updates as you type. Approve the proof before it goes to the artisan.
          </p>
        </div>

        {/* Quick switcher to customize other products */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {PRODUCTS.slice(0, 4).map((p) => (
            <Link
              key={p.id}
              href={`/customize/${p.id}`}
              className={`chip ${p.id === productId ? "active font-bold" : ""}`}
            >
              {p.emoji} {p.name}
            </Link>
          ))}
        </div>
      </div>

      <Customizer product={product} />
    </div>
  );
}
