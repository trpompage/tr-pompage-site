import type { ReactNode } from "react";

/** Mini-hero des sous-pages métier. */
export default function PageHero({
  crumb,
  title,
  lead,
}: {
  crumb: string;
  title: ReactNode;
  lead: string;
}) {
  return (
    <div className="page-hero">
      <div style={{ maxWidth: 1400, margin: "0 auto", width: "100%" }}>
        <div className="crumb rv">
          TR·POMPAGE <b>/</b> {crumb}
        </div>
        <h1 className="rv d1">{title}</h1>
        <p className="lead rv d2">{lead}</p>
      </div>
    </div>
  );
}
