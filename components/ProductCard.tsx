"use client";

import { FiHeart, FiPlus, FiStar } from "react-icons/fi";
import { supabase } from "../utils/supabase";

export type Product = {
  id: string;
  name: string;
  slug: string;
  price: number | string;
  currency: string;
  image_url: string | null;
  description?: string | null;
  category?: string | null;
  color?: string | null;
  rating?: number | null;
  review_count?: number | null;
  is_new?: boolean;
  stock_quantity?: number | null;
  created_at?: string;
};

type ProductCardProps = {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onToggleWishlist?: (product: Product) => void;
};

function getProductImageUrl(imagePath: string | null) {
  if (!imagePath) {
    return null;
  }

  return supabase.storage.from("product-images").getPublicUrl(imagePath).data
    .publicUrl;
}

export default function ProductCard({
  product,
  onAddToCart,
  onToggleWishlist,
}: ProductCardProps) {
  const imageUrl = getProductImageUrl(product.image_url);
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: product.currency,
  }).format(Number(product.price));
  const metadata = [product.category, product.color].filter(Boolean).join(" · ");

  return (
    <article className="group min-w-0">
      <div className="relative aspect-4/5 overflow-hidden bg-[#e7e0d4]">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={product.name}
            className="size-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex size-full items-center justify-center px-6 text-center font-serif text-xl text-[#1f2a24]/60">
            Image coming soon
          </div>
        )}

        {product.is_new ? (
          <span className="absolute bottom-4 left-4 bg-[#c95d3f] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
            New
          </span>
        ) : null}

        <button
          type="button"
          aria-label={`Add ${product.name} to wishlist`}
          className="absolute right-3 top-3 flex size-10 items-center justify-center rounded-full bg-[#f4f0e8]/90 text-xl text-[#1f2a24] transition hover:bg-[#f4f0e8]"
          onClick={() => onToggleWishlist?.(product)}
        >
          <FiHeart aria-hidden="true" />
        </button>
      </div>

      <div className="pt-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="line-clamp-2 font-serif text-xl leading-tight text-[#1f2a24]">
              {product.name}
            </h2>
            {metadata ? (
              <p className="mt-1 text-sm text-[#1f2a24]/60">{metadata}</p>
            ) : null}
          </div>
          <p className="shrink-0 text-sm font-medium text-[#1f2a24]">
            {formattedPrice}
          </p>
        </div>

        {product.rating !== null && product.rating !== undefined ? (
          <div className="mt-3 flex items-center gap-1 text-xs text-[#1f2a24]/65">
            <FiStar className="fill-[#c95d3f] text-[#c95d3f]" aria-hidden="true" />
            <span>{product.rating.toFixed(1)}</span>
            {product.review_count ? <span>({product.review_count})</span> : null}
          </div>
        ) : null}

        <button
          type="button"
          className="mt-4 flex w-full items-center justify-between border-t border-[#1f2a24]/15 pt-3 text-sm font-medium transition-colors hover:text-[#c95d3f]"
          onClick={() => onAddToCart?.(product)}
        >
          <span>Add to bag</span>
          <FiPlus aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}