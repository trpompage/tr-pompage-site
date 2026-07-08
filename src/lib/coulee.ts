/** Logique métier du calculateur de coulée.
 *  Valeurs indicatives — chaque chantier est chiffré sur plan. */

export const DEBIT_M3_H = 20; // débit de pompage de référence
export const TOUPIE_M3 = 7.5; // capacité d'un camion malaxeur
export const CUVE_M3 = 40; // cuve de visualisation

/** volume de chape en m³ pour une surface (m²) et une épaisseur (mm) */
export function volumeChape(surfaceM2: number, epaisseurMm: number): number {
  return (surfaceM2 * epaisseurMm) / 1000;
}

/** temps de pompage en minutes */
export function tempsPompageMin(volumeM3: number, debitM3H = DEBIT_M3_H): number {
  return (volumeM3 / debitM3H) * 60;
}

/** nombre de camions malaxeurs nécessaires (minimum 1) */
export function nbToupies(volumeM3: number, capaciteM3 = TOUPIE_M3): number {
  return Math.max(1, Math.ceil(volumeM3 / capaciteM3));
}

/** format fr-FR à d décimales (ex. 6 → "6,0") */
export function fmt(n: number, d: number): string {
  return n.toLocaleString("fr-FR", {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  });
}

/** temps affiché : minutes en dessous d'1 h, heures décimales au-delà */
export function formatTemps(minutes: number): { v: string; u: string } {
  return minutes < 60
    ? { v: String(Math.round(minutes)), u: "min" }
    : { v: fmt(minutes / 60, 1), u: "h" };
}
