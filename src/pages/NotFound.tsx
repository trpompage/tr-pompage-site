import { useRef } from "react";
import PageHero from "../components/PageHero";
import { Cta } from "../components/Buttons";
import { useReveals } from "../hooks/useReveals";
import { usePageTitle } from "../hooks/usePageTitle";

/** 404 minimale — sera thématisée avec le blob en P4. */
export default function NotFound() {
  const ref = useRef<HTMLElement>(null);
  useReveals(ref);
  usePageTitle("Chantier introuvable — TR POMPAGE");

  return (
    <main ref={ref}>
      <PageHero
        crumb="ERREUR 404"
        lines={["Chantier", <em key="l2">introuvable</em>]}
        lead="Cette adresse ne mène à aucune coulée. La page a peut-être été déposée — revenez au niveau zéro."
      />
      <section className="page-cta" style={{ borderTop: "none" }}>
        <div className="row rv d1" style={{ marginTop: 0 }}>
          <Cta to="/">← RETOUR À L'ACCUEIL</Cta>
        </div>
      </section>
    </main>
  );
}
