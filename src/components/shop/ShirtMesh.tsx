"use client";

import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { Product } from "@/data/collections";

type ShirtMeshProps = {
  product: Product;
  position: [number, number, number];
  targetPosition: [number, number, number];
  visible: boolean;
  selected: boolean;
  dimmed: boolean;
  onSelect: () => void;
};

export function ShirtMesh({
  product,
  position,
  targetPosition,
  visible,
  selected,
  dimmed,
  onSelect,
}: ShirtMeshProps) {
  const group = useRef<THREE.Group>(null);
  const start = useMemo(() => new THREE.Vector3(...position), [position]);
  const target = useMemo(() => new THREE.Vector3(...targetPosition), [targetPosition]);
  const current = useRef(start.clone());
  const opacity = useRef(0);
  const scale = useRef(0.35);
  const hover = useRef(false);

  useFrame((_, delta) => {
    if (!group.current) return;

    current.current.lerp(target, 1 - Math.exp(-4.2 * delta));
    group.current.position.copy(current.current);

    const wantOpacity = visible ? (dimmed ? 0.18 : 1) : 0;
    opacity.current = THREE.MathUtils.damp(opacity.current, wantOpacity, 6, delta);
    scale.current = THREE.MathUtils.damp(
      scale.current,
      visible ? (selected ? 1.15 : hover.current ? 1.06 : 1) : 0.35,
      7,
      delta,
    );
    group.current.scale.setScalar(scale.current);

    const bob = Math.sin(Date.now() * 0.0015 + target.x) * 0.04;
    group.current.position.y = current.current.y + bob;
    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y,
      selected ? 0.15 : hover.current ? 0.25 : 0.08,
      4,
      delta,
    );

    group.current.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (mesh.material && "opacity" in mesh.material) {
        const mat = mesh.material as THREE.MeshStandardMaterial;
        mat.transparent = true;
        mat.opacity = opacity.current;
        mat.depthWrite = opacity.current > 0.5;
      }
    });
  });

  return (
    <group
      ref={group}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        if (visible) onSelect();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        hover.current = true;
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        hover.current = false;
        document.body.style.cursor = "auto";
      }}
    >
      {/* Torso */}
      <mesh castShadow position={[0, 0.05, 0]}>
        <boxGeometry args={[1.05, 1.25, 0.22]} />
        <meshStandardMaterial color={product.color} roughness={0.72} metalness={0.05} />
      </mesh>
      {/* Neck opening hint */}
      <mesh position={[0, 0.72, 0.02]}>
        <cylinderGeometry args={[0.22, 0.26, 0.12, 16]} />
        <meshStandardMaterial color={product.color} roughness={0.75} />
      </mesh>
      {/* Left sleeve */}
      <mesh castShadow position={[-0.72, 0.38, 0]} rotation={[0, 0, 0.55]}>
        <boxGeometry args={[0.55, 0.38, 0.2]} />
        <meshStandardMaterial color={product.color} roughness={0.72} />
      </mesh>
      {/* Right sleeve */}
      <mesh castShadow position={[0.72, 0.38, 0]} rotation={[0, 0, -0.55]}>
        <boxGeometry args={[0.55, 0.38, 0.2]} />
        <meshStandardMaterial color={product.color} roughness={0.72} />
      </mesh>
      {/* Embroidery */}
      <Text
        position={[0, 0.1, 0.12]}
        fontSize={0.22}
        color={product.accent}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.08}
        font={undefined}
      >
        {product.embroidery}
      </Text>
      {/* Soft ground shadow disc */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.85, 0]}>
        <circleGeometry args={[0.55, 24]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.25} />
      </mesh>
    </group>
  );
}
