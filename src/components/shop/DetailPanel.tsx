"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  getProductSizes,
  type Collection,
  type Product,
} from "@/data/collections";
import { useCart } from "@/components/shop/CartProvider";
import { formatEuro, getDiscountPercent, getEffectivePrice } from "@/lib/pricing";

type DetailPanelProps = {
  collection: Collection;
  product: Product | null;
  onClose: () => void;
};

export function DetailPanel({ collection, product, onClose }: DetailPanelProps) {
  const { addItem } = useCart();
  const sizes = product ? getProductSizes(product) : ["S", "M", "L", "XL"];
  const [size, setSize] = useState("M");
  const discount = getDiscountPercent(collection.age);
  const price = product ? getEffectivePrice(product.basePrice, collection.age) : 0;

  useEffect(() => {
    const next = product ? getProductSizes(product) : ["S", "M", "L", "XL"];
    setSize(next.includes("M") ? "M" : next[0] ?? "M");
  }, [product?.id]);

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center p-4 md:inset-y-0 md:right-0 md:left-auto md:w-[min(440px,44vw)] md:items-center md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="pointer-events-auto w-full max-w-md bg-[color-mix(in_oklab,var(--surface)_92%,black)] p-7 backdrop-blur-xl md:p-9"
            style={{
              boxShadow: "0 30px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06)",
            }}
            initial={{ y: 48, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 28, opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
          >
            <div className="mb-7 flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow text-[var(--accent)]">
                  {collection.name}
                  {discount > 0 ? ` · −${discount}%` : " · Neu"}
                </p>
                <h3 className="brand-display mt-2 text-5xl tracking-[0.05em]">
                  {product.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="eyebrow pt-1 text-white/40 transition hover:text-white"
              >
                Zurück
              </button>
            </div>

            <p className="text-sm leading-relaxed text-white/60">{product.description}</p>
            <p className="mt-4 eyebrow text-white/30">
              Stickerei Mitte · {product.embroidery}
            </p>

            <div className="mt-8 flex items-baseline gap-3">
              <span className="brand-display text-4xl tracking-wide">{formatEuro(price)}</span>
              {discount > 0 && (
                <span className="text-sm text-white/30 line-through">
                  {formatEuro(product.basePrice)}
                </span>
              )}
              {discount > 0 && (
                <span className="eyebrow bg-[var(--warm)]/20 px-2 py-1 text-[var(--warm)]">
                  −{discount}%
                </span>
              )}
            </div>

            <div className="mt-8">
              <p className="eyebrow mb-3 text-white/35">Größe</p>
              <div className="flex flex-wrap gap-2">
                {sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={`min-w-12 px-3 py-2.5 text-sm transition ${
                      size === s
                        ? "bg-[var(--accent)] text-black"
                        : "bg-white/[0.04] text-white/65 hover:bg-white/[0.08]"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                addItem({
                  product,
                  size,
                  price,
                  collectionName: collection.name,
                })
              }
              className="brand-display mt-9 w-full bg-[var(--accent)] py-4 text-lg tracking-[0.14em] text-black transition hover:brightness-110"
            >
              In den Warenkorb
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
