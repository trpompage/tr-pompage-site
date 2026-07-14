import { Suspense, lazy, useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { Cta } from "./Buttons";
import PourLines from "./PourLines";

/* three.js + R3F chargés en différé : hors du bundle initial */
const HeroCanvas = lazy(() => import("./HeroCanvas"));

/** iOS exige un geste utilisateur pour requestPermission : on demande au
 *  premier toucher du hero. Refus, absence d'API ou capteur muet →
 *  dégradation totalement invisible (pas d'étiquette, pas d'erreur). */
function useDeviceTilt(
  reduced: boolean,
  heroRef: { current: HTMLElement | null },
  tiltRef: { current: number },
  onActive: () => void,
) {
  useEffect(() => {
    if (reduced || typeof DeviceOrientationEvent === "undefined") return;
    const hero = heroRef.current;
    let listening = false;
    let signaled = false;
    let cancelled = false;

    const onOrient = (e: DeviceOrientationEvent) => {
      const gamma = e.gamma; // roll en portrait (positif = penché à droite)
      if (gamma == null) return;
      // contre-rotation : le device tourne horaire → la flaque se dessine
      // anti-horaire à l'écran pour rester horizontale dans le monde
      tiltRef.current = -Math.max(-30, Math.min(30, gamma)) * (Math.PI / 180);
      if (!signaled && Math.abs(gamma) > 2) {
        signaled = true;
        onActive(); // capteur réellement actif → étiquette
      }
    };
    const start = () => {
      if (listening || cancelled) return;
      listening = true;
      addEventListener("deviceorientation", onOrient);
    };

    type WithPermission = { requestPermission?: () => Promise<string> };
    const requestPermission = (DeviceOrientationEvent as unknown as WithPermission)
      .requestPermission;
    const ask = () => {
      requestPermission!()
        .then((r) => {
          if (r === "granted") start();
        })
        .catch(() => {
          /* refus ou erreur : silencieux */
        });
    };

    if (typeof requestPermission === "function") {
      hero?.addEventListener("pointerdown", ask, { once: true });
    } else {
      start();
    }
    return () => {
      cancelled = true;
      hero?.removeEventListener("pointerdown", ask);
      removeEventListener("deviceorientation", onOrient);
    };
  }, [reduced, heroRef, tiltRef, onActive]);
}

export default function Hero() {
  const reduced = useReducedMotion();
  const heroRef = useRef<HTMLElement | null>(null);
  const gcapRef = useRef<HTMLDivElement | null>(null);
  const fqRef = useRef<HTMLSpanElement | null>(null);
  const ffpsRef = useRef<HTMLSpanElement | null>(null);
  const [visible, setVisible] = useState(true);
  const [dpr, setDpr] = useState(() => Math.min(window.devicePixelRatio || 1, 1.5));
  const [tiltActive, setTiltActive] = useState(false);
  const tiltRef = useRef(0);

  useDeviceTilt(
    reduced,
    heroRef,
    tiltRef,
    useCallback(() => setTiltActive(true), []),
  );

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
          tiltRef={tiltRef}
          onDegrade={() => setDpr(1)}
        />
      </Suspense>

      {!reduced && (
        <div className="drop-hint rv d3">
          <b>TAP</b> → GOUTTE · <b>MAINTENIR</b> → VERSER
        </div>
      )}

      <div className="hero-inner">
        <div className="eyebrow rv">POMPAGE DE CHAPE FLUIDE — ANHYDRITE &amp; CIMENT</div>
        <h1 className="rv d1 pour-title">
          <PourLines
            lines={[
              "La chape",
              <>
                <span className="liquid-word">coule</span>,
              </>,
              "on la met à niveau.",
            ]}
          />
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
      {tiltActive && (
        <div className="tilt-cap">INCLINEZ — LA CHAPE RESTE DE NIVEAU</div>
      )}
      <div id="fpsline">
        SIMULATION FLUIDE · RAYMARCHING <span ref={fqRef}>84</span> PAS ·{" "}
        <span ref={ffpsRef}>60</span> IPS
      </div>
    </section>
  );
}
