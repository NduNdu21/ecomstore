"use client";

import { useEffect, useMemo, useState } from "react";
import { FiMinus, FiPlus, FiShoppingBag, FiTrash2, FiX } from "react-icons/fi";
import {
  getBasketItems,
  removeFromBasket,
  type BasketItem,
  updateBasketQuantity,
} from "../utils/basket";

type CartDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const [items, setItems] = useState<BasketItem[]>(() => getBasketItems());

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function syncItems() {
      setItems(getBasketItems());
    }

    syncItems();
    window.addEventListener("basket:updated", syncItems);

    return () => {
      window.removeEventListener("basket:updated", syncItems);
    };
  }, [isOpen]);

  const subtotal = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + Number(item.price) * Number(item.quantity || 0),
        0,
      ),
    [items],
  );

  const currency = items[0]?.currency ?? "USD";
  const formattedSubtotal = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(subtotal);

  function handleQuantityChange(productId: string, nextQuantity: number) {
    if (nextQuantity <= 0) {
      removeFromBasket(productId);
      return;
    }

    updateBasketQuantity(productId, nextQuantity);
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close shopping cart"
        className="absolute inset-0 bg-[#1f2a24]/30"
        onClick={onClose}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-[#1f2a24]/15 bg-[#f4f0e8] shadow-[0_20px_70px_rgba(31,42,36,0.18)]"
      >
        <div className="flex items-center justify-between border-b border-[#1f2a24]/15 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-full bg-[#1f2a24] text-[#f4f0e8]">
              <FiShoppingBag aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c95d3f]">
                Bag
              </p>
              <p className="text-sm text-[#1f2a24]/70">{items.length} item(s)</p>
            </div>
          </div>

          <button
            type="button"
            aria-label="Close cart"
            className="flex size-9 items-center justify-center rounded-full transition hover:bg-[#1f2a24]/10"
            onClick={onClose}
          >
            <FiX aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 pt-12 text-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-[#1f2a24]/5 text-[#1f2a24]/50">
                <FiShoppingBag className="text-2xl" aria-hidden="true" />
              </div>
              <div>
                <p className="font-serif text-2xl text-[#1f2a24]">Your bag is empty</p>
                <p className="mt-2 text-sm text-[#1f2a24]/65">
                  Add a few pieces from the shop to get started.
                </p>
              </div>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => {
                const itemPrice = Number(item.price) || 0;
                const lineTotal = itemPrice * Number(item.quantity || 0);
                const formattedLineTotal = new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: item.currency || currency,
                }).format(lineTotal);

                return (
                  <li
                    key={item.id}
                    className="flex gap-4 rounded-2xl border border-[#1f2a24]/10 bg-[#f3eee7] p-3"
                  >
                    <div className="relative h-24 w-20 overflow-hidden rounded-xl bg-[#e7e0d4]">
                      {item.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="size-full object-cover"
                        />
                      ) : (
                        <div className="flex size-full items-center justify-center px-2 text-center text-[10px] uppercase tracking-[0.12em] text-[#1f2a24]/60">
                          Product
                        </div>
                      )}
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <p className="line-clamp-2 font-serif text-lg text-[#1f2a24]">
                          {item.name}
                        </p>
                        <button
                          type="button"
                          aria-label={`Remove ${item.name} from bag`}
                          className="flex size-8 items-center justify-center rounded-full text-[#1f2a24]/60 transition hover:bg-[#1f2a24]/10 hover:text-[#c95d3f]"
                          onClick={() => removeFromBasket(item.id)}
                        >
                          <FiTrash2 aria-hidden="true" />
                        </button>
                      </div>

                      <p className="mt-1 text-sm text-[#1f2a24]/65">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: item.currency || "USD",
                        }).format(itemPrice)}
                      </p>

                      <div className="mt-3 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 rounded-full border border-[#1f2a24]/15 bg-[#f4f0e8] px-2 py-1">
                          <button
                            type="button"
                            aria-label={`Decrease quantity for ${item.name}`}
                            className="flex size-7 items-center justify-center rounded-full transition hover:bg-[#1f2a24]/10"
                            onClick={() => handleQuantityChange(item.id, Number(item.quantity || 0) - 1)}
                          >
                            <FiMinus aria-hidden="true" />
                          </button>
                          <span className="min-w-6 text-center text-sm font-medium text-[#1f2a24]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            aria-label={`Increase quantity for ${item.name}`}
                            className="flex size-7 items-center justify-center rounded-full transition hover:bg-[#1f2a24]/10"
                            onClick={() => handleQuantityChange(item.id, Number(item.quantity || 0) + 1)}
                          >
                            <FiPlus aria-hidden="true" />
                          </button>
                        </div>

                        <span className="text-sm font-medium text-[#1f2a24]">
                          {formattedLineTotal}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="border-t border-[#1f2a24]/15 bg-[#f3eee7] p-5">
          <div className="mb-4 flex items-center justify-between text-sm text-[#1f2a24]/70">
            <span>Subtotal</span>
            <span className="text-base font-semibold text-[#1f2a24]">
              {formattedSubtotal}
            </span>
          </div>

          <button
            type="button"
            className="w-full rounded-full bg-[#1f2a24] px-4 py-3 text-sm font-medium text-[#f4f0e8] transition hover:bg-[#1f2a24]/90"
          >
            Continue to checkout
          </button>
        </div>
      </aside>
    </div>
  );
}
