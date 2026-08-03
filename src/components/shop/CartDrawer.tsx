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
            className="fixed inset-0 z-[60] bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />
          <motion.aside
            className="fixed top-0 right-0 z-[70] flex h-full w-full max-w-md flex-col border-l border-white/10 bg-[#12110f] text-[#f2f0eb] shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <h2 className="font-[family-name:var(--font-display)] text-xl tracking-[0.15em]">
                WARENKORB
              </h2>
              <button
                type="button"
                onClick={closeCart}
                className="text-sm tracking-widest text-white/60 uppercase hover:text-white"
              >
                Schließen
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {lines.length === 0 ? (
                <p className="text-sm text-white/50">Noch leer. Wähl ein Shirt.</p>
              ) : (
                <ul className="space-y-4">
                  {lines.map((line, index) => (
                    <li
                      key={`${line.product.id}-${line.size}-${index}`}
                      className="flex items-start justify-between gap-4 border-b border-white/5 pb-4"
                    >
                      <div>
                        <p className="font-[family-name:var(--font-display)] tracking-wider">
                          {line.product.name}
                        </p>
                        <p className="mt-1 text-xs text-white/45">
                          {line.collectionName} · Größe {line.size}
                        </p>
                        <p className="mt-2 text-sm">{formatEuro(line.price)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-xs text-white/40 uppercase hover:text-white"
                      >
                        Weg
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="border-t border-white/10 px-6 py-5">
              <div className="mb-4 flex justify-between text-sm">
                <span className="text-white/50">Summe</span>
                <span>{formatEuro(total)}</span>
              </div>
              <button
                type="button"
                disabled={lines.length === 0}
                className="w-full bg-[#c8f542] py-3 font-[family-name:var(--font-display)] tracking-[0.12em] text-black uppercase transition enabled:hover:bg-[#d4ff6a] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Checkout (bald)
              </button>
              {lines.length > 0 && (
                <button
                  type="button"
                  onClick={clear}
                  className="mt-3 w-full text-center text-xs text-white/40 uppercase hover:text-white"
                >
                  Leeren
                </button>
              )}
              <p className="mt-3 text-center text-[11px] text-white/35">
                Prototyp — keine echte Zahlung.
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
