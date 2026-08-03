"use client";

import { useCart } from "@/components/shop/CartProvider";

export function Header() {
  const { count, openCart } = useCart();

  return (
    <header className="fixed inset-x-0 top-0 z-50 mix-blend-difference">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 md:px-8">
        <a href="/" className="font-[family-name:var(--font-display)] text-2xl tracking-[0.2em] text-white md:text-3xl">
          BERRACO
        </a>
        <nav className="flex items-center gap-6 text-sm tracking-widest text-white/80 uppercase">
          <a href="#shop" className="hidden transition hover:text-white sm:inline">
            Shop
          </a>
          <button
            type="button"
            onClick={openCart}
            className="tracking-widest uppercase transition hover:text-white"
          >
            Cart{count > 0 ? ` (${count})` : ""}
          </button>
        </nav>
      </div>
    </header>
  );
}
