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
  delay?: number;
  onSelect: () => void;
};

export function ShirtMesh({
  product,
  position,
  targetPosition,
  visible,
  selected,
  dimmed,
  delay = 0,
  onSelect,
}: ShirtMeshProps) {
  const group = useRef<THREE.Group>(null);
  const start = useMemo(() => new THREE.Vector3(...position), [position]);
  const target = useMemo(() => new THREE.Vector3(...targetPosition), [targetPosition]);
  const current = useRef(start.clone());
  const opacity = useRef(0);
  const scale = useRef(0.2);
  const hover = useRef(false);
  const born = useRef(performance.now());
  const ready = useRef(false);

  useFrame((_, delta) => {
    if (!group.current) return;

    const elapsed = (performance.now() - born.current) / 1000;
    if (!ready.current && elapsed < delay) {
      group.current.visible = false;
      return;
    }
    ready.current = true;
    group.current.visible = true;

    const lerp = 1 - Math.exp(-(selected ? 5.2 : 3.8) * delta);
    current.current.lerp(target, lerp);
    group.current.position.copy(current.current);

    const wantOpacity = visible ? (dimmed ? 0.16 : 1) : 0;
    opacity.current = THREE.MathUtils.damp(opacity.current, wantOpacity, 5.5, delta);
    scale.current = THREE.MathUtils.damp(
      scale.current,
      visible ? (selected ? 1.18 : hover.current ? 1.05 : 1) : 0.2,
      selected ? 8 : 5.5,
      delta,
    );
    group.current.scale.setScalar(scale.current);

    const bob = Math.sin(Date.now() * 0.0012 + target.x * 1.4) * (selected ? 0.02 : 0.045);
    group.current.position.y = current.current.y + bob;

    const wantRotY = selected ? 0.12 : hover.current ? 0.18 : 0.06;
    const wantRotX = selected ? -0.04 : hover.current ? -0.06 : -0.02;
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, wantRotY, 4, delta);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, wantRotX, 4, delta);

    group.current.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (mesh.material && "opacity" in mesh.material) {
        const mat = mesh.material as THREE.MeshStandardMaterial;
        mat.transparent = true;
        mat.opacity = opacity.current;
        mat.depthWrite = opacity.current > 0.45;
      }
    });
  });

  return (
    <group
      ref={group}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        if (visible && ready.current) onSelect();
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
      {/* Soft torso */}
      <mesh castShadow position={[0, 0.02, 0]}>
        <boxGeometry args={[1.02, 1.28, 0.18]} />
        <meshStandardMaterial color={product.color} roughness={0.78} metalness={0.02} />
      </mesh>
      {/* Hem taper hint */}
      <mesh castShadow position={[0, -0.58, 0.01]}>
        <boxGeometry args={[1.06, 0.18, 0.16]} />
        <meshStandardMaterial color={product.color} roughness={0.8} metalness={0.02} />
      </mesh>
      {/* Collar ring */}
      <mesh position={[0, 0.68, 0.01]} rotation={[0.15, 0, 0]}>
        <torusGeometry args={[0.2, 0.045, 10, 24]} />
        <meshStandardMaterial color={product.color} roughness={0.7} />
      </mesh>
      {/* Left sleeve */}
      <mesh castShadow position={[-0.68, 0.4, 0]} rotation={[0.1, 0, 0.62]}>
        <boxGeometry args={[0.52, 0.36, 0.17]} />
        <meshStandardMaterial color={product.color} roughness={0.78} />
      </mesh>
      {/* Right sleeve */}
      <mesh castShadow position={[0.68, 0.4, 0]} rotation={[0.1, 0, -0.62]}>
        <boxGeometry args={[0.52, 0.36, 0.17]} />
        <meshStandardMaterial color={product.color} roughness={0.78} />
      </mesh>
      {/* Embroidery relief plate */}
      <mesh position={[0, 0.08, 0.1]}>
        <boxGeometry args={[0.72, 0.28, 0.02]} />
        <meshStandardMaterial
          color={product.color}
          roughness={0.55}
          metalness={0.08}
          transparent
          opacity={0.35}
        />
      </mesh>
      <Text
        position={[0, 0.08, 0.13]}
        fontSize={0.2}
        color={product.accent}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.1}
        outlineWidth={0.004}
        outlineColor="#000000"
        outlineOpacity={0.35}
      >
        {product.embroidery}
      </Text>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.9, 0]}>
        <circleGeometry args={[0.5, 28]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.22} />
      </mesh>
    </group>
  );
}
