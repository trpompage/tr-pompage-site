import SectionHead from "./SectionHead";
import Calculateur from "./Calculateur";

/** Chiffres de cadence — valeurs indicatives, chiffrées sur plan (CLAUDE.md). */
const STATS = [
  { count: 1000, unit: "m²/J", label: "Surface coulée" },
  { count: 20, unit: "m³/H", label: "Débit de pompage" },
  { count: 180, unit: "m", label: "Portée de tuyauterie" },
  { count: 30, unit: "mm", label: "Épaisseur mini" },
];

export default function Chiffres() {
  return (
    <section id="chiffres">
      <SectionHead kicker="03 — LA CADENCE">
        Le débit fait <em>le chantier</em>.
      </SectionHead>
      <div className="stats rv d1">
        {STATS.map((s) => (
          <div key={s.label}>
            <div className="num" data-count={s.count}>
              0<small>{s.unit}</small>
            </div>
            <div className="lbl">{s.label}</div>
          </div>
        ))}
      </div>
      <p className="stats-note rv d2">
        // VALEURS INDICATIVES — CHAQUE CHANTIER EST CHIFFRÉ SUR PLAN.
      </p>
      <Calculateur />
    </section>
  );
}
