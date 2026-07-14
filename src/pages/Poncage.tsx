import { useRef } from "react";
import PageHero from "../components/PageHero";
import SectionHead from "../components/SectionHead";
import Steps from "../components/Steps";
import Callout from "../components/Callout";
import { Cta, Ghost } from "../components/Buttons";
import { useReveals } from "../hooks/useReveals";
import { usePageTitle } from "../hooks/usePageTitle";

export default function Poncage() {
  const ref = useRef<HTMLElement>(null);
  useReveals(ref);
  usePageTitle("Ponçage de chape fluide — TR POMPAGE");

  return (
    <main ref={ref}>
      <PageHero
        crumb="MÉTIER C"
        lines={["Ponçage de", <em key="l2">chape fluide</em>]}
        lead="La laitance dégage, le revêtement accroche. Ponçage mécanique sous aspiration, dépoussiérage complet, contrôle d'humidité : on livre au carreleur une surface cohésive, propre, prête au primaire."
      />

      <section>
        <SectionHead kicker="01 — L'ENNEMIE">
          La laitance, cette
          <br />
          <em>fausse amie</em>.
        </SectionHead>
        <div className="grid3 rv d1">
          <article>
            <span className="idx">D'OÙ ELLE VIENT</span>
            <h3>Un effet de la fluidité</h3>
            <p>
              Pendant que la chape s'autonivelle, les particules les plus fines et le liant
              migrent vers la surface. En séchant, elles forment une pellicule de quelques
              dixièmes de millimètre — <b>quasi systématique sur chape anhydrite</b>, possible
              sur chape ciment.
            </p>
          </article>
          <article>
            <span className="idx">POURQUOI C'EST UN PIÈGE</span>
            <h3>Lisse à l'œil, friable au doigt</h3>
            <p>
              La laitance a l'air d'une belle surface finie. En réalité elle est{" "}
              <b>pulvérulente et peu adhérente</b> : la colle à carrelage ou le primaire
              s'accrochent à elle… et elle ne tient pas au reste de la chape.
            </p>
          </article>
          <article>
            <span className="idx">LA SANCTION</span>
            <h3>Le décollement différé</h3>
            <p>
              Carrelage qui sonne creux, parquet qui se décolle, sol souple qui cloque — des
              mois après la pose.{" "}
              <b>Le ponçage n'est pas une option de finition, c'est une assurance d'adhérence</b>
              , prévue par les Avis Techniques des chapes.
            </p>
          </article>
        </div>
      </section>

      <section>
        <SectionHead kicker="02 — LE GESTE">
          Notre protocole
          <br />
          <em>en cinq temps</em>.
        </SectionHead>
        <Steps
          items={[
            {
              title: "La bonne fenêtre",
              body: (
                <>
                  On intervient <b>après le durcissement, avant la pose</b> — typiquement entre
                  une et quatre semaines après coulage selon le liant et les prescriptions du
                  fabricant. Bonus : poncer ouvre la porosité de la chape et{" "}
                  <b>accélère la fin du séchage</b>.
                </>
              ),
            },
            {
              title: "Ponçage mécanique",
              body: (
                <>
                  Monobrosse lourde équipée de <b>disques carbure de tungstène gros grain</b>{" "}
                  (type 16/24), passes croisées sur toute la surface, angles et seuils repris.
                  On retire la pellicule, pas la chape.
                </>
              ),
            },
            {
              title: "Aspiration à la source",
              body: (
                <>
                  La poussière de ponçage est fine et abrasive : la machine est{" "}
                  <b>raccordée en direct à un aspirateur industriel</b>, opérateur sous EPI.
                  Votre chantier reste respirable et les autres corps d'état continuent de
                  travailler.
                </>
              ),
            },
            {
              title: "Dépoussiérage final",
              body: (
                <>
                  Aspiration complète de la surface,{" "}
                  <b>y compris angles, bandes périphériques et seuils</b> : la moindre poussière
                  résiduelle suffit à compromettre l'accrochage du primaire et de la colle.
                </>
              ),
            },
            {
              title: "Contrôle d'humidité",
              body: (
                <>
                  Avant de déclarer la chape prête, mesure de l'humidité résiduelle{" "}
                  <b>à la bombe à carbure</b>, en plusieurs points, dans l'épaisseur. Le taux
                  doit être sous le seuil de l'Avis Technique — de l'ordre de 1&nbsp;% pour un
                  carrelage, 0,5&nbsp;% pour un sol souple ou un parquet. En dessous : feu vert
                  au poseur.
                </>
              ),
            },
          ]}
        />
        <Callout>
          Certaines chapes récentes sont annoncées <b>« sans ponçage »</b> par leur Avis
          Technique. Très bien — mais ça se vérifie sur site, pas sur la plaquette. On contrôle
          la surface, et si une pellicule est présente, on ponce. C'est la chape qui décide,
          pas le marketing.
        </Callout>
      </section>

      <section className="page-cta">
        <span className="kicker rv">03 — LIVRAISON</span>
        <h2 className="rv d1">
          Une surface qui
          <br />
          <em>accroche</em>.
        </h2>
        <div className="row rv d2">
          <Cta href="tel:+33600000000">📞 06 00 00 00 00</Cta>
          <Ghost to="/#contact">PONÇAGE SEUL OU CHAPE + PONÇAGE</Ghost>
        </div>
      </section>
    </main>
  );
}
