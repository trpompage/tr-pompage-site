import SectionHead from "./SectionHead";

export default function Principe() {
  return (
    <section id="principe">
      <SectionHead kicker="01 — LE PRINCIPE">
        Autonivelante.
        <br />
        <em>Comme cette ligne.</em>
      </SectionHead>
      <div className="grid3 rv d1">
        <article>
          <span className="idx">POMPER</span>
          <h3>On amène la matière</h3>
          <p>
            La machine à chape pompe le mortier fluide depuis le camion jusqu'à votre pièce,
            même en étage, même en fond de parcelle. Pas de brouette, pas de manutention.
          </p>
        </article>
        <article>
          <span className="idx">COULER</span>
          <h3>La chape s'étale seule</h3>
          <p>
            Fluide, elle enrobe les gaines et les tubes de plancher chauffant sans vide d'air,
            et trouve son niveau naturellement sur toute la surface.
          </p>
        </article>
        <article>
          <span className="idx">NIVELER</span>
          <h3>Un sol prêt à recevoir</h3>
          <p>
            Contrôle des niveaux à la pige, débullage au rouleau : vous obtenez un support
            plan, régulier, prêt pour le revêtement après séchage.
          </p>
        </article>
      </div>
    </section>
  );
}
