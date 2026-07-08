import { useEffect, useMemo, useRef } from "react";
import type { MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { FluidSim, QUALITE_PLEINE, QUALITE_REDUITE } from "../lib/fluid/FluidSim";
import fragmentShader from "../shaders/hero.frag.glsl";

/* Chargé en dynamic import depuis Hero.tsx : three.js + R3F restent
   hors du bundle initial. */

const MAXD = 4;
const MAXR = 5;
const POOL_Y = -1.28;
const STATIC_TIME = 7.3; // frame figée servie en prefers-reduced-motion
const vertexShader = "void main(){gl_Position=vec4(position,1.0);}";

/* versement : seuils du piège tactile (mobile) */
const HOLD_MS = 150; // appui quasi immobile avant de verser
const HOLD_SLOP_PX = 10; // au-delà → c'est un scroll/drag, pas de peinture
const REST_MS = 8000; // sans interaction → cadence réduite (batterie)

/* teintes chape (tokens CLAUDE.md, converties en linéaire approx.) */
const SCREED = new THREE.Color(0.788, 0.714, 0.58);
const SCREED_DEEP = new THREE.Color(0.561, 0.49, 0.361);
const ORANGE = new THREE.Color(1.0, 0.353, 0.122);

interface Drop {
  x: number;
  y: number;
  vy: number;
  r: number;
}

interface PourState {
  active: boolean; // pointeur posé
  engaged: boolean; // versement en cours
  moved: boolean; // a glissé avant l'engagement → scroll/drag
  x: number;
  y: number;
  px: number;
  py: number;
  downT: number;
  downX: number;
  downY: number;
  timer: number;
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
const splatColor = new THREE.Color();

function blackTexture() {
  const t = new THREE.DataTexture(new Uint8Array([0, 0, 0, 255]), 1, 1);
  t.needsUpdate = true;
  return t;
}

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
      uFluid: { value: blackTexture() as THREE.Texture },
      uFluidOn: { value: 0 },
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

  /* ---- simulation fluide (null si non supportée → dégradation invisible) ---- */
  const simRef = useRef<FluidSim | null>(null);
  useEffect(() => {
    if (reduced) return;
    const sim = FluidSim.create(gl, QUALITE_PLEINE);
    simRef.current = sim;
    return () => {
      sim?.dispose();
      simRef.current = null;
      uniforms.uFluidOn.value = 0;
    };
  }, [gl, reduced, uniforms]);

  // résolution : suit la taille du canvas (et le DPR adaptatif)
  useEffect(() => {
    gl.getDrawingBufferSize(bufSize);
    uniforms.uRes.value.copy(bufSize);
    simRef.current?.setAspect(size.width / size.height);
    invalidate();
  }, [gl, size, uniforms, invalidate]);

  // cible du pointeur (la métaball "curseur" la suit avec inertie)
  const target = useRef({ x: 0, y: 0 });
  const lastInteraction = useRef(0);
  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      lastInteraction.current = performance.now();
      const r = gl.domElement.getBoundingClientRect();
      if (!r.width) return;
      target.current.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      target.current.y = -((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    addEventListener("pointermove", onMove, { passive: true });
    return () => removeEventListener("pointermove", onMove);
  }, [gl, reduced]);

  /* ---- versement + gouttes ----
     Souris : versement dès l'appui. Tactile : touch-action pan-y conservé,
     le versement ne démarre qu'après ~150 ms d'appui quasi immobile — un
     glissement vertical rapide reste un scroll (pointercancel → stop).
     Tap/clic court quasi immobile → goutte 3D (parité P0). */
  const drops = useRef<Drop[]>([]);
  const rippleSlot = useRef(0);
  const pour = useRef<PourState>({
    active: false,
    engaged: false,
    moved: false,
    x: 0,
    y: 0,
    px: 0,
    py: 0,
    downT: 0,
    downX: 0,
    downY: 0,
    timer: 0,
  });

  useEffect(() => {
    if (reduced) return;
    const canvas = gl.domElement;
    const state = pour.current;

    const spawnDrop = (clientX: number) => {
      const r = canvas.getBoundingClientRect();
      if (!r.width) return;
      const ux = ((clientX - r.left) / r.width - 0.5) * (r.width / r.height) + 0.2;
      const wx = ux * (4.2 / 1.6) * 0.62;
      const arr = drops.current;
      if (arr.length >= MAXD) arr.shift();
      arr.push({ x: Math.max(-2.4, Math.min(2.4, wx)), y: 2.1, vy: 0, r: 0.34 });
    };

    const onDown = (e: PointerEvent) => {
      if (!e.isPrimary) return;
      lastInteraction.current = performance.now();
      clearTimeout(state.timer);
      state.active = true;
      state.moved = false;
      state.downT = performance.now();
      state.downX = e.clientX;
      state.downY = e.clientY;
      state.x = state.px = e.clientX;
      state.y = state.py = e.clientY;
      if (e.pointerType === "mouse") {
        state.engaged = true; // pas de scroll à préserver à la souris
      } else {
        state.engaged = false;
        state.timer = window.setTimeout(() => {
          if (state.active && !state.moved) state.engaged = true;
        }, HOLD_MS);
      }
    };

    const onMove = (e: PointerEvent) => {
      if (!state.active || !e.isPrimary) return;
      if (
        !state.engaged &&
        (Math.abs(e.clientX - state.downX) > HOLD_SLOP_PX ||
          Math.abs(e.clientY - state.downY) > HOLD_SLOP_PX)
      ) {
        state.moved = true; // glissement avant engagement → scroll/drag, pas de peinture
      }
      state.x = e.clientX;
      state.y = e.clientY;
    };

    const onStop = (e: PointerEvent) => {
      if (!state.active || !e.isPrimary) return;
      clearTimeout(state.timer);
      const held = performance.now() - state.downT;
      if (e.type === "pointerup" && held < HOLD_MS && !state.moved) spawnDrop(e.clientX);
      state.active = false;
      state.engaged = false;
    };

    canvas.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onStop);
    window.addEventListener("pointercancel", onStop);
    return () => {
      clearTimeout(state.timer);
      canvas.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onStop);
      window.removeEventListener("pointercancel", onStop);
    };
  }, [gl, reduced]);

  const mouse = useRef({ x: 0, y: 0 });
  const perf = useRef({ acc: 0, frames: 0, tuned: false, fpsAcc: 0, fpsN: 0, frame: 0 });

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

    /* ---- simulation fluide ---- */
    const sim = simRef.current;
    const p = perf.current;
    p.frame++;
    if (sim && !reduced) {
      const s = pour.current;
      if (s.active && s.engaged) {
        lastInteraction.current = performance.now();
        const r = gl.domElement.getBoundingClientRect();
        if (r.width) {
          const x = (s.x - r.left) / r.width;
          const y = 1 - (s.y - r.top) / r.height;
          const dx = (s.x - s.px) / r.width;
          const dy = -(s.y - s.py) / r.height;
          // teinte chape, poussée vers l'orange avec la vitesse du geste
          const speed = Math.min(Math.hypot(dx, dy) * 60, 1);
          splatColor
            .copy(SCREED)
            .lerp(SCREED_DEEP, 0.25 + 0.18 * Math.sin(T * 1.7))
            .lerp(ORANGE, Math.min(speed * 0.55, 0.45))
            .multiplyScalar(0.26);
          // vélocité du geste + biais de versement vers le bas
          sim.splat(x, y, dx * 6000, dy * 6000 - 150, splatColor, 0.0022);
          s.px = s.x;
          s.py = s.y;
        }
      }
      // mode repos : sans interaction depuis ~8 s, cadence réduite (batterie) ;
      // réveil instantané au toucher (lastInteraction)
      const idle = performance.now() - lastInteraction.current > REST_MS;
      if (!idle) sim.step(dt);
      else if (p.frame % 4 === 0) sim.step(Math.min(dt * 4, 1 / 15));
      u.uFluid.value = sim.texture;
      u.uFluidOn.value = 1;
    }

    // qualité GPU adaptative : mesure 2 s, dégrade DPR + raymarching + FBO fluide
    if (!p.tuned && !reduced) {
      p.acc += dt;
      p.frames++;
      if (p.acc > 2) {
        const fps = p.frames / p.acc;
        p.tuned = true;
        if (fps < 42) {
          u.uSteps.value = 58;
          if (fqRef.current) fqRef.current.textContent = "58";
          simRef.current?.setQuality(QUALITE_REDUITE);
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
