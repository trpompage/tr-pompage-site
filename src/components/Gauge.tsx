import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

/** Jauge de niveau latérale : le remplissage suit la progression de scroll. */
export default function Gauge() {
  const location = useLocation();
  const fillRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const upd = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      const p = max > 0 ? Math.round((scrollY / max) * 100) : 0;
      if (fillRef.current) fillRef.current.style.height = p + "%";
      if (pctRef.current) {
        pctRef.current.style.bottom = `calc(${p}% - 6px)`;
        pctRef.current.textContent = "NIVEAU " + p + "%";
      }
    };
    addEventListener("scroll", upd, { passive: true });
    addEventListener("resize", upd);
    // recalcul après rendu de la route (hauteur de page différente)
    const raf = requestAnimationFrame(upd);
    return () => {
      removeEventListener("scroll", upd);
      removeEventListener("resize", upd);
      cancelAnimationFrame(raf);
    };
  }, [location.key]);

  return (
    <div id="gauge" aria-hidden="true">
      <div className="ticks">
        {Array.from({ length: 9 }, (_, i) => (
          <i key={i} style={{ bottom: `${(i + 1) * 10}%` }} />
        ))}
      </div>
      <div className="fill" ref={fillRef} />
      <div className="pct" ref={pctRef} style={{ bottom: 0 }}>
        NIVEAU 0%
      </div>
    </div>
  );
}
