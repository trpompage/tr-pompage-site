import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { prefersReducedMotion } from "../hooks/useReducedMotion";

/** À chaque navigation : scroll instantané en haut de page,
 *  ou défilement (doux) vers l'ancre si l'URL en porte une. */
export default function ScrollManager() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [location.key, location.hash]);

  return null;
}
