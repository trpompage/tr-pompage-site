import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useMagnetic } from "../hooks/useMagnetic";

interface BtnProps {
  to?: string;
  href?: string;
  children: ReactNode;
}

/** CTA orange magnétique (lien interne `to` ou externe `href`). */
export function Cta({ to, href, children }: BtnProps) {
  const ref = useMagnetic<HTMLAnchorElement>();
  if (href)
    return (
      <a ref={ref} className="cta magnet" href={href}>
        <b>{children}</b>
      </a>
    );
  return (
    <Link ref={ref} className="cta magnet" to={to ?? "/"}>
      <b>{children}</b>
    </Link>
  );
}

/** Bouton fantôme magnétique ; sans `to` ni `href`, simple étiquette statique. */
export function Ghost({ to, href, children }: BtnProps) {
  const ref = useMagnetic<HTMLAnchorElement>();
  if (href)
    return (
      <a ref={ref} className="ghost magnet" href={href}>
        {children}
      </a>
    );
  if (to)
    return (
      <Link ref={ref} className="ghost magnet" to={to}>
        {children}
      </Link>
    );
  return (
    <span className="ghost" style={{ cursor: "default" }}>
      {children}
    </span>
  );
}
