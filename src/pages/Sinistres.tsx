import { useRef } from "react";
import PageHero from "../components/PageHero";
import SectionHead from "../components/SectionHead";
import Steps from "../components/Steps";
import Callout from "../components/Callout";
import { Cta, Ghost } from "../components/Buttons";
import { useReveals } from "../hooks/useReveals";
import { usePageTitle } from "../hooks/usePageTitle";

export default function Sinistres() {
  const ref = useRef<HTMLElement>(null);
  useReveals(ref);
  usePageTitle("Sinistres & autres — réparation, casse, dépose — TR POMPAGE");

  return (
    <main ref={ref}>
      <PageHero
        crumb="MÉTIER D"
        lines={["Sinistres", <em key="l2">&amp; autres</em>]}
        lead="Fissures, zones qui sonnent creux, dégât des eaux, ou rénovation lourde : on répare quand la chape peut être sauvée, on casse proprement quand elle ne le mérite plus. Avec ou sans plancher chauffant, et un avis franc avant d'ouvrir quoi que ce soit."
      />

      <section>
        <SectionHead kicker="01 — RÉPARER D'ABORD">
          Sauver la chape
          <br />
          <em>quand c'est possible</em>.
        </SectionHead>
        <div className="grid3 rv d1">
          <article>
            <span className="idx">FISSURES — AGRAFAGE RÉSINE</span>
            <h3>Recoudre la chape</h3>
            <p>
              Sur fissure <b>stabilisée</b> : ouverture à la disqueuse dans l'épaisseur,
              saignées perpendiculaires régulières (environ tous les 25 cm), dépoussiérage,{" "}
              <b>agrafes scellées et résine époxy bicomposante coulée à saturation</b>, sablage
              à refus pour l'accroche, arasage après durcissement. La chape redevient
              monolithique, prête au ragréage ou au revêtement. En plancher chauffant :{" "}
              <b>repérage des tubes avant le moindre trait de scie</b>.
            </p>
          </article>
          <article>
            <span className="idx">SINISTRES — DÉGÂT DES EAUX</span>
            <h3>Diagnostiquer avant de condamner</h3>
            <p>
              L'anhydrite n'aime pas l'eau qui stagne. On sonde la chape zone par zone
              (cohésion, zones qui sonnent creux), on mesure l'humidité{" "}
              <b>à la bombe à carbure dans l'épaisseur</b>, et on tranche : séchage technique
              par déshumidification si la chape est saine, réparation localisée, ou dépose de
              la zone atteinte. Vous repartez avec un <b>rapport d'intervention chiffré</b>,
              utilisable pour votre dossier d'assurance.
            </p>
          </article>
          <article>
            <span className="idx">REPRISES LOCALISÉES</span>
            <h3>Réparer sans re-couler</h3>
            <p>
              Zone qui sonne creux, épaufrure, saignée laissée par un autre corps d'état, tube
              de plancher chauffant à réparer : <b>purge propre au trait de scie</b>,
              dégagement (environ 20 cm autour d'un tube pour une fuite), primaire, puis{" "}
              <b>mortier de réparation compatible avec le liant</b> de la chape et raccord au
              niveau existant. La pièce n'est pas condamnée pour un mètre carré malade.
            </p>
          </article>
        </div>
        <Callout>
          <b>Fissure stabilisée ou fissure vivante ? Toute la décision est là.</b> Une fissure
          passive se recoud à la résine. Une fissure évolutive — qui travaille entre l'hiver et
          l'été — reviendra tant que sa cause n'est pas traitée : on vous le dit avant, pas
          après. Et une chape ne se rafistole pas à l'infini : au-delà d'un certain point, la
          dépose-recoulée est plus rapide, plus sûre et souvent moins chère.
        </Callout>
      </section>

      <section>
        <SectionHead kicker="02 — QUAND ÇA DOIT PARTIR">
          Avec ou sans
          <br />
          <em>plancher chauffant</em>.
        </SectionHead>
        <div className="grid2 rv d1">
          <article>
            <span className="idx">CAS 1 — SANS PLANCHER CHAUFFANT</span>
            <h3>Démolition franche</h3>
            <p>
              Sciage de délimitation en périphérie et aux seuils pour protéger l'existant, puis{" "}
              <b>fragmentation au piqueur</b> et décollement de la chape jusqu'à l'isolant ou au
              support. Polyane et sous-couches déposés dans la foulée. Gravats évacués et{" "}
              <b>triés selon le liant</b> — l'anhydrite (sulfate de calcium) ne part pas dans la
              même benne que le béton.
            </p>
          </article>
          <article>
            <span className="idx">CAS 2 — AVEC PLANCHER CHAUFFANT</span>
            <h3>Dépose sous contrôle</h3>
            <p>
              Deux scénarios. <b>Réseau à conserver</b> : repérage préalable des tubes (plans,
              mise en pression, relevé thermique), ouverture maîtrisée et dégagement sans
              blesser le circuit — pour une fuite localisée, un dégagement de l'ordre de 20 cm
              autour du tube suffit souvent à réparer puis reboucher, sans tout casser.{" "}
              <b>Réseau condamné</b> : dépose complète chape + tubes + isolant, jusqu'au support
              nu.
            </p>
          </article>
        </div>
      </section>

      <section>
        <SectionHead kicker="03 — LE PROCESS">
          Ouvrir un sol, c'est
          <br />
          <em>un métier propre</em>.
        </SectionHead>
        <Steps
          items={[
            {
              title: "Diagnostic & arbitrage",
              body: (
                <>
                  Épaisseur et liant de la chape, cartographie des fissures et des zones
                  creuses, présence et état du réseau chauffant, points singuliers.{" "}
                  <b>On sait ce qu'on répare — ou ce qu'on casse — avant d'ouvrir.</b>
                </>
              ),
            },
            {
              title: "Protection & découpe",
              body: (
                <>
                  Protection des pièces conservées et des menuiseries,{" "}
                  <b>sciage de délimitation</b> des zones à traiter : la réparation comme la
                  casse s'arrêtent exactement où vous l'avez décidé.
                </>
              ),
            },
            {
              title: "Traitement & dégagement",
              body: (
                <>
                  Agrafage résine sur les fissures conservables, piqueur et outillage adaptés
                  sur les zones déposées, <b>travail sous aspiration</b>. En présence de tubes à
                  conserver : dégagement manuel au contact du réseau.
                </>
              ),
            },
            {
              title: "Tri, évacuation, support prêt",
              body: (
                <>
                  Gravats évacués en filière adaptée au liant, support nettoyé et contrôlé. Et
                  comme on fait aussi la préparation et la coulée :{" "}
                  <b>on peut re-couler dans la foulée</b> — un seul interlocuteur du premier
                  coup de scie au dernier m² poncé.
                </>
              ),
            },
          ]}
        />
      </section>

      <section className="page-cta">
        <span className="kicker rv">04 — ET APRÈS</span>
        <h2 className="rv d1">
          On répare, on casse,
          <br />
          <em>on recoule</em>.
        </h2>
        <div className="row rv d2">
          <Cta href="tel:+33600000000">📞 06 00 00 00 00</Cta>
          <Ghost href="mailto:contact@trpompage.fr?subject=Fissure%20%2F%20sinistre%20chape">
            FISSURE ? ENVOYEZ UNE PHOTO
          </Ghost>
          <Ghost to="/#contact">DEVIS CASSE + RE-COULÉE</Ghost>
        </div>
      </section>
    </main>
  );
}
