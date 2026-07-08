/** Coupe interactive du système de préparation (survol = isole la couche). */
export default function CoupeSysteme() {
  return (
    <div className="coupe rv d1">
      <div>
        <div className="stack" aria-label="Coupe du système de sol, du support à la chape">
          <div className="layer l-support">
            SUPPORT BÉTON / DALLE
            <small>propre · dépoussiéré · réservations calfeutrées</small>
          </div>
          <div className="layer l-poly">
            FILM POLYANE PE
            <small>désolidarisation · anti-laitance · lés à recouvrement</small>
          </div>
          <div className="layer l-tms">
            ISOLANT THERMIQUE TMS® — PU RAINÉ BOUVETÉ
            <small>joints décalés · quadrillage calepinage</small>
          </div>
          <div className="layer l-pont">PONTAGE ADHÉSIF ÉTANCHE DES JOINTS</div>
          <div className="layer l-ac">
            SOUS-COUCHE ACOUSTIQUE ASSOUR® / TRAMICHAPE®
            <small>lés pontés</small>
          </div>
          <div className="layer l-chape">
            CHAPE FLUIDE — COULÉE PAR NOS SOINS
            <small>autonivelante</small>
          </div>
        </div>
        <p className="coupe-note">
          // SURVOLEZ UNE COUCHE POUR L'ISOLER. LA COMPOSITION EXACTE (AVEC OU SANS
          ACOUSTIQUE, AVEC OU SANS PLANCHER CHAUFFANT) SUIT LE DTU 52.10 ET L'AVIS TECHNIQUE
          DE LA CHAPE.
        </p>
      </div>
      <div className="periph">BANDE PÉRIPHÉRIQUE CONTINUE — DU SUPPORT À LA SURFACE FINIE</div>
    </div>
  );
}
