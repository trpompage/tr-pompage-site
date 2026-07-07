import type { ReactNode } from "react";

/** Tête de section : kicker mono + H2 + règle qui s'autonivelle ("BULLE · 0,0°"). */
export default function SectionHead({
  kicker,
  children,
}: {
  kicker: string;
  children: ReactNode;
}) {
  return (
    <div className="sec-head rv">
      <span className="kicker">{kicker}</span>
      <h2>{children}</h2>
      <div className="level-rule" />
    </div>
  );
}
