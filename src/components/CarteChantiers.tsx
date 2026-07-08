import { useState } from "react";
import type { KeyboardEvent } from "react";
import { CATS, VILLES } from "../data/chantiers";
import type { Categorie, Ville } from "../data/chantiers";
import { useReducedMotion } from "../hooks/useReducedMotion";

type Filtre = "all" | Categorie;

const FILTRES: { cat: Filtre; label: string }[] = [
  { cat: "all", label: "TOUS" },
  { cat: "pompage", label: "POMPAGE" },
  { cat: "preparation", label: "PRÉPARATION" },
  { cat: "poncage", label: "PONÇAGE" },
  { cat: "sinistres", label: "SINISTRES" },
];

/** Vignette SVG d'attente par catégorie (placeholder photo — parité référence). */
function Thumb({ cat }: { cat: Categorie }) {
  const c = CATS[cat].color;
  return (
    <svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="320" height="180" fill="#1D1913" />
      <rect width="320" height="180" fill="none" stroke="rgba(239,233,220,.12)" />
      {cat === "pompage" && (
        <>
          <path
            d="M-10,30 C70,55 150,40 190,70"
            stroke="#3a352c"
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
          />
          <rect x="184" y="66" width="14" height="16" fill={c} />
          <line x1="191" y1="84" x2="191" y2="128" stroke={c} strokeWidth="4" />
          <path
            d="M20,138 Q60,126 100,138 T180,138 T260,138 T340,138 L340,180 L0,180 Z"
            fill={c}
            opacity=".85"
          />
          <path
            d="M20,138 Q60,126 100,138 T180,138 T260,138 T340,138"
            stroke="#fff"
            strokeWidth="1.5"
            fill="none"
            opacity=".6"
          />
        </>
      )}
      {cat === "poncage" && (
        <>
          <circle cx="160" cy="92" r="52" fill="none" stroke={c} strokeWidth="3" />
          <circle cx="160" cy="92" r="30" fill="none" stroke={c} strokeWidth="1.5" opacity=".6" />
          <path
            d="M160,92 m-52,0 a52,52 0 0 1 52,-52"
            stroke="#fff"
            strokeWidth="2"
            fill="none"
            opacity=".5"
          />
          {[...Array(8)].map((_, i) => (
            <circle
              key={i}
              cx={70 + i * 26}
              cy={152 + (i % 2) * 8}
              r="2"
              fill={c}
              opacity=".55"
            />
          ))}
          <line x1="160" y1="40" x2="160" y2="14" stroke="#3a352c" strokeWidth="8" strokeLinecap="round" />
        </>
      )}
      {cat === "preparation" && (
        <>
          <rect x="26" y="128" width="268" height="24" fill="#3A342B" />
          <rect x="26" y="118" width="268" height="10" fill="#7FA6A0" />
          <rect x="26" y="82" width="268" height="36" fill="#E8D48B" />
          {[...Array(9)].map((_, i) => (
            <line
              key={i}
              x1={56 + i * 28}
              y1="82"
              x2={56 + i * 28}
              y2="118"
              stroke="rgba(21,18,13,.25)"
            />
          ))}
          <rect x="26" y="72" width="268" height="10" fill="#8A8D93" />
          <rect x="26" y="40" width="268" height="32" fill="#C9B694" />
          <rect x="18" y="34" width="8" height="118" fill="none" stroke={c} strokeDasharray="4 3" />
        </>
      )}
      {cat === "sinistres" && (
        <>
          <rect x="26" y="60" width="268" height="80" fill="#8F7D5C" opacity=".5" />
          <polyline
            points="40,100 90,92 130,108 180,88 230,104 280,94"
            stroke={c}
            strokeWidth="3"
            fill="none"
          />
          {[90, 150, 210].map((x) => (
            <line key={x} x1={x} y1="78" x2={x} y2="118" stroke="#EFE9DC" strokeWidth="4" />
          ))}
          <text
            x="30"
            y="52"
            fontFamily="Red Hat Mono"
            fontSize="10"
            fill="rgba(239,233,220,.4)"
            letterSpacing="2"
          >
            AGRAFES + RÉSINE
          </text>
        </>
      )}
    </svg>
  );
}

export default function CarteChantiers() {
  const reduced = useReducedMotion();
  const [cat, setCat] = useState<Filtre>("all");
  const [villeId, setVilleId] = useState<string | null>(null);

  const filtered = (v: Ville, c: Filtre = cat) =>
    v.jobs.filter((j) => c === "all" || j.cat === c);

  const setCategory = (c: Filtre) => {
    setCat(c);
    if (villeId) {
      const v = VILLES.find((x) => x.id === villeId);
      if (v && !filtered(v, c).length) setVilleId(null);
    }
  };

  const pick = (id: string) => setVilleId((cur) => (cur === id ? null : id));
  const onMarkerKey = (e: KeyboardEvent, id: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      pick(id);
    }
  };

  const ville = villeId ? VILLES.find((v) => v.id === villeId) : null;
  const villeJobs = ville ? filtered(ville) : [];
  const total = VILLES.reduce((a, v) => a + filtered(v).length, 0);
  const nbVilles = VILLES.filter((v) => filtered(v).length).length;
  const m2 = VILLES.flatMap((v) => filtered(v)).reduce((a, j) => {
    const m = j.t.match(/(\d+)\s*m²/);
    return a + (m ? +m[1] : 0);
  }, 0);

  return (
    <section id="zone">
      <div className="sec-head rv">
        <span className="kicker">05 — CHANTIERS &amp; ZONE</span>
        <h2>
          La carte des
          <br />
          <em>coulées</em>.
        </h2>
        <div className="level-rule" />
        <p className="map-intro">
          Basés en région lyonnaise, nous intervenons sur tout Rhône-Alpes. Touchez une ville
          pour voir les chantiers livrés.
        </p>
      </div>

      <div className="map-filters rv d1" aria-label="Filtrer les chantiers par métier">
        {FILTRES.map((f) => (
          <button
            key={f.cat}
            className={`chip${cat === f.cat ? " on" : ""}`}
            onClick={() => setCategory(f.cat)}
            aria-pressed={cat === f.cat}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="map-wrap rv d1">
        <div className="map-box">
          <svg
            id="mapSvg"
            viewBox="0 0 800 620"
            role="img"
            aria-label="Carte des chantiers en Rhône-Alpes"
          >
            <defs>
              <pattern
                id="hatch"
                width="14"
                height="14"
                patternUnits="userSpaceOnUse"
                patternTransform="rotate(45)"
              >
                <line x1="0" y1="0" x2="0" y2="14" stroke="rgba(239,233,220,.05)" strokeWidth="1" />
              </pattern>
            </defs>
            {/* graticule */}
            <g stroke="rgba(239,233,220,.05)" strokeWidth="1">
              <line x1="0" y1="155" x2="800" y2="155" />
              <line x1="0" y1="310" x2="800" y2="310" />
              <line x1="0" y1="465" x2="800" y2="465" />
              <line x1="200" y1="0" x2="200" y2="620" />
              <line x1="400" y1="0" x2="400" y2="620" />
              <line x1="600" y1="0" x2="600" y2="620" />
            </g>
            {/* région stylisée */}
            <path
              d="M150,185 L235,120 L330,98 L455,90 L545,118 L640,142 L700,215 L695,320
                 L655,410 L590,470 L545,555 L455,585 L350,552 L245,565 L155,505 L95,405 L82,300 L110,225 Z"
              fill="url(#hatch)"
              stroke="rgba(239,233,220,.22)"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M150,185 L235,120 L330,98 L455,90 L545,118 L640,142 L700,215 L695,320
                 L655,410 L590,470 L545,555 L455,585 L350,552 L245,565 L155,505 L95,405 L82,300 L110,225 Z"
              fill="rgba(201,182,148,.03)"
              stroke="none"
            />
            {/* fleuves : Saône puis Rhône */}
            <path
              d="M385,95 C392,160 388,235 400,300"
              fill="none"
              stroke="rgba(127,166,160,.45)"
              strokeWidth="2"
            />
            <path
              d="M555,150 C505,205 445,255 400,300 C388,360 405,420 428,480 C438,520 425,555 415,585"
              fill="none"
              stroke="rgba(127,166,160,.55)"
              strokeWidth="2.5"
            />
            {/* relief alpin suggéré */}
            <g stroke="rgba(239,233,220,.12)" strokeWidth="1.5" fill="none">
              <path d="M600,250 l16,-20 l16,20" />
              <path d="M640,300 l14,-18 l14,18" />
              <path d="M615,355 l15,-19 l15,19" />
              <path d="M660,225 l12,-15 l12,15" />
            </g>
            <text
              x="120"
              y="590"
              fontFamily="Red Hat Mono"
              fontSize="12"
              letterSpacing="4"
              fill="rgba(239,233,220,.18)"
            >
              AUVERGNE-RHÔNE-ALPES
            </text>
            <g>
              {VILLES.map((v) => {
                const n = filtered(v).length;
                const sel = v.id === villeId;
                const bx = v.x + 14 + v.n.length * 7.4;
                return (
                  <g
                    key={v.id}
                    className={`mk${n ? " pulse" : " dim"}${sel ? " sel" : ""}`}
                    tabIndex={n ? 0 : -1}
                    role="button"
                    aria-label={`${v.n} — ${n} chantier${n > 1 ? "s" : ""}`}
                    aria-pressed={sel}
                    onClick={() => pick(v.id)}
                    onKeyDown={(e) => onMarkerKey(e, v.id)}
                  >
                    <circle className="hit" cx={v.x} cy={v.y} r="20" />
                    {!reduced && n > 0 && <circle className="ring" cx={v.x} cy={v.y} r="7" />}
                    <circle className="dot" cx={v.x} cy={v.y} r={sel ? 7 : 5.5} />
                    <text x={v.x + 14} y={v.y + 4}>
                      {v.n}
                    </text>
                    {n > 0 && (
                      <>
                        <rect className="badge-bg" x={bx} y={v.y - 6} width="20" height="15" rx="2" />
                        <text className="badge-tx" x={bx + 10} y={v.y + 5} textAnchor="middle">
                          {n}
                        </text>
                      </>
                    )}
                  </g>
                );
              })}
            </g>
          </svg>
          <div className="map-legend">
            // DONNÉES DE DÉMONSTRATION — REMPLACEZ PAR VOS CHANTIERS &amp; PHOTOS RÉELS
          </div>
        </div>

        <aside className="map-panel" aria-live="polite">
          {!ville ? (
            <>
              <div className="mp-head">Rhône-Alpes</div>
              <div className="mp-sub">ZONE D'INTERVENTION — DÉPLACEMENT ÉTUDIÉ AU-DELÀ</div>
              <div className="mp-tot">
                <div>
                  <div className="v">{total}</div>
                  <div className="l">CHANTIERS</div>
                </div>
                <div>
                  <div className="v">{nbVilles}</div>
                  <div className="l">VILLES</div>
                </div>
                <div>
                  <div className="v">{m2.toLocaleString("fr-FR")}</div>
                  <div className="l">M² TRAITÉS</div>
                </div>
              </div>
              <p className="mp-hint">
                Sélectionnez une ville sur la carte pour voir le détail des chantiers :
                catégorie, surface, année. Les vignettes sont des visuels d'attente — vos
                photos de chantier prendront leur place.
              </p>
            </>
          ) : (
            <>
              <div className="mp-head">{ville.n}</div>
              <div className="mp-sub">
                {villeJobs.length} CHANTIER{villeJobs.length > 1 ? "S" : ""}
                {cat !== "all" ? ` — ${CATS[cat].label}` : ""}
              </div>
              {villeJobs.length ? (
                villeJobs.map((j) => (
                  <div className="job" key={j.t}>
                    <div className="thumb">
                      <Thumb cat={j.cat} />
                      <span className="ph">PHOTO À VENIR</span>
                    </div>
                    <div className="body">
                      <span className="tag" style={{ background: CATS[j.cat].color }}>
                        {CATS[j.cat].label}
                      </span>
                      <h4>{j.t}</h4>
                      <div className="meta">{j.m}</div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="mp-hint">
                  Aucun chantier {cat !== "all" ? CATS[cat].label.toLowerCase() : ""} référencé
                  ici — mais on se déplace volontiers.
                </p>
              )}
            </>
          )}
        </aside>
      </div>
    </section>
  );
}
