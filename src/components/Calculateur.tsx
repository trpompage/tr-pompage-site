import { Fragment, useState } from "react";
import {
  CUVE_M3,
  fmt,
  formatTemps,
  nbToupies,
  tempsPompageMin,
  volumeChape,
} from "../lib/coulee";

/** Calculateur de coulée : m² × mm → m³, temps de pompage, toupies + cuve animée. */
export default function Calculateur() {
  const [surface, setSurface] = useState(120);
  const [epaisseur, setEpaisseur] = useState(50);

  const vol = volumeChape(surface, epaisseur);
  const temps = formatTemps(tempsPompageMin(vol));
  const toupies = nbToupies(vol);

  return (
    <div className="calc rv d2">
      <div className="pane">
        <h3>Calculateur de coulée</h3>
        <div className="sub">// ESTIMATION INSTANTANÉE — DÉBIT DE RÉFÉRENCE 20 M³/H</div>
        <div className="field">
          <label htmlFor="inS">
            SURFACE À COULER <output>{surface.toLocaleString("fr-FR")} m²</output>
          </label>
          <input
            type="range"
            id="inS"
            min={20}
            max={1500}
            step={5}
            value={surface}
            onChange={(e) => setSurface(+e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="inE">
            ÉPAISSEUR DE CHAPE <output>{epaisseur} mm</output>
          </label>
          <input
            type="range"
            id="inE"
            min={30}
            max={80}
            step={1}
            value={epaisseur}
            onChange={(e) => setEpaisseur(+e.target.value)}
          />
        </div>
        <div className="calc-out">
          <div className="co">
            <div className="v">
              {fmt(vol, 1)}
              <small>m³</small>
            </div>
            <div className="l">Volume de chape</div>
          </div>
          <div className="co">
            <div className="v">
              {temps.v}
              <small>{temps.u}</small>
            </div>
            <div className="l">Temps de pompage</div>
          </div>
          <div className="co">
            <div className="v">
              {toupies}
              <small>{toupies > 1 ? "toupies" : "toupie"}</small>
            </div>
            <div className="l">Camions malaxeurs</div>
          </div>
        </div>
      </div>
      <div className="pane tank-pane">
        <div className="tank">
          <div className="grad">
            {[10, 20, 30].map((v) => (
              <Fragment key={v}>
                <i style={{ bottom: `${(v / CUVE_M3) * 100}%` }} />
                <em style={{ bottom: `${(v / CUVE_M3) * 100}%` }}>{v} m³</em>
              </Fragment>
            ))}
          </div>
          <div
            className="liquid"
            style={{ height: `${Math.min((vol / CUVE_M3) * 100, 100)}%` }}
          >
            <div className="w" />
            <div className="w w2" />
          </div>
        </div>
        <div className="tank-label">
          VOTRE VOLUME → <b>{fmt(vol, 1)} m³</b> / CUVE 40 m³
        </div>
      </div>
    </div>
  );
}
