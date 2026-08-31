"use client";

import { useEffect, useMemo, useState } from "react";
import { FiSearch, FiSliders } from "react-icons/fi";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import ProductCard, { type Product } from "../../components/ProductCard";
import { addToBasket } from "../../utils/basket";
import { supabase } from "../../utils/supabase";

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to high" },
  { value: "price-desc", label: "Price: High to low" },
  { value: "name-asc", label: "Name: A-Z" },
  { value: "newest", label: "Newest first" },
] as const;

const availabilityOptions = [
  { value: "all", label: "All products" },
  { value: "in-stock", label: "In stock" },
  { value: "low-stock", label: "Low stock" },
] as const;

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAvailability, setSelectedAvailability] =
    useState<(typeof availabilityOptions)[number]["value"]>("all");
  const [sortBy, setSortBy] = useState<(typeof sortOptions)[number]["value"]>(
    "featured",
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      const { data, error: productsError } = await supabase
        .from("products")
        .select(
          "id, name, slug, price, currency, image_url, description, stock_quantity, created_at, is_active",
        )
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (productsError) {
        setError(productsError.message);
        setLoading(false);
        return;
      }

      setProducts((data ?? []) as Product[]);
      setLoading(false);
    }

    void loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = searchTerm.trim().toLowerCase();

    const matches = products.filter((product) => {
      const matchesText =
        !normalizedQuery ||
        [product.name, product.description, product.slug]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      const stockQuantity = Number(product.stock_quantity ?? 0);
      const matchesAvailability =
        selectedAvailability === "all" ||
        (selectedAvailability === "in-stock" && stockQuantity > 0) ||
        (selectedAvailability === "low-stock" && stockQuantity > 0 && stockQuantity < 5);

      return matchesText && matchesAvailability;
    });

    return [...matches].sort((firstProduct, secondProduct) => {
      switch (sortBy) {
        case "price-asc":
          return Number(firstProduct.price) - Number(secondProduct.price);
        case "price-desc":
          return Number(secondProduct.price) - Number(firstProduct.price);
        case "name-asc":
          return firstProduct.name.localeCompare(secondProduct.name);
        case "newest":
          return new Date(secondProduct.created_at ?? 0).valueOf() -
            new Date(firstProduct.created_at ?? 0).valueOf();
        case "featured":
        default:
          return (
            Number(secondProduct.stock_quantity ?? 0) -
            Number(firstProduct.stock_quantity ?? 0)
          );
      }
    });
  }, [products, searchTerm, selectedAvailability, sortBy]);

  function handleAddToCart(product: Product) {
    addToBasket(product);
  }

  return (
    <main className="min-h-screen bg-[#f4f0e8] text-[#1f2a24]">
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 pb-20 pt-12 sm:px-10 lg:pt-16">
        <div className="mb-8 flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c95d3f]">
            Shop all
          </p>
          <h1 className="font-serif text-5xl leading-none text-[#1f2a24] sm:text-6xl">
            The edit
          </h1>
        </div>

        <div className="flex flex-col gap-3 border-b border-[#1f2a24]/15 pb-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <label className="relative block w-full max-w-xl">
              <span className="sr-only">Search products</span>
              <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#1f2a24]/50" aria-hidden="true" />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search products, textures, or colors"
                className="w-full border border-[#1f2a24]/15 bg-[#f3eee7] py-3 pl-11 pr-4 text-sm text-[#1f2a24] outline-none transition focus:border-[#c95d3f]"
              />
            </label>

            <div className="flex items-center gap-2 rounded-full border border-[#1f2a24]/15 bg-[#f3eee7] px-3 py-2 text-sm text-[#1f2a24]">
              <FiSliders aria-hidden="true" />
              <label className="flex items-center gap-2">
                <span className="text-[#1f2a24]/70">Sort</span>
                <select
                  aria-label="Sort products"
                  value={sortBy}
                  onChange={(event) =>
                    setSortBy(event.target.value as (typeof sortOptions)[number]["value"])
                  }
                  className="bg-transparent font-medium outline-none"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {availabilityOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setSelectedAvailability(option.value)}
                className={`rounded-full border px-3 py-1.5 text-sm transition ${
                  selectedAvailability === option.value
                    ? "border-[#1f2a24] bg-[#1f2a24] text-[#f4f0e8]"
                    : "border-[#1f2a24]/15 bg-transparent text-[#1f2a24]/70 hover:border-[#1f2a24]/30 hover:text-[#1f2a24]"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p className="py-16 text-sm text-[#1f2a24]/60">Loading products...</p>
        ) : error ? (
          <div className="mt-10 rounded-2xl border border-[#c95d3f]/20 bg-[#f3eee7] p-6 text-sm text-[#c95d3f]">
            {error}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onToggleWishlist={() => undefined}
              />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-dashed border-[#1f2a24]/20 bg-[#f3eee7] p-10 text-center">
            <p className="font-serif text-2xl text-[#1f2a24]">No products found</p>
            <p className="mt-2 text-sm text-[#1f2a24]/65">
              Try adjusting your search or switching the product availability filter.
            </p>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
