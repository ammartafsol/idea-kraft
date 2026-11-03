"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useCallback, useMemo, useRef, type PointerEvent } from "react";
import * as THREE from "three";
import { LAND_DOTS } from "./land-dots";

/* -----------------------------------------------------------------------------
   Dotted 3D globe that faces the studio.
   - ~4.7k land dots (Natural Earth) rendered as round GPU points.
   - Dots near the studio glow lime; the pin has a beam, a head and pulsing rings.
   - Arcs travel in from a handful of world cities ("working worldwide").
   - Drag to spin; on release it eases back so the pin faces you again.
----------------------------------------------------------------------------- */

const D2R = Math.PI / 180;
const LIME = new THREE.Color("#c6ff4d");

export function latLngToVector(lat: number, lng: number, radius = 1) {
  const phi = (90 - lat) * D2R;
  const theta = (lng + 180) * D2R;
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

const ORIGINS: { name: string; lat: number; lng: number }[] = [
  { name: "London", lat: 51.5, lng: -0.13 },
  { name: "Berlin", lat: 52.52, lng: 13.4 },
  { name: "Dubai", lat: 25.2, lng: 55.27 },
  { name: "São Paulo", lat: -23.55, lng: -46.63 },
  { name: "San Francisco", lat: 37.77, lng: -122.42 },
  { name: "Mexico City", lat: 19.43, lng: -99.13 },
];

/* ---------- shaders ---------- */

const dotsVertex = /* glsl */ `
uniform float uSize;
uniform float uPixelRatio;
uniform vec3 uPin;
attribute float aRand;
varying float vFacing;
varying float vRand;
varying float vNear;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vec3 n = normalize(normalMatrix * normalize(position));
  vFacing = dot(n, normalize(-mv.xyz));
  vRand = aRand;
  vNear = 1.0 - smoothstep(0.0, 0.32, distance(normalize(position), uPin));
  gl_PointSize = uSize * uPixelRatio * (1.0 + vNear * 0.6) / -mv.z;
  gl_Position = projectionMatrix * mv;
}`;

const dotsFragment = /* glsl */ `
uniform float uTime;
uniform vec3 uBase;
uniform vec3 uAccent;
varying float vFacing;
varying float vRand;
varying float vNear;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  if (dot(c, c) > 0.25) discard;
  float twinkle = 0.82 + 0.18 * sin(uTime * 1.4 + vRand * 6.2831);
  float limb = smoothstep(-0.05, 0.45, vFacing);
  vec3 col = mix(uBase, uAccent, vNear);
  float alpha = (0.35 + 0.65 * limb) * mix(0.55, 1.0, vNear) * twinkle;
  gl_FragColor = vec4(col, alpha);
}`;

const sphereVertex = /* glsl */ `
varying vec3 vN;
varying vec3 vV;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vN = normalize(normalMatrix * normal);
  vV = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}`;

const sphereFragment = /* glsl */ `
uniform vec3 uAccent;
varying vec3 vN;
varying vec3 vV;
void main() {
  float fres = pow(1.0 - max(dot(vN, vV), 0.0), 3.0);
  vec3 col = mix(vec3(0.05), uAccent * 0.4, fres * 0.45);
  gl_FragColor = vec4(col, 1.0);
}`;

const atmosphereFragment = /* glsl */ `
uniform vec3 uAccent;
varying vec3 vN;
varying vec3 vV;
void main() {
  // Thin halo: zero facing the camera, rising only at the very edge of the shell.
  float rim = pow(1.0 - max(dot(vN, vV), 0.0), 5.0);
  gl_FragColor = vec4(uAccent, rim * 0.42);
}`;

const arcVertex = /* glsl */ `
attribute float aT;
varying float vT;
void main() {
  vT = aT;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const arcFragment = /* glsl */ `
uniform float uTime;
uniform float uOffset;
uniform vec3 uAccent;
uniform float uStill;
varying float vT;
void main() {
  float head = fract(uTime * 0.22 + uOffset) * 1.4;
  float trail = smoothstep(head - 0.45, head, vT) * step(vT, head);
  float alpha = mix(max(0.12, trail * 0.95), 0.45, uStill);
  gl_FragColor = vec4(uAccent, alpha);
}`;

/* ---------- scene ---------- */

export type GlobeDrag = {
  /** User yaw/pitch offset (radians) at the end of the last drag. */
  yaw: number;
  pitch: number;
  dragging: boolean;
  releasedAt: number;
};

/** Offset currently applied: follows the finger while dragging, then eases home after a short pause. */
export function displayedOffset(d: GlobeDrag, now: number) {
  if (d.dragging) return { yaw: d.yaw, pitch: d.pitch };
  const k = Math.exp(-Math.max(0, now - d.releasedAt - 1400) / 650);
  return { yaw: d.yaw * k, pitch: d.pitch * k };
}

type GlobeProps = {
  lat: number;
  lng: number;
  still: boolean;
  drag: React.RefObject<GlobeDrag>;
  onPin: (x: number, y: number, visible: number) => void;
};

function Globe({ lat, lng, still, drag, onPin }: GlobeProps) {
  const tilt = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const pinHead = useRef<THREE.Mesh>(null);
  const rings = useRef<THREE.Mesh[]>([]);
  const dotsMat = useRef<THREE.ShaderMaterial>(null);
  const arcMats = useRef<THREE.ShaderMaterial[]>([]);
  const { camera, size, gl } = useThree();
  const scratch = useMemo(() => ({ v: new THREE.Vector3(), n: new THREE.Vector3(), cam: new THREE.Vector3() }), []);

  const pin = useMemo(() => latLngToVector(lat, lng, 1), [lat, lng]);
  // Rotations that bring the pin to face the camera (+z); the tilt is partial so the pin sits a touch above centre.
  const home = useMemo(
    () => ({ yaw: Math.atan2(-pin.x, pin.z), pitch: Math.atan2(pin.y, Math.hypot(pin.x, pin.z)) * 0.78 }),
    [pin],
  );

  const dots = useMemo(() => {
    const count = LAND_DOTS.length / 2;
    const positions = new Float32Array(count * 3);
    const rand = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const v = latLngToVector(LAND_DOTS[i * 2], LAND_DOTS[i * 2 + 1], 1.003);
      positions.set([v.x, v.y, v.z], i * 3);
      rand[i] = (Math.sin(i * 12.9898) * 43758.5453) % 1;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aRand", new THREE.BufferAttribute(rand, 1));
    return geo;
  }, []);

  const dotUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: 5.2 },
      uPixelRatio: { value: Math.min(gl.getPixelRatio(), 2) },
      uPin: { value: pin.clone().normalize() },
      uBase: { value: new THREE.Color("#e9e9e4") },
      uAccent: { value: LIME },
    }),
    [gl, pin],
  );

  const arcs = useMemo(
    () =>
      ORIGINS.map((o, i) => {
        const a = latLngToVector(o.lat, o.lng, 1).normalize();
        const b = pin.clone().normalize();
        const angle = a.angleTo(b);
        const steps = 72;
        const pts: number[] = [];
        const ts: number[] = [];
        for (let s = 0; s <= steps; s++) {
          const t = s / steps;
          // Spherical interpolation, lifted into an arc whose height scales with distance.
          const p = new THREE.Vector3().copy(a).lerp(b, t).normalize();
          const sinA = Math.sin(angle);
          if (sinA > 1e-4) {
            p.copy(a).multiplyScalar(Math.sin((1 - t) * angle) / sinA).add(b.clone().multiplyScalar(Math.sin(t * angle) / sinA));
          }
          p.multiplyScalar(1.005 + Math.sin(Math.PI * t) * (0.08 + angle * 0.12));
          pts.push(p.x, p.y, p.z);
          ts.push(t);
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
        geo.setAttribute("aT", new THREE.Float32BufferAttribute(ts, 1));
        const material = new THREE.ShaderMaterial({
          vertexShader: arcVertex,
          fragmentShader: arcFragment,
          uniforms: { uTime: { value: 0 }, uOffset: { value: i / ORIGINS.length }, uAccent: { value: LIME }, uStill: { value: still ? 1 : 0 } },
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        });
        return { line: new THREE.Line(geo, material), origin: a.clone().multiplyScalar(1.006) };
      }),
    [pin, still],
  );

  // Orient the pin group so its +z axis points straight out of the surface.
  const pinQuaternion = useMemo(() => {
    const m = new THREE.Matrix4().lookAt(new THREE.Vector3(), pin, new THREE.Vector3(0, 1, 0));
    return new THREE.Quaternion().setFromRotationMatrix(m).multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI));
  }, [pin]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const now = performance.now();
    if (dotsMat.current) dotsMat.current.uniforms.uTime.value = t;
    arcMats.current.forEach((m) => m && (m.uniforms.uTime.value = still ? 0 : t));

    const d = drag.current;
    const off = d ? displayedOffset(d, now) : { yaw: 0, pitch: 0 };
    const sway = still ? 0 : Math.sin(t * 0.25) * 0.32;
    if (spin.current) {
      spin.current.rotation.y = THREE.MathUtils.damp(spin.current.rotation.y, home.yaw + sway + off.yaw, d?.dragging ? 14 : 3, delta);
    }
    if (tilt.current) {
      tilt.current.rotation.x = THREE.MathUtils.damp(tilt.current.rotation.x, home.pitch + off.pitch, d?.dragging ? 14 : 3, delta);
    }

    rings.current.forEach((ring, i) => {
      if (!ring) return;
      const p = still ? 0.5 : (t * 0.55 + i * 0.5) % 1;
      ring.scale.setScalar(1 + p * 4.5);
      (ring.material as THREE.MeshBasicMaterial).opacity = (1 - p) * 0.9;
    });

    // Project the pin head to screen space for the HTML label, fading it as the pin turns away.
    if (pinHead.current) {
      pinHead.current.getWorldPosition(scratch.v);
      scratch.n.copy(scratch.v).normalize();
      scratch.cam.copy(camera.position).normalize();
      const facing = scratch.n.dot(scratch.cam);
      scratch.v.project(camera);
      onPin((scratch.v.x * 0.5 + 0.5) * size.width, (-scratch.v.y * 0.5 + 0.5) * size.height, THREE.MathUtils.smoothstep(facing, 0.15, 0.45));
    }
  });

  return (
    <group ref={tilt}>
      <group ref={spin}>
        <mesh>
          <sphereGeometry args={[1, 64, 64]} />
          <shaderMaterial vertexShader={sphereVertex} fragmentShader={sphereFragment} uniforms={{ uAccent: { value: LIME } }} />
        </mesh>

        <points geometry={dots}>
          <shaderMaterial
            ref={dotsMat}
            vertexShader={dotsVertex}
            fragmentShader={dotsFragment}
            uniforms={dotUniforms}
            transparent
            depthWrite={false}
          />
        </points>

        {arcs.map((arc, i) => (
          <group key={i}>
            <primitive
              object={arc.line}
              ref={(line: THREE.Line | null) => {
                if (line) arcMats.current[i] = line.material as THREE.ShaderMaterial;
              }}
            />
            <mesh position={arc.origin}>
              <sphereGeometry args={[0.012, 12, 12]} />
              <meshBasicMaterial color="#f2f2ee" />
            </mesh>
          </group>
        ))}

        {/* The pin */}
        <group position={pin} quaternion={pinQuaternion}>
          <mesh position={[0, 0, 0.13]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.0045, 0.0045, 0.26, 8]} />
            <meshBasicMaterial color={LIME} />
          </mesh>
          <mesh ref={pinHead} position={[0, 0, 0.27]}>
            <sphereGeometry args={[0.024, 20, 20]} />
            <meshBasicMaterial color={LIME} />
          </mesh>
          {[0, 1].map((i) => (
            <mesh
              key={i}
              position={[0, 0, 0.004]}
              ref={(m: THREE.Mesh | null) => {
                if (m) rings.current[i] = m;
              }}
            >
              <ringGeometry args={[0.022, 0.03, 48]} />
              <meshBasicMaterial color={LIME} transparent depthWrite={false} side={THREE.DoubleSide} />
            </mesh>
          ))}
        </group>
      </group>

      {/* Atmosphere: a slightly larger back-facing shell with an additive rim glow. */}
      <mesh scale={1.035}>
        <sphereGeometry args={[1, 64, 64]} />
        <shaderMaterial
          vertexShader={sphereVertex}
          fragmentShader={atmosphereFragment}
          uniforms={{ uAccent: { value: LIME } }}
          side={THREE.FrontSide}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

export default function GlobeScene({
  lat,
  lng,
  still,
  active,
  compact,
  labelRef,
}: {
  lat: number;
  lng: number;
  still: boolean;
  active: boolean;
  compact: boolean;
  labelRef: React.RefObject<HTMLDivElement | null>;
}) {
  const drag = useRef<GlobeDrag>({ yaw: 0, pitch: 0, dragging: false, releasedAt: 0 });
  const last = useRef<{ x: number; y: number } | null>(null);

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    // Rebase on whatever offset is currently shown, so a new drag never jumps.
    const shown = displayedOffset(drag.current, performance.now());
    drag.current = { ...drag.current, ...shown, dragging: true };
    last.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  }

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!drag.current.dragging || !last.current) return;
    const dx = e.clientX - last.current.x;
    const dy = e.clientY - last.current.y;
    last.current = { x: e.clientX, y: e.clientY };
    drag.current.yaw += dx * 0.008;
    drag.current.pitch = Math.max(-0.6, Math.min(0.6, drag.current.pitch + dy * 0.005));
  }

  function onPointerUp() {
    drag.current.dragging = false;
    drag.current.releasedAt = performance.now();
    last.current = null;
  }

  const onPin = useCallback(
    (x: number, y: number, visible: number) => {
      const el = labelRef.current;
      if (!el) return;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      el.style.opacity = String(visible);
    },
    [labelRef],
  );

  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={compact ? [1, 1.5] : [1, 2]}
      camera={{ position: [0, 0, 3.3], fov: 40 }}
      gl={{ antialias: true, alpha: true }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={{ touchAction: "pan-y", cursor: "grab" }}
      aria-hidden
    >
      <Globe lat={lat} lng={lng} still={still} drag={drag} onPin={onPin} />
    </Canvas>
  );
}
