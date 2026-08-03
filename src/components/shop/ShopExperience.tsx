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
      <div className="flex min-h-[100svh] items-center justify-center text-sm tracking-widest text-white/40 uppercase">
        Kollektion lädt…
      </div>
    ),
  },
);

export function ShopExperience() {
  return (
    <CartProvider>
      <div className="relative min-h-screen overflow-x-hidden bg-[#0c0b09] text-[#f2f0eb]">
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(200,245,66,0.08),transparent_45%),radial-gradient(ellipse_at_80%_20%,rgba(232,93,4,0.07),transparent_40%),linear-gradient(180deg,#141210_0%,#0c0b09_40%,#0a0908_100%)]" />
        <div
          className="pointer-events-none fixed inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />

        <Header />

        <main id="shop" className="relative">
          <section className="relative flex min-h-[70svh] flex-col justify-end px-5 pb-10 pt-28 md:min-h-[55svh] md:px-10 md:pb-14 md:pt-32">
            <div className="mx-auto w-full max-w-7xl">
              <p className="mb-4 text-[11px] tracking-[0.35em] text-[#c8f542] uppercase">
                berraco.de · Drop shop
              </p>
              <h1 className="max-w-3xl font-[family-name:var(--font-display)] text-5xl leading-[0.95] tracking-[0.06em] md:text-7xl lg:text-8xl">
                BERRACO
              </h1>
              <p className="mt-5 max-w-lg text-base text-white/60 md:text-lg">
                Kollektionen fliegen rein. Tippe ein Shirt — der Rest weicht.
                Ältere Drops werden günstiger, bis −20%.
              </p>
              <a
                href="#gefuehle"
                className="mt-8 inline-flex border border-white/20 px-5 py-3 text-xs tracking-[0.2em] uppercase transition hover:border-[#c8f542] hover:text-[#c8f542]"
              >
                Zur ersten Reihe
              </a>
            </div>
          </section>

          {collections.map((collection, index) => (
            <div key={collection.id} id={collection.id}>
              <CollectionRow collection={collection} index={index} />
            </div>
          ))}

          <footer className="relative border-t border-white/10 px-5 py-16 md:px-10">
            <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="font-[family-name:var(--font-display)] text-2xl tracking-[0.2em]">
                  BERRACO
                </p>
                <p className="mt-2 max-w-sm text-sm text-white/45">
                  Prototyp. WordPress auf all-inkl bleibt unberührt — hier nur die
                  neue Shop-Erfahrung.
                </p>
              </div>
              <p className="text-xs tracking-widest text-white/30 uppercase">
                Staffel: neu 0% · −5% · −10% · −15% · max −20%
              </p>
            </div>
          </footer>
        </main>

        <CartDrawer />
      </div>
    </CartProvider>
  );
}
