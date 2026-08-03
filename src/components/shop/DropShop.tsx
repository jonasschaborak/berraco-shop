"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import {
  collections,
  getProductSizes,
  type Collection,
  type Product,
} from "@/data/collections";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { CartProvider, useCart } from "@/components/shop/CartProvider";
import { formatEuro, getDiscountPercent, getEffectivePrice } from "@/lib/pricing";

function BagIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 8h12l-1 12H7L6 8Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M9 8V7a3 3 0 0 1 6 0v1"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M5 9h14M5 15h14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function TeeSlide({
  product,
  offset,
  active,
  onSelect,
}: {
  product: Product;
  offset: number;
  active: boolean;
  onSelect: () => void;
}) {
  const abs = Math.abs(offset);
  const x = offset * (active ? 0 : abs === 1 ? 38 : 62);
  const y = abs === 0 ? 0 : abs === 1 ? 18 : 42;
  const scale = abs === 0 ? 1 : abs === 1 ? 0.78 : 0.58;
  const opacity = abs === 0 ? 1 : abs === 1 ? 0.72 : 0.38;
  const z = 20 - abs;
  const rotate = offset * -7;

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      className="absolute top-1/2 left-1/2 w-[min(42vw,340px)] origin-center -translate-x-1/2 -translate-y-[55%] focus:outline-none md:w-[min(28vw,380px)]"
      style={{ zIndex: z }}
      animate={{
        x: `${x}%`,
        y: `${y}%`,
        scale,
        opacity,
        rotate,
      }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
      aria-label={product.name}
      aria-current={active}
    >
      <div
        className={`relative aspect-[3/4] ${
          active ? "drop-shadow-[0_40px_80px_rgba(155,27,46,0.35)]" : "drop-shadow-[0_20px_40px_rgba(0,0,0,0.65)]"
        }`}
      >
        {product.image ? (
          <Image
            src={product.image}
            alt={`${product.name} heavyweight tee`}
            fill
            sizes="(max-width: 768px) 55vw, 380px"
            className="object-contain"
            priority={active}
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center"
            style={{ background: `linear-gradient(180deg, ${product.color} 0%, #050505 100%)` }}
          >
            <span
              className="brand-mark text-3xl tracking-[0.2em]"
              style={{ color: product.accent }}
            >
              {product.embroidery}
            </span>
          </div>
        )}
      </div>
    </motion.button>
  );
}

function DropStage({
  collection,
  active,
}: {
  collection: Collection;
  active: boolean;
}) {
  const { addItem } = useCart();
  const centerDefault = Math.floor(collection.products.length / 2);
  const [index, setIndex] = useState(centerDefault);
  const [size, setSize] = useState("");
  const product = collection.products[index] ?? collection.products[0];
  const discount = getDiscountPercent(collection.age);
  const price = getEffectivePrice(product.basePrice, collection.age);
  const sizes = getProductSizes(product);

  useEffect(() => {
    setSize("");
  }, [product.id]);

  const offsets = useMemo(
    () => collection.products.map((_, i) => i - index),
    [collection.products, index],
  );

  if (!active) return null;

  return (
    <div className="relative flex min-h-[100svh] flex-col">
      <div className="relative flex flex-1 flex-col pt-20 pb-8 md:pt-24">
        {/* Red streak atmosphere behind tees */}
        <div className="pointer-events-none absolute inset-x-0 top-[18%] h-[42%] bg-[radial-gradient(ellipse_at_center,rgba(155,27,46,0.22),transparent_62%)] blur-2xl" />
        <div className="pointer-events-none absolute inset-x-[-10%] top-[28%] h-24 rotate-[-2deg] bg-[linear-gradient(90deg,transparent,rgba(155,27,46,0.18),transparent)] blur-md" />

        <div className="relative mx-auto h-[min(58svh,520px)] w-full max-w-6xl md:h-[min(62svh,560px)]">
          {collection.products.map((p, i) => (
            <TeeSlide
              key={p.id}
              product={p}
              offset={offsets[i] ?? 0}
              active={i === index}
              onSelect={() => setIndex(i)}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={product.id}
            className="relative z-30 mx-auto mt-auto flex w-full max-w-sm flex-col items-center px-5 pb-6 text-center md:pb-10"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.35 }}
          >
            <h2 className="text-[0.7rem] font-medium tracking-[0.28em] text-white md:text-xs">
              {product.name} / {product.subtitle}
            </h2>
            <p className="mt-3 text-lg tracking-wide text-[var(--accent)] md:text-xl">
              {formatEuro(price).replace(/\s/g, " ")}
              {discount > 0 && (
                <span className="ml-2 text-sm text-white/30 line-through">
                  {formatEuro(product.basePrice)}
                </span>
              )}
            </p>

            <label className="relative mt-6 w-full">
              <span className="sr-only">Größe wählen</span>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="w-full appearance-none border border-white/25 bg-black/40 px-4 py-3.5 text-center text-[0.65rem] tracking-[0.28em] text-white outline-none transition focus:border-white/50"
              >
                <option value="">SELECT SIZE</option>
                {sizes.map((s) => (
                  <option key={s} value={s} className="bg-black text-white">
                    {s}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-white/50">
                ▾
              </span>
            </label>

            <button
              type="button"
              disabled={!size}
              onClick={() => {
                if (!size) return;
                addItem({
                  product,
                  size,
                  price,
                  collectionName: collection.name,
                });
              }}
              className="mt-3 w-full bg-[var(--accent)] py-3.5 text-[0.65rem] tracking-[0.32em] text-white transition hover:bg-[var(--accent-hover)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              ADD TO BAG
            </button>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function ShopShell() {
  const { count, openCart } = useCart();
  const [dropIndex, setDropIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const collection = collections[dropIndex] ?? collections[0];

  return (
    <div className="relative min-h-[100svh] overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,rgba(40,10,14,0.9),transparent_55%),linear-gradient(180deg,#050505_0%,#080808_55%,#12080a_100%)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <header className="fixed inset-x-0 top-0 z-50">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center px-4 py-5 md:px-8 md:py-6">
          <p className="eyebrow justify-self-start text-white/55">{collection.label}</p>
          <a href="/" className="brand-mark justify-self-center text-lg text-white md:text-2xl">
            BERRACO
          </a>
          <div className="flex items-center justify-end gap-4 md:gap-5">
            <button
              type="button"
              onClick={openCart}
              className="relative text-white/85 transition hover:text-white"
              aria-label="Bag"
            >
              <BagIcon className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -top-1.5 -right-2 text-[10px] text-[var(--accent)]">
                  {count}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="text-white/85 transition hover:text-white"
              aria-label="Menü"
            >
              <MenuIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Drop dots */}
      <nav
        className="fixed top-1/2 left-4 z-40 flex -translate-y-1/2 flex-col items-center gap-3 md:left-7"
        aria-label="Drops"
      >
        {collections.map((c, i) => {
          const on = i === dropIndex;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setDropIndex(i)}
              className="group flex flex-col items-center gap-3"
              aria-label={c.label}
              aria-current={on}
            >
              {on && <span className="h-6 w-px bg-[var(--accent)]" />}
              <span
                className={`h-1.5 w-1.5 rounded-full transition ${
                  on ? "bg-[var(--accent)]" : "bg-white/30 group-hover:bg-white/60"
                }`}
              />
            </button>
          );
        })}
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              className="absolute top-6 right-6 eyebrow text-white/50"
              onClick={() => setMenuOpen(false)}
            >
              Close
            </button>
            <div className="flex h-full flex-col items-center justify-center gap-8">
              {collections.map((c, i) => (
                <button
                  key={c.id}
                  type="button"
                  className="brand-mark text-2xl tracking-[0.35em] text-white/70 transition hover:text-white"
                  onClick={() => {
                    setDropIndex(i);
                    setMenuOpen(false);
                  }}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative">
        {collections.map((c, i) => (
          <DropStage key={c.id} collection={c} active={i === dropIndex} />
        ))}
      </main>

      <CartDrawer />
    </div>
  );
}

export function ShopExperience() {
  return (
    <CartProvider>
      <ShopShell />
    </CartProvider>
  );
}
