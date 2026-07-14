import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "../hooks/useReducedMotion";

/** Micro-splash (P1) : un clic sur un CTA éclabousse — brève gerbe de
 *  particules 2D (orange + chape) en trajectoire balistique, ~400 ms,
 *  purement décorative (l'action du bouton part immédiatement).
 *  Désactivé en prefers-reduced-motion. */

const COLORS = ["#FF5A1F", "#FF5A1F", "#C9B694", "#8F7D5C"];

export default function SplashBurst() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (prefersReducedMotion()) return;
      const cta = (e.target as Element | null)?.closest?.(".cta");
      const host = hostRef.current;
      if (!cta || !host) return;
      if (host.childElementCount > 60) return; // garde-fou

      const n = 10 + Math.floor(Math.random() * 3);
      for (let i = 0; i < n; i++) {
        const p = document.createElement("i");
        const size = 3 + Math.random() * 6;
        p.style.cssText = `position:absolute;left:${e.clientX}px;top:${e.clientY}px;width:${size}px;height:${size}px;border-radius:50%;background:${COLORS[i % COLORS.length]};will-change:transform,opacity;`;
        host.appendChild(p);

        // gerbe vers le haut, retombée sous gravité
        const ang = Math.PI * (0.1 + 0.8 * Math.random());
        const v = 70 + Math.random() * 150;
        const dx = Math.cos(ang) * v * (Math.random() < 0.5 ? 1 : -1);
        const up = -Math.sin(ang) * v;
        const duration = 340 + Math.random() * 180;
        const anim = p.animate(
          [
            { transform: "translate(-50%,-50%) translate(0,0) scale(1)", opacity: 1 },
            {
              transform: `translate(-50%,-50%) translate(${dx * 0.65}px,${up}px) scale(.92)`,
              opacity: 1,
              offset: 0.55,
            },
            {
              transform: `translate(-50%,-50%) translate(${dx}px,${up + 130}px) scale(.35)`,
              opacity: 0,
            },
          ],
          { duration, easing: "cubic-bezier(.2,.6,.6,1)", fill: "forwards" },
        );
        anim.onfinish = () => p.remove();
        // filet de sécurité si onfinish ne se déclenche pas (rendu logiciel)
        window.setTimeout(() => p.remove(), duration + 400);
      }
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 66 }}
    />
  );
}
