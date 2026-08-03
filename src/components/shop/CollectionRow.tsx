"use client";

import { ContactShadows, Environment, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { motion, useScroll, useTransform } from "framer-motion";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import type { Collection } from "@/data/collections";
import { DetailPanel } from "@/components/shop/DetailPanel";
import { ShirtMesh } from "@/components/shop/ShirtMesh";
import { formatEuro, getDiscountPercent, getEffectivePrice } from "@/lib/pricing";

type CollectionRowProps = {
  collection: Collection;
  index: number;
  isHero?: boolean;
};

function useIsMobile(breakpoint = 768) {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [breakpoint]);
  return mobile;
}

function RowScene({
  collection,
  selectedId,
  onSelect,
  onDeselect,
  mobile,
}: {
  collection: Collection;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onDeselect: () => void;
  mobile: boolean;
}) {
  const count = collection.products.length;
  const spacing = mobile ? 1.35 : 1.9;
  const accent = collection.products[0]?.accent ?? "#c8f542";

  const layouts = useMemo(() => {
    return collection.products.map((product, i) => {
      const restX = (i - (count - 1) / 2) * spacing;
      const flyIn: [number, number, number] = [
        restX + (i % 2 === 0 ? -7 : 7),
        2.2 + i * 0.2,
        -3.5,
      ];
      const rest: [number, number, number] = [restX, 0, 0];
      const focused: [number, number, number] = mobile
        ? [0, 0.25, 1.15]
        : [-1.45, 0.05, 0.85];
      const exit: [number, number, number] = [
        restX > 0 ? restX + 6 : restX - 6,
        0.55,
        -2,
      ];
      return { product, flyIn, rest, focused, exit, delay: i * 0.09 };
    });
  }, [collection.products, count, mobile, spacing]);

  return (
    <>
      <PerspectiveCamera
        makeDefault
        position={mobile ? [0, 0.15, 7.6] : [0, 0.3, 6.4]}
        fov={mobile ? 42 : 36}
      />
      <ambientLight intensity={0.42} />
      <directionalLight position={[4.5, 7, 3]} intensity={1.25} castShadow />
      <directionalLight position={[-4, 2.5, -2]} intensity={0.55} color={accent} />
      <pointLight position={[0, 1.5, 3]} intensity={0.35} color="#fff6e8" />
      <Environment preset="warehouse" />

      <mesh
        visible={false}
        onClick={(e) => {
          e.stopPropagation();
          onDeselect();
        }}
        position={[0, 0, -1]}
      >
        <planeGeometry args={[40, 20]} />
      </mesh>

      {layouts.map(({ product, flyIn, rest, focused, exit, delay }) => {
        const isSelected = selectedId === product.id;
        const hasSelection = selectedId !== null;
        const visible = !hasSelection || isSelected;
        const target = !hasSelection ? rest : isSelected ? focused : exit;

        return (
          <ShirtMesh
            key={product.id}
            product={product}
            position={flyIn}
            targetPosition={target}
            visible={visible}
            selected={isSelected}
            dimmed={false}
            delay={delay}
            onSelect={() => {
              if (isSelected) onDeselect();
              else onSelect(product.id);
            }}
          />
        );
      })}

      <ContactShadows
        position={[0, -1.08, 0]}
        opacity={0.5}
        scale={16}
        blur={2.6}
        far={4.5}
      />
    </>
  );
}

export function CollectionRow({ collection, index, isHero = false }: CollectionRowProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const mobile = useIsMobile();
  const selected = collection.products.find((p) => p.id === selectedId) ?? null;
  const discount = getDiscountPercent(collection.age);
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const brandY = useTransform(scrollYProgress, [0, 1], [0, isHero ? -80 : 0]);
  const brandOpacity = useTransform(
    scrollYProgress,
    [0, 0.55],
    [1, isHero ? 0.15 : 1],
  );

  const minPrice = Math.min(
    ...collection.products.map((p) => getEffectivePrice(p.basePrice, collection.age)),
  );

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100svh]"
      style={{ zIndex: 10 - index }}
    >
      <motion.div
        className={`pointer-events-none absolute inset-x-0 z-10 px-5 md:px-10 ${
          isHero ? "top-0 pt-24 md:pt-28" : "top-0 pt-10 md:pt-12"
        }`}
        style={isHero ? { y: brandY, opacity: brandOpacity } : undefined}
      >
        <div className="mx-auto max-w-7xl">
          {isHero ? (
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: selected ? 0.2 : 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="eyebrow text-[var(--accent)]">Drop shop · berraco.de</p>
              <h1 className="brand-display mt-3 text-[clamp(4.5rem,16vw,11rem)] tracking-[0.02em]">
                BERRACO
              </h1>
              <p className="mt-4 max-w-md text-base text-white/55 md:text-lg">
                Tippe ein Shirt — der Rest weicht. Ältere Drops bis −20%.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-6">
                <span className="eyebrow text-white/35">
                  {collection.name} · Neu · ab {formatEuro(minPrice)}
                </span>
                <a
                  href={`#${collection.id}`}
                  className="pointer-events-auto eyebrow scroll-cue inline-flex items-center gap-2 text-white/50"
                >
                  Tippe oder scroll
                  <span aria-hidden>↓</span>
                </a>
              </div>
            </motion.div>
          ) : (
            <div
              className={`flex flex-wrap items-end justify-between gap-4 transition-opacity duration-500 ${
                selected ? "opacity-25" : "opacity-100"
              }`}
            >
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <p className="eyebrow text-white/35">
                    Kollektion {String(index + 1).padStart(2, "0")}
                  </p>
                  <span
                    className={`eyebrow px-2 py-1 ${
                      discount > 0
                        ? "bg-[var(--warm)]/15 text-[var(--warm)]"
                        : "bg-[var(--accent)]/15 text-[var(--accent)]"
                    }`}
                  >
                    {discount > 0 ? `−${discount}%` : "Neu"}
                  </span>
                </div>
                <h2 className="brand-display mt-3 text-5xl tracking-[0.06em] md:text-7xl">
                  {collection.name}
                </h2>
                <p className="mt-2 max-w-md text-sm text-white/50">{collection.tagline}</p>
              </div>
              {!selected && (
                <p className="eyebrow text-white/30">ab {formatEuro(minPrice)}</p>
              )}
            </div>
          )}
        </div>
      </motion.div>

      <div className={`w-full ${isHero ? "h-[100svh]" : "h-[100svh]"}`}>
        <Canvas
          dpr={[1, 1.75]}
          gl={{ antialias: true, alpha: true }}
          onPointerMissed={() => setSelectedId(null)}
          className="!bg-transparent"
        >
          <Suspense fallback={null}>
            <RowScene
              collection={collection}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onDeselect={() => setSelectedId(null)}
              mobile={mobile}
            />
          </Suspense>
        </Canvas>
      </div>

      {!selected && !isHero && (
        <div className="pointer-events-none absolute inset-x-0 bottom-6 z-10 flex justify-center gap-2 px-4 md:hidden">
          {collection.products.map((p) => (
            <button
              key={p.id}
              type="button"
              className="pointer-events-auto h-1 w-7 bg-white/20 transition hover:bg-white/50"
              onClick={() => setSelectedId(p.id)}
              aria-label={p.name}
            />
          ))}
        </div>
      )}

      {isHero && !selected && (
        <div className="pointer-events-none absolute inset-x-0 bottom-8 z-10 flex justify-center gap-2 md:hidden">
          {collection.products.map((p) => (
            <button
              key={p.id}
              type="button"
              className="pointer-events-auto h-1 w-7 bg-white/25 transition hover:bg-[var(--accent)]"
              onClick={() => setSelectedId(p.id)}
              aria-label={p.name}
            />
          ))}
        </div>
      )}

      <DetailPanel
        collection={collection}
        product={selected}
        onClose={() => setSelectedId(null)}
      />
    </section>
  );
}
