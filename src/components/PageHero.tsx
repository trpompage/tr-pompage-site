import type { ReactNode } from "react";
import PourLines from "./PourLines";

/** Mini-hero des sous-pages métier. `lines` = lignes du H1, mises en place
 *  en coulée (typo cinétique P1). */
export default function PageHero({
  crumb,
  lines,
  lead,
}: {
  crumb: string;
  lines: ReactNode[];
  lead: string;
}) {
  return (
    <div className="page-hero">
      <div style={{ maxWidth: 1400, margin: "0 auto", width: "100%" }}>
        <div className="crumb rv">
          TR·POMPAGE <b>/</b> {crumb}
        </div>
        <h1 className="rv d1 pour-title">
          <PourLines lines={lines} />
        </h1>
        <p className="lead rv d2">{lead}</p>
      </div>
    </div>
  );
}
