import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "../hooks/useReducedMotion";

/** Preloader "AMORÇAGE DE LA POMPE" — parité référence. */
export default function Preloader({ onDone }: { onDone: () => void }) {
  const [done, setDone] = useState(false);
  const [removed, setRemoved] = useState(false);
  const pipeRef = useRef<HTMLElement>(null);
  const ldpRef = useRef<HTMLElement>(null);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    document.body.classList.add("locked");
    let cancelled = false;
    let timer = 0;

    const finish = () => {
      if (cancelled) return;
      setDone(true);
      document.body.classList.remove("locked");
      onDoneRef.current();
      timer = window.setTimeout(() => {
        if (!cancelled) setRemoved(true);
      }, 1200);
    };

    if (prefersReducedMotion()) {
      if (pipeRef.current) pipeRef.current.style.width = "100%";
      timer = window.setTimeout(() => {
        finish();
        setRemoved(true);
      }, 400);
    } else {
      let p = 0;
      const t0 = performance.now();
      const step = () => {
        if (cancelled) return;
        const pipe = pipeRef.current;
        const ldp = ldpRef.current;
        p = Math.min(100, p + 1.6 + Math.random() * 3.4);
        if (pipe) pipe.style.width = p + "%";
        if (ldp) ldp.textContent = Math.floor(p) + "%";
        if (p < 100 && performance.now() - t0 < 2600) {
          timer = window.setTimeout(step, 40 + Math.random() * 70);
        } else {
          if (pipe) pipe.style.width = "100%";
          if (ldp) ldp.textContent = "100% — PRESSION OK";
          timer = window.setTimeout(finish, 320);
        }
      };
      step();
    }

    return () => {
      cancelled = true;
      clearTimeout(timer);
      document.body.classList.remove("locked");
    };
  }, []);

  if (removed) return null;
  return (
    <div id="loader" className={done ? "done" : ""} role="status" aria-label="Chargement du site">
      <div className="logo-big">
        TR<span>·</span>POMPAGE
      </div>
      <div className="pipe">
        <i ref={pipeRef} />
      </div>
      <div className="ltxt">
        AMORÇAGE DE LA POMPE — <b ref={ldpRef}>0%</b>
      </div>
    </div>
  );
}
