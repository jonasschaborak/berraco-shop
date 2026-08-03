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
            aria-label="Warenkorb schließen"
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />
          <motion.aside
            className="fixed top-0 right-0 z-[70] flex h-full w-full max-w-md flex-col bg-[var(--surface)] text-[var(--foreground)]"
            style={{
              boxShadow: "-24px 0 80px rgba(0,0,0,0.45)",
            }}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 290 }}
          >
            <div className="flex items-center justify-between px-7 py-6">
              <h2 className="brand-display text-2xl tracking-[0.14em]">WARENKORB</h2>
              <button
                type="button"
                onClick={closeCart}
                className="eyebrow text-white/45 transition hover:text-white"
              >
                Schließen
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-7 pb-4">
              {lines.length === 0 ? (
                <p className="text-sm text-white/40">Noch leer. Wähl ein Shirt.</p>
              ) : (
                <ul className="space-y-5">
                  {lines.map((line, index) => (
                    <li
                      key={`${line.product.id}-${line.size}-${index}`}
                      className="flex items-start justify-between gap-4 border-b border-white/[0.06] pb-5"
                    >
                      <div>
                        <p className="brand-display text-xl tracking-wider">
                          {line.product.name}
                        </p>
                        <p className="mt-1 text-xs text-white/40">
                          {line.collectionName} · {line.size}
                        </p>
                        <p className="mt-3 text-sm">{formatEuro(line.price)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="eyebrow text-white/30 transition hover:text-white"
                      >
                        Weg
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="px-7 py-6">
              <div className="mb-5 flex items-baseline justify-between">
                <span className="eyebrow text-white/35">Summe</span>
                <span className="brand-display text-3xl">{formatEuro(total)}</span>
              </div>
              <button
                type="button"
                disabled={lines.length === 0}
                className="brand-display w-full bg-[var(--accent)] py-4 text-lg tracking-[0.12em] text-black transition enabled:hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-35"
              >
                Checkout (bald)
              </button>
              {lines.length > 0 && (
                <button
                  type="button"
                  onClick={clear}
                  className="eyebrow mt-4 w-full text-center text-white/30 transition hover:text-white"
                >
                  Leeren
                </button>
              )}
              <p className="mt-4 text-center text-[11px] text-white/25">
                Prototyp — keine echte Zahlung.
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
