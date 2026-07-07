/** DONNÉES DE DÉMONSTRATION — à remplacer par les chantiers réels (P2 :
 *  migration vers src/data/chantiers.json avec coordonnées GPS + photos). */

export type Categorie = "pompage" | "preparation" | "poncage" | "sinistres";

export interface Chantier {
  cat: Categorie;
  t: string; // titre
  m: string; // méta (année · liant · détail)
}

export interface Ville {
  id: string;
  n: string; // nom affiché
  x: number; // coordonnées SVG (carte stylisée P0)
  y: number;
  jobs: Chantier[];
}

export const CATS: Record<Categorie, { label: string; color: string }> = {
  pompage: { label: "POMPAGE", color: "#FF5A1F" },
  preparation: { label: "PRÉPARATION", color: "#7FA6A0" },
  poncage: { label: "PONÇAGE", color: "#C9B694" },
  sinistres: { label: "SINISTRES", color: "#E8D48B" },
};

export const VILLES: Ville[] = [
  {
    id: "lyon",
    n: "LYON",
    x: 400,
    y: 300,
    jobs: [
      { cat: "pompage", t: "Immeuble R+4 — 620 m²", m: "2026 · Anhydrite · Plancher chauffant" },
      { cat: "poncage", t: "Plateau de bureaux — 340 m²", m: "2025 · Anhydrite · Livré prêt à coller" },
      { cat: "sinistres", t: "Dégât des eaux — reprise 45 m²", m: "2025 · Séchage technique + reprise locale" },
    ],
  },
  {
    id: "villefranche",
    n: "VILLEFRANCHE",
    x: 388,
    y: 212,
    jobs: [
      { cat: "pompage", t: "Maison individuelle — 140 m²", m: "2026 · Chape ciment fluide" },
    ],
  },
  {
    id: "bourg",
    n: "BOURG-EN-BRESSE",
    x: 472,
    y: 178,
    jobs: [
      { cat: "pompage", t: "Lotissement 6 pavillons — 780 m²", m: "2025 · Anhydrite · 3 coulées" },
    ],
  },
  {
    id: "annecy",
    n: "ANNECY",
    x: 612,
    y: 206,
    jobs: [
      { cat: "poncage", t: "Résidence collective — 510 m²", m: "2026 · Ponçage + contrôle bombe à carbure" },
    ],
  },
  {
    id: "chambery",
    n: "CHAMBÉRY",
    x: 598,
    y: 296,
    jobs: [
      { cat: "pompage", t: "Chalet — 95 m²", m: "2025 · Anhydrite · Plancher chauffant" },
    ],
  },
  {
    id: "grenoble",
    n: "GRENOBLE",
    x: 560,
    y: 388,
    jobs: [
      { cat: "pompage", t: "Maison passive — 300 m²", m: "2026 · Anhydrite · PC basse température" },
      { cat: "preparation", t: "TMS 80 + Assour Chape — 210 m²", m: "2025 · Isolation thermique + acoustique" },
    ],
  },
  {
    id: "bourgoin",
    n: "BOURGOIN",
    x: 498,
    y: 322,
    jobs: [
      { cat: "preparation", t: "TMS + polyane + Tramichape — 260 m²", m: "2026 · Collectif R+2" },
    ],
  },
  {
    id: "vienne",
    n: "VIENNE",
    x: 404,
    y: 356,
    jobs: [
      { cat: "poncage", t: "Maison de ville — 120 m²", m: "2024 · Laitance éliminée, primaire posé" },
    ],
  },
  {
    id: "ste",
    n: "ST-ÉTIENNE",
    x: 298,
    y: 372,
    jobs: [
      { cat: "pompage", t: "Réhabilitation usine — 450 m²", m: "2025 · Chape ciment · Ravoirage" },
      { cat: "sinistres", t: "Fissures — agrafage résine 28 ml", m: "2024 · Fissures stabilisées, recousues" },
    ],
  },
  {
    id: "valence",
    n: "VALENCE",
    x: 428,
    y: 478,
    jobs: [
      { cat: "sinistres", t: "Casse + re-coulée — 85 m²", m: "2025 · Dépose PC condamné, recoulé en 5 j" },
    ],
  },
];
