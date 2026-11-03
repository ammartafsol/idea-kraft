"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/* -----------------------------------------------------------------------------
   A soft, living form: a high-detail icosahedron displaced in the vertex
   shader by layered simplex noise. The fragment shader adds a fresnel rim in
   the brand lime and a slow iridescent band. No textures or models are
   downloaded; the whole look comes from about 2 KB of GLSL.
----------------------------------------------------------------------------- */

const noise = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

const vertexShader = /* glsl */ `
uniform float uTime;
uniform float uHover;
varying vec3 vNormal;
varying vec3 vView;
varying float vDisp;
${noise}
float displacement(vec3 p){
  float n = snoise(p * 0.8 + uTime * 0.16) * 0.26;
  n += snoise(p * 1.7 - uTime * 0.1) * 0.035 * (1.0 + uHover);
  return n;
}
void main(){
  vec3 p = position;
  float d = displacement(normalize(p));
  vec3 displaced = p + normal * d;
  // Recompute the normal from two neighbouring samples so the lighting follows the new surface.
  vec3 up = abs(normal.y) > 0.99 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0);
  vec3 tangent = normalize(cross(normal, up));
  vec3 bitangent = normalize(cross(normal, tangent));
  float e = 0.01;
  vec3 pa = p + tangent * e;   pa += normal * displacement(normalize(pa));
  vec3 pb = p + bitangent * e; pb += normal * displacement(normalize(pb));
  vec3 n = normalize(cross(pa - displaced, pb - displaced));
  vNormal = normalize(normalMatrix * n);
  vec4 mv = modelViewMatrix * vec4(displaced, 1.0);
  vView = normalize(-mv.xyz);
  vDisp = d;
  gl_Position = projectionMatrix * mv;
}`;

const fragmentShader = /* glsl */ `
uniform vec3 uBase;
uniform vec3 uAccent;
uniform float uTime;
uniform float uDark;
varying vec3 vNormal;
varying vec3 vView;
varying float vDisp;
void main(){
  vec3 n = normalize(vNormal);
  float fres = pow(1.0 - max(dot(n, vView), 0.0), 3.0);
  vec3 light = normalize(vec3(-0.6, 0.8, 0.7));
  float diff = max(dot(n, light), 0.0);
  float spec = pow(max(dot(reflect(-light, n), vView), 0.0), 42.0);
  // Thin, slowly drifting iridescent band, which makes the surface read as a material.
  float band = smoothstep(0.2, 1.0, sin(vDisp * 9.0 + uTime * 0.5) * 0.5 + 0.5);
  float soft = pow(max(dot(reflect(-light, n), vView), 0.0), 6.0);
  vec3 col = uBase * (0.45 + diff * 1.4);
  col += vec3(0.16) * soft * (1.0 - fres) * (1.0 - 0.5 * uDark);
  col = mix(col, uAccent, fres * (0.8 + 0.2 * band));
  col += spec * mix(0.5, 0.32, uDark);
  col += uAccent * band * 0.025;
  gl_FragColor = vec4(col, 1.0);
}`;

type BlobProps = { pointer: React.RefObject<{ x: number; y: number }>; dark: boolean };

function Blob({ pointer, dark }: BlobProps) {
  const group = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);
  const material = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uHover: { value: 0 },
      uDark: { value: 0 },
      uBase: { value: new THREE.Color("#151515") },
      uAccent: { value: new THREE.Color("#c6ff4d") },
    }),
    [],
  );

  useFrame((state, delta) => {
    const m = material.current;
    if (!m) return;
    m.uniforms.uTime.value += delta;
    // Ease theme changes instead of snapping.
    m.uniforms.uDark.value = THREE.MathUtils.damp(m.uniforms.uDark.value, dark ? 1 : 0, 4, delta);
    (m.uniforms.uBase.value as THREE.Color).setRGB(
      THREE.MathUtils.lerp(0.1, 0.16, m.uniforms.uDark.value),
      THREE.MathUtils.lerp(0.1, 0.16, m.uniforms.uDark.value),
      THREE.MathUtils.lerp(0.1, 0.16, m.uniforms.uDark.value),
    );

    const p = pointer.current ?? { x: 0, y: 0 };
    const distance = Math.hypot(p.x, p.y);
    m.uniforms.uHover.value = THREE.MathUtils.damp(m.uniforms.uHover.value, distance < 0.6 ? 1 : 0, 3, delta);

    if (group.current) {
      group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, p.x * 0.6, 3, delta);
      group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, -p.y * 0.4, 3, delta);
      group.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.08;
    }
    if (ring.current) {
      ring.current.rotation.z += delta * 0.25;
      ring.current.rotation.x = 1.15 + Math.sin(state.clock.elapsedTime * 0.4) * 0.12;
    }
  });

  return (
    <group ref={group}>
      <mesh>
        <icosahedronGeometry args={[1.35, 48]} />
        <shaderMaterial ref={material} uniforms={uniforms} vertexShader={vertexShader} fragmentShader={fragmentShader} />
      </mesh>
      <mesh ref={ring} rotation={[1.15, 0.2, 0]}>
        <torusGeometry args={[2.05, 0.006, 8, 200]} />
        <meshBasicMaterial color={dark ? "#c6ff4d" : "#171717"} transparent opacity={0.55} />
      </mesh>
      <Satellite radius={2.05} speed={0.5} size={0.07} dark={dark} />
      <Satellite radius={1.75} speed={-0.32} size={0.045} dark={dark} offset={2} />
    </group>
  );
}

function Satellite({ radius, speed, size, dark, offset = 0 }: { radius: number; speed: number; size: number; dark: boolean; offset?: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * speed + offset;
    ref.current.position.set(Math.cos(t) * radius, Math.sin(t * 1.3) * 0.35, Math.sin(t) * radius * 0.45);
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[size, 24, 24]} />
      <meshBasicMaterial color={dark ? "#f2f2ee" : "#c6ff4d"} />
    </mesh>
  );
}

export default function HeroScene({
  pointer,
  dark,
  active,
}: {
  pointer: React.RefObject<{ x: number; y: number }>;
  dark: boolean;
  active: boolean;
}) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 5.4], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      aria-hidden
    >
      <Blob pointer={pointer} dark={dark} />
    </Canvas>
  );
}
