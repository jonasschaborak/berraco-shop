"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/components/shop/CartProvider";
import { formatEuro } from "@/lib/pricing";

export function CartDrawer() {
  const { lines, isOpen, closeCart, removeItem, clear } = useCart();
  const total = lines.reduce((sum, line) => sum + line.price, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.button
            type="button"
            aria-label="Close bag"
            className="fixed inset-0 z-[60] bg-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />
          <motion.aside
            className="fixed top-0 right-0 z-[70] flex h-full w-full max-w-md flex-col bg-[#0a0a0a] text-white"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 290 }}
          >
            <div className="flex items-center justify-between px-7 py-6">
              <h2 className="text-xs tracking-[0.35em]">BAG</h2>
              <button
                type="button"
                onClick={closeCart}
                className="eyebrow text-white/40 transition hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-7 pb-4">
              {lines.length === 0 ? (
                <p className="text-sm text-white/35">Your bag is empty.</p>
              ) : (
                <ul className="space-y-5">
                  {lines.map((line, index) => (
                    <li
                      key={`${line.product.id}-${line.size}-${index}`}
                      className="flex items-start justify-between gap-4 border-b border-white/[0.08] pb-5"
                    >
                      <div>
                        <p className="text-sm tracking-[0.2em]">
                          {line.product.name} / {line.product.subtitle}
                        </p>
                        <p className="mt-2 text-xs text-white/35">
                          {line.collectionName} · {line.size}
                        </p>
                        <p className="mt-3 text-sm text-[var(--accent)]">
                          {formatEuro(line.price)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="eyebrow text-white/30 transition hover:text-white"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="px-7 py-6">
              <div className="mb-5 flex items-baseline justify-between">
                <span className="eyebrow text-white/35">Total</span>
                <span className="text-lg text-[var(--accent)]">{formatEuro(total)}</span>
              </div>
              <button
                type="button"
                disabled={lines.length === 0}
                className="w-full bg-[var(--accent)] py-3.5 text-[0.65rem] tracking-[0.32em] text-white transition hover:bg-[var(--accent-hover)] disabled:cursor-not-allowed disabled:opacity-35"
              >
                CHECKOUT SOON
              </button>
              {lines.length > 0 && (
                <button
                  type="button"
                  onClick={clear}
                  className="eyebrow mt-4 w-full text-center text-white/30 transition hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
