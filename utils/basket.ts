export type BasketItem = {
  id: string;
  name: string;
  price: number | string;
  currency: string;
  image_url: string | null;
  quantity: number;
};

export const BASKET_STORAGE_KEY = "ecomstore_basket";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function getBasketItems(): BasketItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const rawBasket = window.localStorage.getItem(BASKET_STORAGE_KEY);

    if (!rawBasket) {
      return [];
    }

    const parsedBasket = JSON.parse(rawBasket);

    if (!Array.isArray(parsedBasket)) {
      return [];
    }

    return parsedBasket.filter((item): item is BasketItem => {
      if (!isRecord(item)) {
        return false;
      }

      return typeof item.id === "string" && typeof item.name === "string";
    });
  } catch {
    return [];
  }
}

export function getBasketCount(): number {
  return getBasketItems().reduce(
    (count, item) => count + Math.max(0, Number(item.quantity) || 0),
    0,
  );
}

export function addToBasket(product: {
  id: string;
  name: string;
  price: number | string;
  currency: string;
  image_url?: string | null;
}): BasketItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  const basket = getBasketItems();
  const existingItemIndex = basket.findIndex((item) => item.id === product.id);

  if (existingItemIndex >= 0) {
    basket[existingItemIndex] = {
      ...basket[existingItemIndex],
      quantity: Math.max(1, Number(basket[existingItemIndex].quantity) || 1) + 1,
    };
  } else {
    basket.push({
      id: product.id,
      name: product.name,
      price: product.price,
      currency: product.currency,
      image_url: product.image_url ?? null,
      quantity: 1,
    });
  }

  window.localStorage.setItem(BASKET_STORAGE_KEY, JSON.stringify(basket));
  window.dispatchEvent(new CustomEvent("basket:updated", { detail: { count: getBasketCount() } }));

  return basket;
}
