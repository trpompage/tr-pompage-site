import { useRef } from "react";
import PageHero from "../components/PageHero";
import SectionHead from "../components/SectionHead";
import CoupeSysteme from "../components/CoupeSysteme";
import Callout from "../components/Callout";
import { Cta, Ghost } from "../components/Buttons";
import { useReveals } from "../hooks/useReveals";
import { usePageTitle } from "../hooks/usePageTitle";

export default function Preparation() {
  const ref = useRef<HTMLElement>(null);
  useReveals(ref);
  usePageTitle("Préparation d'avant chape — TR POMPAGE");

  return (
    <main ref={ref}>
      <PageHero
        crumb="MÉTIER A"
        lines={["Préparation", <em key="l2">d'avant chape</em>]}
        lead="Le niveau final se joue avant la coulée. Bande périphérique, isolant thermique TMS®, film polyane, sous-couche acoustique Assour Chape® ou Tramichape® : on monte le système complet, continu, étanche aux laitances — prêt à recevoir la chape fluide."
      />

      <section>
        <SectionHead kicker="01 — LE SYSTÈME EN COUPE">
          Chaque couche
          <br />
          <em>a un rôle</em>.
        </SectionHead>
        <CoupeSysteme />
      </section>

      <section>
        <SectionHead kicker="02 — LES QUATRE POSTES">
          Ce qu'on pose, <em>et pourquoi</em>.
        </SectionHead>
        <div className="grid4 rv d1" style={{ gridTemplateColumns: "repeat(2,1fr)" }}>
          <article>
            <span className="idx">A.1 — DÉSOLIDARISATION</span>
            <h3>Bande périphérique</h3>
            <p>
              Bande résiliente posée <b>sans discontinuité</b> au pied des murs, poteaux et
              seuils, du support jusqu'à la surface finie : la chape flotte, elle ne touche
              jamais la structure. Joints ouverts et angles d'isolant rebouchés à la mousse
              expansive — rien ne doit laisser fuir la laitance.
            </p>
          </article>
          <article>
            <span className="idx">A.2 — THERMIQUE</span>
            <h3>Isolant TMS®</h3>
            <p>
              Panneaux polyuréthane haute performance, <b>rainés bouvetés 4 côtés</b>, posés à
              joints décalés pour couper les ponts thermiques. La face quadrillée sert de
              calepinage : les tubes de plancher chauffant se fixent directement dessus. En
              plancher chauffant, les joints de panneaux sont <b>pontés à l'adhésif étanche</b>{" "}
              pour bloquer la laitance de la chape.
            </p>
          </article>
          <article>
            <span className="idx">A.3 — SÉPARATION</span>
            <h3>Film polyane</h3>
            <p>
              Film polyéthylène déroulé en lés à recouvrement, <b>relevé en périphérie</b> : il
              désolidarise la chape ou protège la couche du dessous, et fait barrière aux
              laitances. Sa position dans le système dépend de la configuration (pose
              désolidarisée, isolant, plancher chauffant) — on suit le DTU et l'Avis Technique,
              pas l'habitude.
            </p>
          </article>
          <article>
            <span className="idx">A.4 — ACOUSTIQUE</span>
            <h3>Assour Chape® / Tramichape®</h3>
            <p>
              Sous-couches minces (≈ 3 à 5 mm) qui coupent les{" "}
              <b>bruits d'impact d'environ 19 à 22 dB</b> selon le produit et la pose. Lés bord
              à bord pontés à l'adhésif, remontée en plinthe pour éviter tout pont phonique,
              superposition possible avec le TMS® en respectant la règle des indices
              d'affaissement. Compatibles chapes fluides et planchers chauffants.
            </p>
          </article>
        </div>
        <Callout>
          <b>Un pont phonique de quelques centimètres ruine toute la sous-couche.</b> Une
          plinthe en contact dur, une remontée oubliée, une laitance qui a fui sous l'isolant :
          l'acoustique tombe, et ça ne se voit qu'à la réception. Notre obsession sur ce poste,
          c'est la continuité — c'est aussi ce qui protège notre coulée.
        </Callout>
      </section>

      <section className="page-cta">
        <span className="kicker rv">03 — ENCHAÎNEMENT</span>
        <h2 className="rv d1">
          Prépa le matin,
          <br />
          <em>coulée l'après-midi</em>.
        </h2>
        <div className="row rv d2">
          <Cta href="tel:+33600000000">📞 06 00 00 00 00</Cta>
          <Ghost to="/#contact">DEMANDER UN DEVIS PRÉPA + CHAPE</Ghost>
        </div>
      </section>
    </main>
  );
}
