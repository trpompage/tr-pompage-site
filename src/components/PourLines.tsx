import { Fragment } from "react";
import type { CSSProperties, ReactNode } from "react";

/** Typo cinétique (P1) : chaque ligne du titre se met en place comme une
 *  coulée — montée depuis le masque, léger débordement, tassement au niveau.
 *  L'animation part quand le titre reçoit la classe .in (système de reveals) ;
 *  en prefers-reduced-motion les lignes sont statiques. */
export default function PourLines({ lines }: { lines: ReactNode[] }) {
  return (
    <>
      {lines.map((line, i) => (
        <Fragment key={i}>
          <span className="pour-line" style={{ "--pl": i } as CSSProperties}>
            <span className="pour-inner">{line}</span>
          </span>
          {i < lines.length - 1 && <br />}
        </Fragment>
      ))}
    </>
  );
}
