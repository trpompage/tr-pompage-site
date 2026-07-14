import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { prefersReducedMotion } from "../hooks/useReducedMotion";

/** Transition de page liquide (P1) : au clic sur un lien interne changeant
 *  de route, un rideau de chape monte (≈280 ms), la navigation bascule sous
 *  le rideau, qui poursuit sa coulée et sort par le haut (total ≈640 ms).
 *  Jamais bloquant : la navigation est déclenchée par minuterie courte, pas
 *  par un événement d'animation. Reduced-motion : aucune interception,
 *  navigation native instantanée. Les ancres même page ne sont pas wipées. */

const NAV_AT_MS = 280; // bascule de route quand le rideau couvre l'écran

function interceptedHref(e: MouseEvent): string | null {
  if (e.defaultPrevented || e.button !== 0) return null;
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return null;
  const a = (e.target as Element | null)?.closest?.("a");
  if (!a) return null;
  if (a.target && a.target !== "_self") return null;
  const href = a.getAttribute("href");
  if (!href || !href.startsWith("/")) return null;
  return href;
}

export default function LiquidTransition() {
  const navigate = useNavigate();
  const [running, setRunning] = useState(false);
  const busy = useRef(false);
  const timer = useRef(0);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (prefersReducedMotion()) return;
      const href = interceptedHref(e);
      if (!href) return;
      const url = new URL(href, window.location.origin);
      if (url.pathname === window.location.pathname) return; // ancre même page
      e.preventDefault();
      if (busy.current) return; // un wipe à la fois
      busy.current = true;
      setRunning(true);
      timer.current = window.setTimeout(() => {
        navigate(url.pathname + url.search + url.hash);
      }, NAV_AT_MS);
    };
    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      clearTimeout(timer.current);
    };
  }, [navigate]);

  if (!running) return null;
  return (
    <div
      className="wipe"
      aria-hidden="true"
      onAnimationEnd={() => {
        busy.current = false;
        setRunning(false);
      }}
    />
  );
}
