import { Link } from "react-router-dom";
import SectionHead from "./SectionHead";

const CLIENTS = [
  { h: "Carreleurs", p: "UN SUPPORT PLAN, PONCÉ, PRÊT À CARRELER" },
  { h: "Chauffagistes", p: "ENROBAGE TOTAL DU PLANCHER CHAUFFANT" },
  { h: "Constructeurs", p: "CADENCE MAÎTRISÉE, PLANNING TENU" },
  { h: "Maîtres d'œuvre", p: "UN SEUL INTERLOCUTEUR, DU SUPPORT AU PONÇAGE" },
];

export default function Clients() {
  return (
    <section id="pros">
      <SectionHead kicker="04 — POUR LES PROS">
        Vous posez, <em>on pompe</em>.
      </SectionHead>
      <div className="clients rv d1">
        {CLIENTS.map((c) => (
          <Link key={c.h} to="/#contact">
            <span className="wave" />
            <h3>{c.h}</h3>
            <p>{c.p}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
