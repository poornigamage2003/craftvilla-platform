import Link from "next/link";
import { Product } from "@/lib/types";
import { formatLKR } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="card">
      <div
        className="thumb"
        style={{ backgroundColor: product.bgColor }}
        aria-hidden="true"
      >
        {product.emoji}
      </div>
      <div className="in">
        <span className="badge">Customizable</span>
        <b className="text-[17px] font-bold text-[var(--ink)] mt-1">
          {product.name}
        </b>
        <small className="text-[var(--mut)]">
          <Link
            href={`/artisans/${product.artisanSlug}`}
            className="hover:underline hover:text-[var(--ink)] transition-colors"
          >
            {product.artisanName}
          </Link>
        </small>
        <div className="row">
          <span className="font-medium text-[var(--ink)]">
            From {formatLKR(product.basePrice)}
          </span>
          <Link
            href={`/customize/${product.id}`}
            className="btn text-sm py-2 px-3.5"
            aria-label={`Customize ${product.name}`}
          >
            Customize
          </Link>
        </div>
      </div>
    </article>
  );
}
