"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { Collection, Product } from "@/data/collections";
import { useCart } from "@/components/shop/CartProvider";
import { formatEuro, getDiscountPercent, getEffectivePrice } from "@/lib/pricing";

const SIZES = ["S", "M", "L", "XL"] as const;

type DetailPanelProps = {
  collection: Collection;
  product: Product | null;
  onClose: () => void;
};

export function DetailPanel({ collection, product, onClose }: DetailPanelProps) {
  const { addItem } = useCart();
  const [size, setSize] = useState<(typeof SIZES)[number]>("M");
  const discount = getDiscountPercent(collection.age);
  const price = product ? getEffectivePrice(product.basePrice, collection.age) : 0;

  useEffect(() => {
    setSize("M");
  }, [product?.id]);

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center p-4 md:inset-y-0 md:right-0 md:left-auto md:w-[min(420px,42vw)] md:items-center md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="pointer-events-auto w-full max-w-md border border-white/10 bg-[#141210]/95 p-6 shadow-2xl backdrop-blur-md md:p-8"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ type: "spring", damping: 26, stiffness: 260 }}
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] tracking-[0.25em] text-[#c8f542] uppercase">
                  {collection.name}
                  {discount > 0 ? ` · −${discount}%` : ""}
                </p>
                <h3 className="mt-2 font-[family-name:var(--font-display)] text-4xl tracking-[0.08em]">
                  {product.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-xs tracking-widest text-white/45 uppercase hover:text-white"
              >
                Zurück
              </button>
            </div>

            <p className="text-sm leading-relaxed text-white/65">{product.description}</p>
            <p className="mt-3 text-xs tracking-wider text-white/40 uppercase">
              Stickerei Mitte · {product.embroidery}
            </p>

            <div className="mt-6 flex items-baseline gap-3">
              <span className="font-[family-name:var(--font-display)] text-3xl tracking-wide">
                {formatEuro(price)}
              </span>
              {discount > 0 && (
                <span className="text-sm text-white/35 line-through">
                  {formatEuro(product.basePrice)}
                </span>
              )}
            </div>

            <div className="mt-6">
              <p className="mb-2 text-[11px] tracking-[0.2em] text-white/45 uppercase">Größe</p>
              <div className="flex gap-2">
                {SIZES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={`min-w-12 border px-3 py-2 text-sm transition ${
                      size === s
                        ? "border-[#c8f542] bg-[#c8f542]/15 text-[#c8f542]"
                        : "border-white/15 text-white/70 hover:border-white/40"
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
              className="mt-8 w-full bg-[#c8f542] py-3.5 font-[family-name:var(--font-display)] tracking-[0.14em] text-black uppercase transition hover:bg-[#d4ff6a]"
            >
              In den Warenkorb
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
