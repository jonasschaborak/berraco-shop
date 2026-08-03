"use client";

import dynamic from "next/dynamic";
import { collections } from "@/data/collections";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { CartProvider } from "@/components/shop/CartProvider";
import { Header } from "@/components/shop/Header";

const CollectionRow = dynamic(
  () =>
    import("@/components/shop/CollectionRow").then((m) => m.CollectionRow),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[100svh] items-center justify-center">
        <p className="eyebrow text-white/35">Kollektion lädt…</p>
      </div>
    ),
  },
);

export function ShopExperience() {
  return (
    <CartProvider>
      <div className="relative min-h-screen overflow-x-hidden bg-[var(--background)] text-[var(--foreground)]">
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_120%_80%_at_12%_-10%,rgba(200,245,66,0.14),transparent_42%),radial-gradient(ellipse_90%_70%_at_88%_18%,rgba(232,93,4,0.1),transparent_45%),radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(200,245,66,0.04),transparent_55%),linear-gradient(180deg,#12100c_0%,#090807_38%,#070605_100%)]" />
        <div
          className="pointer-events-none fixed inset-0 opacity-[0.045] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />

        <Header />

        <main id="shop" className="relative">
          {collections.map((collection, index) => (
            <div key={collection.id} id={collection.id}>
              <CollectionRow
                collection={collection}
                index={index}
                isHero={index === 0}
              />
            </div>
          ))}

          <footer className="relative px-5 py-20 md:px-10">
            <div className="mx-auto flex max-w-7xl flex-col gap-8 border-t border-white/[0.08] pt-14 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="brand-display text-3xl tracking-[0.18em]">BERRACO</p>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/40">
                  Drop-Shop Prototyp. Stickerei mittig. Ältere Kollektionen bis −20%.
                </p>
              </div>
              <p className="eyebrow text-white/25">
                Staffel · 0% · −5% · −10% · −15% · −20%
              </p>
            </div>
          </footer>
        </main>

        <CartDrawer />
      </div>
    </CartProvider>
  );
}
