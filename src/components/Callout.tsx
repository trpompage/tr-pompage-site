import type { ReactNode } from "react";

/** Encadré "⚠ POINT DE VIGILANCE". */
export default function Callout({ children }: { children: ReactNode }) {
  return (
    <div className="callout rv d2">
      <p>{children}</p>
    </div>
  );
}
