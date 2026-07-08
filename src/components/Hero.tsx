import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { Cta } from "./Buttons";

/* three.js + R3F chargés en différé : hors du bundle initial */
const HeroCanvas = lazy(() => import("./HeroCanvas"));

export default function Hero() {
  const reduced = useReducedMotion();
  const heroRef = useRef<HTMLElement | null>(null);
  const gcapRef = useRef<HTMLDivElement | null>(null);
  const fqRef = useRef<HTMLSpanElement | null>(null);
  const ffpsRef = useRef<HTMLSpanElement | null>(null);
  const [visible, setVisible] = useState(true);
  const [dpr, setDpr] = useState(() => Math.min(window.devicePixelRatio || 1, 1.5));

  // pause du canvas hors viewport
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const io = new IntersectionObserver((en) => setVisible(en[0].isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const frameloop = reduced ? "demand" : visible ? "always" : "never";

  return (
    <section className="hero" ref={heroRef} style={{ padding: 0, maxWidth: "none" }}>
      <Suspense fallback={null}>
        <HeroCanvas
          reduced={reduced}
          frameloop={frameloop}
          dpr={dpr}
          heroRef={heroRef}
          gcapRef={gcapRef}
          fqRef={fqRef}
          ffpsRef={ffpsRef}
          onDegrade={() => setDpr(1)}
        />
      </Suspense>

      {!reduced && (
        <div className="drop-hint rv d3">
          <b>CLIC / TAP</b> DANS LA MATIÈRE → GOUTTE
        </div>
      )}

      <div className="hero-inner">
        <div className="eyebrow rv">POMPAGE DE CHAPE FLUIDE — ANHYDRITE &amp; CIMENT</div>
        <h1 className="rv d1">
          La chape
          <br />
          <span className="liquid-word">coule</span>,
          <br />
          on la met à niveau.
        </h1>
        <div className="hero-sub">
          <p className="rv d2">
            TR Pompage livre et pompe votre chape fluide autonivelante sur chantier — et prend
            en charge tout le cycle : préparation du support, ponçage, casse et dépose.
          </p>
          <span className="rv d3">
            <Cta to="/#contact">DEMANDER UN CHANTIER →</Cta>
          </span>
        </div>
      </div>

      <div className="gravity-cap" ref={gcapRef}>
        — LA GRAVITÉ FAIT LE RESTE —
      </div>
      <div id="fpsline">
        SIMULATION FLUIDE · RAYMARCHING <span ref={fqRef}>84</span> PAS ·{" "}
        <span ref={ffpsRef}>60</span> IPS
      </div>
    </section>
  );
}
