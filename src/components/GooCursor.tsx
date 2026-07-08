import { useEffect, useRef } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";

/** Curseur goutte "gooey" (pointeur fin uniquement, désactivé en reduced-motion). */
export default function GooCursor() {
  const reduced = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced || !matchMedia("(pointer:fine)").matches) return;
    const c = wrapRef.current;
    if (!c) return;
    const dots = Array.from(c.querySelectorAll("b"));
    const pos = dots.map(() => ({ x: innerWidth / 2, y: innerHeight / 2 }));
    let tx = innerWidth / 2;
    let ty = innerHeight / 2;
    let shown = false;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!shown) {
        shown = true;
        c.style.opacity = "1";
      }
    };
    const onLeave = () => {
      c.style.opacity = "0";
      shown = false;
    };
    addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);

    const loop = () => {
      raf = requestAnimationFrame(loop);
      pos[0].x += (tx - pos[0].x) * 0.5;
      pos[0].y += (ty - pos[0].y) * 0.5;
      for (let i = 1; i < pos.length; i++) {
        pos[i].x += (pos[i - 1].x - pos[i].x) * 0.32;
        pos[i].y += (pos[i - 1].y - pos[i].y) * 0.32;
      }
      dots.forEach((d, i) => {
        d.style.transform = `translate(${pos[i].x}px,${pos[i].y}px) translate(-50%,-50%)`;
      });
    };
    c.style.opacity = "0";
    c.style.transition = "opacity .3s";
    loop();

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [reduced]);

  return (
    <>
      <svg className="goo-defs" aria-hidden="true">
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="b" />
          <feColorMatrix
            in="b"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9"
            result="g"
          />
          <feBlend in="SourceGraphic" in2="g" />
        </filter>
      </svg>
      <div id="cursor" aria-hidden="true" ref={wrapRef}>
        <b />
        <b />
        <b />
        <b />
        <b />
      </div>
    </>
  );
}
