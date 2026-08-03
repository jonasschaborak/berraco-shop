"use client";

import { useCart } from "@/components/shop/CartProvider";

export function Header() {
  const { count, openCart } = useCart();

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 md:px-8">
        <a
          href="#gefuehle"
          className="brand-display text-xl tracking-[0.22em] text-white/90 transition hover:text-[var(--accent)] md:text-2xl"
        >
          BERRACO
        </a>
        <button
          type="button"
          onClick={openCart}
          className="eyebrow text-white/70 transition hover:text-white"
        >
          Cart{count > 0 ? ` · ${count}` : ""}
        </button>
      </div>
    </header>
  );
}
