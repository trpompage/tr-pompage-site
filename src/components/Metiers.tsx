import { Link } from "react-router-dom";
import SectionHead from "./SectionHead";

export default function Metiers() {
  return (
    <section id="metiers">
      <SectionHead kicker="02 — LES MÉTIERS">
        Tout le cycle <em>de la chape</em>.
      </SectionHead>
      <div className="metiers rv d1">
        <Link to="/preparation">
          <span className="wave" />
          <span className="mnum">A</span>
          <span className="go">↗</span>
          <h3>Préparation</h3>
          <p>TMS® · POLYANE · ASSOUR / TRAMICHAPE</p>
        </Link>
        <Link to="/#principe">
          <span className="wave" />
          <span className="mnum">B</span>
          <span className="go">↓</span>
          <h3>Pompage</h3>
          <p>ANHYDRITE &amp; CIMENT — LE CŒUR DU MÉTIER</p>
        </Link>
        <Link to="/poncage">
          <span className="wave" />
          <span className="mnum">C</span>
          <span className="go">↗</span>
          <h3>Ponçage</h3>
          <p>LAITANCE ÉLIMINÉE, SURFACE PRÊTE À COLLER</p>
        </Link>
        <Link to="/sinistres">
          <span className="wave" />
          <span className="mnum">D</span>
          <span className="go">↗</span>
          <h3>Sinistres &amp; autres</h3>
          <p>FISSURES · DÉGÂTS DES EAUX · CASSE</p>
        </Link>
      </div>
    </section>
  );
}
