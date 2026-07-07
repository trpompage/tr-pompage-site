import { useContext, useEffect } from "react";
import type { RefObject } from "react";
import { BootContext } from "../context/BootContext";

/** compteur animé fr-FR des stats (.num[data-count]) — parité référence */
function runCount(el: HTMLElement) {
  if (el.dataset.done) return;
  el.dataset.done = "1";
  const target = +(el.dataset.count ?? 0);
  const small = el.querySelector("small");
  const suffix = small ? small.outerHTML : "";
  const t0 = performance.now();
  const dur = 1400;
  function tick(now: number) {
    const k = Math.min((now - t0) / dur, 1);
    const ease = 1 - Math.pow(1 - k, 3);
    el.innerHTML = Math.round(target * ease).toLocaleString("fr-FR") + suffix;
    if (k < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/** Observe les .rv / .sec-head de la page et les révèle à l'entrée dans le viewport.
 *  Ne démarre qu'une fois le preloader terminé (BootContext). */
export function useReveals(rootRef: RefObject<HTMLElement | null>) {
  const booted = useContext(BootContext);
  useEffect(() => {
    if (!booted) return;
    const root = rootRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in");
          entry.target
            .querySelectorAll<HTMLElement>(".num[data-count]")
            .forEach(runCount);
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.16 },
    );
    root
      .querySelectorAll(".rv:not(.in), .sec-head:not(.in)")
      .forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [booted, rootRef]);
}
