"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/* -----------------------------------------------------------------------------
   "Data landscape": a 14×14 field of columns rendered as ONE instanced mesh
   (a single draw call). Heights flow like a living bar chart; taller columns
   shade from graphite to the brand lime. The field tilts toward the pointer,
   and a click sends a ripple outward from the centre.
----------------------------------------------------------------------------- */

const N = 14;
const GAP = 0.62;
const SIZE = 0.44;
const LOW = new THREE.Color("#1d1d1d");
const MID = new THREE.Color("#3a4a1c");
const LIME = new THREE.Color("#c6ff4d");

type Props = {
  pointer: React.RefObject<{ x: number; y: number }>;
  /** performance.now() of the last click, 0 if none. Written by the parent's event handler. */
  rippleAt: React.RefObject<number>;
  still: boolean;
};

function Field({ pointer, rippleAt, still }: Props) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const group = useRef<THREE.Group>(null);
  const time = useRef(0);

  const { geometry, cells, dummy, color } = useMemo(() => {
    const geometry = new THREE.BoxGeometry(SIZE, 1, SIZE);
    geometry.translate(0, 0.5, 0); // grow upward from the floor
    const offset = ((N - 1) * GAP) / 2;
    const cells = Array.from({ length: N * N }, (_, i) => {
      const x = (i % N) * GAP - offset;
      const z = Math.floor(i / N) * GAP - offset;
      return { x, z, d: Math.hypot(x, z), seed: Math.sin(i * 12.9898) * 43758.5453 };
    });
    return { geometry, cells, dummy: new THREE.Object3D(), color: new THREE.Color() };
  }, []);

  useFrame((state, delta) => {
    const m = mesh.current;
    if (!m) return;
    if (!still) time.current += delta;
    const t = time.current;

    const since = rippleAt.current ? (performance.now() - rippleAt.current) / 1000 : 99;

    for (let i = 0; i < cells.length; i++) {
      const c = cells[i];
      // Two interfering waves + a slow per-column drift read as organic "data".
      const wave =
        0.5 + 0.5 * Math.sin(c.x * 0.9 + t * 0.9) * Math.cos(c.z * 0.8 - t * 0.6) * 0.9 + 0.12 * Math.sin(t * 0.7 + (c.seed % 6.28));
      const falloff = Math.max(0, 1 - c.d / 5.2);
      // Ripple: a ring travelling outward from the centre after a click.
      const ring = since < 3 ? Math.exp(-((c.d - since * 3.2) ** 2) * 1.6) * Math.exp(-since * 1.1) : 0;
      const h = 0.08 + (wave * 1.7 + ring * 1.8) * (0.25 + falloff * 0.95);

      dummy.position.set(c.x, 0, c.z);
      dummy.scale.set(1, Math.max(0.04, h), 1);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);

      const k = Math.min(1, h / 2.1);
      color.copy(LOW).lerp(MID, Math.min(1, k * 1.6)).lerp(LIME, Math.max(0, (k - 0.45) / 0.55));
      m.setColorAt(i, color);
    }
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;

    if (group.current) {
      const p = pointer.current ?? { x: 0, y: 0 };
      group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, (still ? 0 : t * 0.06) + p.x * 0.35, 3, delta);
      group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, p.y * 0.12, 3, delta);
    }
    void state;
  });

  return (
    <group ref={group}>
      <instancedMesh ref={mesh} args={[geometry, undefined, N * N]}>
        <meshStandardMaterial roughness={0.35} metalness={0.15} />
      </instancedMesh>
      {/* Faint floor grid + a soft lime glow under the field */}
      <gridHelper args={[N * GAP + 1.2, N + 2, "#2a2a2a", "#1b1b1b"]} position={[0, -0.001, 0]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <circleGeometry args={[4.6, 64]} />
        <meshBasicMaterial color={LIME} transparent opacity={0.05} depthWrite={false} />
      </mesh>
    </group>
  );
}

export default function DataScene(props: Props & { active: boolean }) {
  const { active, ...rest } = props;
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.75]}
      camera={{ position: [11, 8.6, 11], fov: 32 }}
      onCreated={({ camera }) => camera.lookAt(0, 0.4, 0)}
      gl={{ antialias: true, alpha: true }}
      aria-hidden
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 9, 3]} intensity={1.6} />
      <directionalLight position={[-6, 3, -4]} intensity={0.5} color="#c6ff4d" />
      <Field {...rest} />
    </Canvas>
  );
}
