import { useEffect, useMemo, useRef } from "react";
import type { MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import fragmentShader from "../shaders/hero.frag.glsl";

/* Chargé en dynamic import depuis Hero.tsx : three.js + R3F restent
   hors du bundle initial. */

const MAXD = 4;
const MAXR = 5;
const POOL_Y = -1.28;
const STATIC_TIME = 7.3; // frame figée servie en prefers-reduced-motion
const vertexShader = "void main(){gl_Position=vec4(position,1.0);}";

interface Drop {
  x: number;
  y: number;
  vy: number;
  r: number;
}

export interface HeroCanvasProps {
  reduced: boolean;
  frameloop: "always" | "never" | "demand";
  dpr: number;
  heroRef: MutableRefObject<HTMLElement | null>;
  gcapRef: MutableRefObject<HTMLDivElement | null>;
  fqRef: MutableRefObject<HTMLSpanElement | null>;
  ffpsRef: MutableRefObject<HTMLSpanElement | null>;
  onDegrade: () => void;
}

const bufSize = new THREE.Vector2();

function HeroScene({
  reduced,
  heroRef,
  gcapRef,
  fqRef,
  ffpsRef,
  onDegrade,
}: Omit<HeroCanvasProps, "frameloop" | "dpr">) {
  const { gl, size, invalidate } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: reduced ? STATIC_TIME : 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uScroll: { value: 0 },
      uSteps: { value: 84 },
      uDrops: {
        value: Array.from({ length: MAXD }, () => new THREE.Vector3(0, 99, 0)),
      },
      uRipples: {
        value: Array.from({ length: MAXR }, () => new THREE.Vector4(0, 0, 0, -99)),
      },
    }),
    // uniforms créés une seule fois par montage du canvas
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // résolution : suit la taille du canvas (et le DPR adaptatif)
  useEffect(() => {
    gl.getDrawingBufferSize(bufSize);
    uniforms.uRes.value.copy(bufSize);
    invalidate();
  }, [gl, size, uniforms, invalidate]);

  // cible du pointeur (la métaball "curseur" la suit avec inertie)
  const target = useRef({ x: 0, y: 0 });
  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      const r = gl.domElement.getBoundingClientRect();
      if (!r.width) return;
      target.current.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      target.current.y = -((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    addEventListener("pointermove", onMove, { passive: true });
    return () => removeEventListener("pointermove", onMove);
  }, [gl, reduced]);

  // clic/tap → goutte qui tombe dans la flaque
  const drops = useRef<Drop[]>([]);
  const rippleSlot = useRef(0);
  useEffect(() => {
    if (reduced) return;
    const canvas = gl.domElement;
    const onDown = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      if (!r.width) return;
      const ux = ((e.clientX - r.left) / r.width - 0.5) * (r.width / r.height) + 0.2;
      const wx = ux * (4.2 / 1.6) * 0.62;
      const arr = drops.current;
      if (arr.length >= MAXD) arr.shift();
      arr.push({ x: Math.max(-2.4, Math.min(2.4, wx)), y: 2.1, vy: 0, r: 0.34 });
    };
    canvas.addEventListener("pointerdown", onDown);
    return () => canvas.removeEventListener("pointerdown", onDown);
  }, [gl, reduced]);

  const mouse = useRef({ x: 0, y: 0 });
  const perf = useRef({ acc: 0, frames: 0, tuned: false, fpsAcc: 0, fpsN: 0 });

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const u = uniforms;

    gl.getDrawingBufferSize(bufSize);
    u.uRes.value.copy(bufSize);

    mouse.current.x += (target.current.x - mouse.current.x) * 0.045;
    mouse.current.y += (target.current.y - mouse.current.y) * 0.045;
    u.uMouse.value.set(mouse.current.x, mouse.current.y);

    const T = reduced ? STATIC_TIME : state.clock.elapsedTime;
    u.uTime.value = T;

    // fonte du blob au scroll — "la gravité fait le reste"
    const heroH = heroRef.current?.offsetHeight ?? innerHeight;
    const sc = Math.min(Math.max(scrollY / (heroH * 0.9), 0), 1);
    u.uScroll.value = sc;
    if (gcapRef.current) gcapRef.current.style.opacity = sc > 0.12 && sc < 0.95 ? "1" : "0";

    // physique des gouttes → ondulations à l'impact
    const arr = drops.current;
    for (let i = arr.length - 1; i >= 0; i--) {
      const d = arr[i];
      d.vy -= 7.5 * dt;
      d.y += d.vy * dt;
      if (d.y <= POOL_Y + 0.28) {
        const R = u.uRipples.value[rippleSlot.current];
        R.set(d.x, 0, 0.14, T);
        rippleSlot.current = (rippleSlot.current + 1) % MAXR;
        arr.splice(i, 1);
      }
    }
    u.uDrops.value.forEach((v, i) => {
      const d = arr[i];
      if (d) v.set(d.x, d.y, d.r);
      else v.set(0, 99, 0);
    });

    // qualité GPU adaptative : mesure 2 s, dégrade DPR + pas de raymarching
    const p = perf.current;
    if (!p.tuned && !reduced) {
      p.acc += dt;
      p.frames++;
      if (p.acc > 2) {
        const fps = p.frames / p.acc;
        p.tuned = true;
        if (fps < 42) {
          u.uSteps.value = 58;
          if (fqRef.current) fqRef.current.textContent = "58";
          onDegrade();
        }
      }
    }
    p.fpsAcc += dt;
    p.fpsN++;
    if (p.fpsAcc > 0.5) {
      if (ffpsRef.current) ffpsRef.current.textContent = String(Math.round(p.fpsN / p.fpsAcc));
      p.fpsAcc = 0;
      p.fpsN = 0;
    }
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  );
}

export default function HeroCanvas({ frameloop, dpr, ...scene }: HeroCanvasProps) {
  return (
    <Canvas
      className="gl-wrap"
      aria-hidden="true"
      frameloop={frameloop}
      dpr={dpr}
      gl={{ antialias: false, alpha: true }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      style={{ position: "absolute", inset: 0 }}
    >
      <HeroScene {...scene} />
    </Canvas>
  );
}
