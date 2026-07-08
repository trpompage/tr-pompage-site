const ITEMS = [
  "CHAPE ANHYDRITE",
  "CHAPE CIMENT",
  "PLANCHER CHAUFFANT",
  "PRÉPARATION DE SUPPORT",
  "PONÇAGE & DÉPOUSSIÉRAGE",
  "RÉPARATION DE FISSURES",
  "SINISTRES & DÉGÂTS DES EAUX",
  "CASSE & DÉPOSE",
  "NEUF & RÉNOVATION",
];

export default function Marquee() {
  const half = ITEMS.map((s) => (
    <span key={s}>
      {s}
      <i> ●</i>
    </span>
  ));
  return (
    <div className="band" aria-hidden="true">
      <div className="track">
        {half}
        {ITEMS.map((s) => (
          <span key={s + "-2"}>
            {s}
            <i> ●</i>
          </span>
        ))}
      </div>
    </div>
  );
}
