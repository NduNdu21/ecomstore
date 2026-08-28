"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiPackage,
  FiPlus,
  FiStar,
  FiTruck,
} from "react-icons/fi";
import { supabase } from "../../utils/supabase";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number | string;
  stock_quantity: number;
  is_active: boolean;
  image_url: string | null;
};

type ProductDraft = {
  id?: string;
  name: string;
  slug: string;
  price: string;
  stock_quantity: string;
  image_url: string;
  is_active: boolean;
};

type Review = {
  id: string;
  product_id: string;
  rating: number;
  title: string | null;
  body: string | null;
  is_published: boolean;
  created_at: string;
};

type Order = {
  id: string;
  user_id: string;
  status: string;
  total: number | string;
  currency: string;
  created_at: string;
};

type DashboardTab = "inventory" | "reviews" | "orders";

const tabs: { id: DashboardTab; label: string }[] = [
  { id: "inventory", label: "Inventory" },
  { id: "reviews", label: "Reviews" },
  { id: "orders", label: "Orders" },
];

const orderStatuses = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function formatMoney(value: number | string, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(Number(value));
}

function getProductImageUrl(imagePath: string | null) {
  if (!imagePath) return null;
  // If it's already a full URL, return it as-is
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  // Otherwise, construct the public URL from the filename
  return supabase.storage.from("product-images").getPublicUrl(imagePath).data
    .publicUrl;
}

const emptyProductDraft = (): ProductDraft => ({
  name: "",
  slug: "",
  price: "",
  stock_quantity: "0",
  image_url: "",
  is_active: true,
});

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<DashboardTab>("inventory");
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [productDraft, setProductDraft] = useState<ProductDraft>(emptyProductDraft());

  async function handleProductSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextSlug =
      (productDraft.slug || productDraft.name)
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") || "product";

    const payload = {
      name: productDraft.name.trim(),
      slug: nextSlug,
      price: Number(productDraft.price || 0),
      stock_quantity: Number(productDraft.stock_quantity || 0),
      image_url: productDraft.image_url.trim(),
      is_active: productDraft.is_active,
    };

    if (!payload.name) {
      setError("Product name is required.");
      return;
    }

    if (!Number.isFinite(payload.price) || payload.price < 0) {
      setError("Price must be a valid non-negative number.");
      return;
    }

    const isUpdating = Boolean(productDraft.id);
    const query = isUpdating
      ? supabase.from("products").update(payload).eq("id", productDraft.id)
      : supabase.from("products").insert(payload);

    const { error: submitError } = await query;

    if (submitError) {
      setError(`Unable to save product: ${submitError.message}`);
      return;
    }

    const { data: refreshedProducts, error: refreshError } = await supabase
      .from("products")
      .select("id, name, slug, price, stock_quantity, is_active, image_url")
      .order("created_at", { ascending: false });

    if (refreshError) {
      setError(`Product saved, but a refresh failed: ${refreshError.message}`);
      return;
    }

    setProducts(refreshedProducts ?? []);
    setShowProductForm(false);
    setProductDraft(emptyProductDraft());
    setError(null);
  }

  function openNewProductForm() {
    setProductDraft(emptyProductDraft());
    setShowProductForm(true);
    setError(null);
  }

  function openEditProductForm(product: Product) {
    setProductDraft({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: String(product.price),
      stock_quantity: String(product.stock_quantity),
      image_url: product.image_url ?? "",
      is_active: product.is_active,
    });
    setShowProductForm(true);
    setError(null);
  }

  useEffect(() => {
    async function loadDashboard() {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData.session;

      if (!session) {
        setError("Sign in with an admin account to view this dashboard.");
        setLoading(false);
        return;
      }

      const { data: refreshedSessionData, error: refreshError } =
        await supabase.auth.refreshSession();
      const refreshedSession = refreshedSessionData.session ?? session;

      if (
        refreshError ||
        refreshedSession.user.app_metadata?.role !== "admin"
      ) {
        setError("This account does not have admin access.");
        setLoading(false);
        return;
      }

      const [productsResult, reviewsResult, ordersResult] = await Promise.all([
        supabase
          .from("products")
          .select("id, name, price, stock_quantity, is_active, image_url")
          .order("created_at", { ascending: false }),
        supabase
          .from("reviews")
          .select("id, product_id, rating, title, body, is_published, created_at")
          .order("created_at", { ascending: false }),
        supabase
          .from("orders")
          .select("id, user_id, status, total, currency, created_at")
          .order("created_at", { ascending: false }),
      ]);

      const failedResult = [
        { name: "products", result: productsResult },
        { name: "reviews", result: reviewsResult },
        { name: "orders", result: ordersResult },
      ].find(({ result }) => result.error);

      if (failedResult?.result.error) {
        setError(
          `Unable to load ${failedResult.name}: ${failedResult.result.error.message} (${failedResult.result.error.code ?? "unknown error"})`,
        );
      } else {
        setProducts(productsResult.data ?? []);
        setReviews(reviewsResult.data ?? []);
        setOrders(ordersResult.data ?? []);
      }

      setLoading(false);
    }

    void loadDashboard();
  }, []);

  async function updateReview(review: Review) {
    const nextPublished = !review.is_published;
    const { error: updateError } = await supabase
      .from("reviews")
      .update({ is_published: nextPublished })
      .eq("id", review.id);

    if (!updateError) {
      setReviews((currentReviews) =>
        currentReviews.map((currentReview) =>
          currentReview.id === review.id
            ? { ...currentReview, is_published: nextPublished }
            : currentReview,
        ),
      );
    }
  }

  async function updateOrder(order: Order, status: string) {
    const { error: updateError } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", order.id);

    if (!updateError) {
      setOrders((currentOrders) =>
        currentOrders.map((currentOrder) =>
          currentOrder.id === order.id
            ? { ...currentOrder, status }
            : currentOrder,
        ),
      );
    }
  }

  const lowStockCount = products.filter(
    (product) => product.stock_quantity < 5,
  ).length;
  const pendingReviewsCount = reviews.filter(
    (review) => !review.is_published,
  ).length;
  const openOrdersCount = orders.filter(
    (order) => !["delivered", "cancelled"].includes(order.status),
  ).length;

  return (
    <main className="min-h-screen bg-[#f4f0e8] text-[#1f2a24]">
      <div className="mx-auto max-w-7xl px-6 py-10 sm:px-10 sm:py-14">
        <header className="flex flex-col justify-between gap-6 border-b border-[#1f2a24]/15 pb-8 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c95d3f]">
              Store operations
            </p>
            <h1 className="mt-3 font-serif text-5xl leading-none sm:text-6xl">
              Admin dashboard
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <p className="max-w-xs text-sm leading-6 text-[#1f2a24]/60">
              Keep the catalog, customer feedback, and fulfillment moving.
            </p>
            <button
              type="button"
              onClick={openNewProductForm}
              className="inline-flex items-center gap-2 bg-[#1f2a24] px-4 py-2 text-sm font-medium text-[#f4f0e8] transition hover:bg-[#2b3a34]"
            >
              <FiPlus aria-hidden="true" /> Add product
            </button>
          </div>
        </header>

        {showProductForm ? (
          <form onSubmit={handleProductSubmit} className="mt-6 grid gap-4 border border-[#1f2a24]/15 bg-[#f3eee7] p-5 md:grid-cols-2">
            <label className="text-sm font-medium text-[#1f2a24] md:col-span-2">
              Product name
              <input
                required
                value={productDraft.name}
                onChange={(event) =>
                  setProductDraft((current) => ({ ...current, name: event.target.value }))
                }
                className="mt-2 w-full border border-[#1f2a24]/20 bg-white px-3 py-2 text-sm outline-none focus:border-[#c95d3f]"
              />
            </label>

            <label className="text-sm font-medium text-[#1f2a24]">
              Slug
              <input
                value={productDraft.slug}
                onChange={(event) =>
                  setProductDraft((current) => ({ ...current, slug: event.target.value }))
                }
                className="mt-2 w-full border border-[#1f2a24]/20 bg-white px-3 py-2 text-sm outline-none focus:border-[#c95d3f]"
              />
            </label>

            <label className="text-sm font-medium text-[#1f2a24]">
              Price
              <input
                required
                type="number"
                min="0"
                step="0.01"
                value={productDraft.price}
                onChange={(event) =>
                  setProductDraft((current) => ({ ...current, price: event.target.value }))
                }
                className="mt-2 w-full border border-[#1f2a24]/20 bg-white px-3 py-2 text-sm outline-none focus:border-[#c95d3f]"
              />
            </label>

            <label className="text-sm font-medium text-[#1f2a24]">
              Stock quantity
              <input
                type="number"
                min="0"
                value={productDraft.stock_quantity}
                onChange={(event) =>
                  setProductDraft((current) => ({
                    ...current,
                    stock_quantity: event.target.value,
                  }))
                }
                className="mt-2 w-full border border-[#1f2a24]/20 bg-white px-3 py-2 text-sm outline-none focus:border-[#c95d3f]"
              />
            </label>

            <label className="text-sm font-medium text-[#1f2a24] md:col-span-2">
              Image URL
              <input
                value={productDraft.image_url}
                onChange={(event) =>
                  setProductDraft((current) => ({ ...current, image_url: event.target.value }))
                }
                className="mt-2 w-full border border-[#1f2a24]/20 bg-white px-3 py-2 text-sm outline-none focus:border-[#c95d3f]"
                placeholder="product-images/filename.png"
              />
            </label>

            <label className="flex items-center gap-2 text-sm font-medium text-[#1f2a24] md:col-span-2">
              <input
                type="checkbox"
                checked={productDraft.is_active}
                onChange={(event) =>
                  setProductDraft((current) => ({ ...current, is_active: event.target.checked }))
                }
              />
              Active product
            </label>

            <div className="flex items-center gap-3 md:col-span-2">
              <button
                type="submit"
                className="bg-[#c95d3f] px-4 py-2 text-sm font-medium text-white hover:bg-[#b74f34]"
              >
                {productDraft.id ? "Save product" : "Create product"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowProductForm(false);
                  setProductDraft(emptyProductDraft());
                  setError(null);
                }}
                className="border border-[#1f2a24]/20 px-4 py-2 text-sm font-medium text-[#1f2a24]"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : null}

        <section className="grid gap-px border-b border-[#1f2a24]/15 bg-[#1f2a24]/15 sm:grid-cols-3">
          <SummaryItem
            icon={<FiPackage aria-hidden="true" />}
            label="Products"
            value={products.length}
          />
          <SummaryItem
            icon={<FiAlertCircle aria-hidden="true" />}
            label="Low stock"
            value={lowStockCount}
          />
          <SummaryItem
            icon={<FiTruck aria-hidden="true" />}
            label="Open orders"
            value={openOrdersCount}
          />
        </section>

        <nav className="mt-8 flex gap-6 border-b border-[#1f2a24]/15" aria-label="Admin sections">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`border-b-2 pb-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "border-[#c95d3f] text-[#c95d3f]"
                  : "border-transparent text-[#1f2a24]/60 hover:text-[#1f2a24]"
              }`}
            >
              {tab.label}
              {tab.id === "reviews" && pendingReviewsCount > 0 ? (
                <span className="ml-2 text-xs">{pendingReviewsCount}</span>
              ) : null}
            </button>
          ))}
        </nav>

        {loading ? (
          <p className="py-16 text-sm text-[#1f2a24]/60">Loading dashboard...</p>
        ) : error ? (
          <div className="flex items-center gap-3 py-16 text-sm text-[#c95d3f]">
            <FiAlertCircle aria-hidden="true" />
            {error}
          </div>
        ) : (
          <div className="pt-6">
            {activeTab === "inventory" ? (
              <InventoryTable
                products={products}
                onEditProduct={openEditProductForm}
              />
            ) : activeTab === "reviews" ? (
              <ReviewsTable reviews={reviews} onToggle={updateReview} />
            ) : (
              <OrdersTable orders={orders} onStatusChange={updateOrder} />
            )}
          </div>
        )}
      </div>
    </main>
  );
}

function SummaryItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center gap-4 bg-[#f4f0e8] py-5 sm:px-5">
      <span className="text-xl text-[#c95d3f]">{icon}</span>
      <div>
        <p className="font-serif text-3xl leading-none">{value}</p>
        <p className="mt-1 text-xs uppercase tracking-[0.14em] text-[#1f2a24]/55">
          {label}
        </p>
      </div>
    </div>
  );
}

function InventoryTable({
  products,
  onEditProduct,
}: {
  products: Product[];
  onEditProduct: (product: Product) => void;
}) {
  return (
    <div className="overflow-x-auto border-y border-[#1f2a24]/15">
      <table className="w-full min-w-155 text-left text-sm">
        <thead className="border-b border-[#1f2a24]/15 text-xs uppercase tracking-[0.12em] text-[#1f2a24]/55">
          <tr>
            <th className="py-4 font-medium">Product</th>
            <th className="py-4 font-medium">Price</th>
            <th className="py-4 font-medium">Stock</th>
            <th className="py-4 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const imageUrl = getProductImageUrl(product.image_url);
            return (
              <tr key={product.id} className="border-b border-[#1f2a24]/10 last:border-0">
                <td className="flex items-center gap-3 py-4">
                  <div className="size-12 shrink-0 overflow-hidden bg-[#e7e0d4]">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={product.name}
                        width={48}
                        height={60}
                        className="size-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div>
                    <span className="font-medium">{product.name}</span>
                    <button
                      type="button"
                      onClick={() => onEditProduct(product)}
                      className="mt-1 block text-left text-xs text-[#c95d3f] hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                </td>
                <td>{formatMoney(product.price, "USD")}</td>
                <td className={product.stock_quantity < 5 ? "text-[#c95d3f]" : ""}>
                  {product.stock_quantity}
                </td>
                <td>
                  <span className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#1f2a24]/65">
                    <span
                      className={`size-2 rounded-full ${
                        product.is_active ? "bg-[#6d8b73]" : "bg-[#1f2a24]/25"
                      }`}
                    />
                    {product.is_active ? "Active" : "Hidden"}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {products.length === 0 ? (
        <p className="py-10 text-sm text-[#1f2a24]/60">No products found.</p>
      ) : null}
    </div>
  );
}

function ReviewsTable({
  reviews,
  onToggle,
}: {
  reviews: Review[];
  onToggle: (review: Review) => void;
}) {
  return (
    <div className="space-y-3">
      {reviews.map((review) => (
        <article
          key={review.id}
          className="border-y border-[#1f2a24]/15 px-1 py-5 sm:flex sm:items-center sm:justify-between sm:gap-8"
        >
          <div className="min-w-0">
            <div className="flex items-center gap-1 text-[#c95d3f]">
              {Array.from({ length: 5 }, (_, index) => (
                <FiStar
                  key={index}
                  aria-hidden="true"
                  className={index < review.rating ? "fill-current" : "opacity-25"}
                />
              ))}
            </div>
            <h2 className="mt-2 font-serif text-xl">{review.title || "Untitled review"}</h2>
            <p className="mt-1 line-clamp-2 text-sm text-[#1f2a24]/65">
              {review.body || "No review text provided."}
            </p>
            <p className="mt-2 text-xs text-[#1f2a24]/45">{formatDate(review.created_at)}</p>
          </div>
          <button
            type="button"
            onClick={() => onToggle(review)}
            className="mt-4 inline-flex shrink-0 items-center gap-2 text-sm font-medium hover:text-[#c95d3f] sm:mt-0"
          >
            {review.is_published ? (
              <>
                <FiCheckCircle aria-hidden="true" /> Published
              </>
            ) : (
              <>
                <FiClock aria-hidden="true" /> Approve review
              </>
            )}
          </button>
        </article>
      ))}
      {reviews.length === 0 ? (
        <p className="py-10 text-sm text-[#1f2a24]/60">No reviews found.</p>
      ) : null}
    </div>
  );
}

function OrdersTable({
  orders,
  onStatusChange,
}: {
  orders: Order[];
  onStatusChange: (order: Order, status: string) => void;
}) {
  return (
    <div className="overflow-x-auto border-y border-[#1f2a24]/15">
      <table className="w-full min-w-180 text-left text-sm">
        <thead className="border-b border-[#1f2a24]/15 text-xs uppercase tracking-[0.12em] text-[#1f2a24]/55">
          <tr>
            <th className="py-4 font-medium">Order</th>
            <th className="py-4 font-medium">Customer</th>
            <th className="py-4 font-medium">Total</th>
            <th className="py-4 font-medium">Status</th>
            <th className="py-4 font-medium">Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b border-[#1f2a24]/10 last:border-0">
              <td className="py-4 font-medium">#{order.id.slice(0, 8)}</td>
              <td className="text-[#1f2a24]/65">{order.user_id.slice(0, 8)}</td>
              <td>{formatMoney(order.total, order.currency)}</td>
              <td>
                <select
                  aria-label={`Update order ${order.id} status`}
                  value={order.status}
                  onChange={(event) => onStatusChange(order, event.target.value)}
                  className="bg-transparent py-1 pr-5 text-xs font-medium capitalize outline-none"
                >
                  {orderStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </td>
              <td className="text-[#1f2a24]/65">{formatDate(order.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {orders.length === 0 ? (
        <p className="py-10 text-sm text-[#1f2a24]/60">No orders found.</p>
      ) : null}
    </div>
  );
}