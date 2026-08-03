"use client";

import { ContactShadows, Environment, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useState } from "react";
import type { Collection } from "@/data/collections";
import { DetailPanel } from "@/components/shop/DetailPanel";
import { ShirtMesh } from "@/components/shop/ShirtMesh";
import { formatEuro, getDiscountPercent, getEffectivePrice } from "@/lib/pricing";

type CollectionRowProps = {
  collection: Collection;
  index: number;
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
  const spacing = mobile ? 1.35 : 1.85;

  const layouts = useMemo(() => {
    return collection.products.map((product, i) => {
      const restX = (i - (count - 1) / 2) * spacing;
      const flyIn: [number, number, number] = [restX + (i % 2 === 0 ? -6 : 6), 1.5 + i * 0.15, -2];
      const rest: [number, number, number] = [restX, 0, 0];
      const focused: [number, number, number] = mobile
        ? [0, 0.35, 1.1]
        : [-1.35, 0.1, 0.8];
      const exit: [number, number, number] = [
        restX > 0 ? restX + 5.5 : restX - 5.5,
        0.4,
        -1.5,
      ];
      return { product, flyIn, rest, focused, exit };
    });
  }, [collection.products, count, mobile, spacing]);

  return (
    <>
      <PerspectiveCamera
        makeDefault
        position={mobile ? [0, 0.2, 7.4] : [0, 0.35, 6.2]}
        fov={mobile ? 42 : 38}
      />
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 6, 3]} intensity={1.15} castShadow />
      <directionalLight position={[-3, 2, -2]} intensity={0.35} color="#c8f542" />
      <Environment preset="city" />

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

      {layouts.map(({ product, flyIn, rest, focused, exit }) => {
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
            onSelect={() => {
              if (isSelected) onDeselect();
              else onSelect(product.id);
            }}
          />
        );
      })}

      <ContactShadows
        position={[0, -1.05, 0]}
        opacity={0.45}
        scale={14}
        blur={2.4}
        far={4}
      />
    </>
  );
}

export function CollectionRow({ collection, index }: CollectionRowProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const mobile = useIsMobile();
  const selected = collection.products.find((p) => p.id === selectedId) ?? null;
  const discount = getDiscountPercent(collection.age);

  return (
    <section
      className="relative min-h-[100svh] border-t border-white/5"
      style={{ zIndex: 10 - index }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 px-5 pt-8 md:px-10 md:pt-10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[11px] tracking-[0.3em] text-white/40 uppercase">
              Kollektion {String(index + 1).padStart(2, "0")}
              {discount > 0 ? ` · Staffel −${discount}%` : " · Neu"}
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-display)] text-4xl tracking-[0.12em] md:text-6xl">
              {collection.name}
            </h2>
            <p className="mt-2 max-w-md text-sm text-white/55">{collection.tagline}</p>
          </div>
          {!selected && (
            <p className="text-xs tracking-widest text-white/35 uppercase">
              Tippe ein Shirt · ab{" "}
              {formatEuro(
                Math.min(
                  ...collection.products.map((p) =>
                    getEffectivePrice(p.basePrice, collection.age),
                  ),
                ),
              )}
            </p>
          )}
        </div>
      </div>

      <div className="h-[100svh] w-full">
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

      {/* Mobile product dots — hidden while detail is open */}
      {!selected && (
        <div className="pointer-events-none absolute inset-x-0 bottom-6 z-10 flex justify-center gap-2 px-4 md:hidden">
          {collection.products.map((p) => (
            <button
              key={p.id}
              type="button"
              className="pointer-events-auto h-1.5 w-8 bg-white/25 transition hover:bg-white/50"
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
