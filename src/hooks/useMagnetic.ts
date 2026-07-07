import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "./useReducedMotion";

/** Bouton magnétique : l'élément suit légèrement le pointeur (parité référence). */
export function useMagnetic<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion() || !matchMedia("(pointer:fine)").matches) return;

    let raf = 0;
    let leaveTimer = 0;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
      const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transition = "transform .08s ease-out";
        el.style.transform = `translate(${dx * 9}px,${dy * 7}px)`;
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(raf);
      el.style.transition = "transform .4s cubic-bezier(.2,.8,.2,1)";
      el.style.transform = "";
      leaveTimer = window.setTimeout(() => (el.style.transition = ""), 400);
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
      clearTimeout(leaveTimer);
    };
  }, []);
  return ref;
}
