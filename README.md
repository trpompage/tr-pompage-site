# TR POMPAGE — Site vitrine "liquid 3D"

Site de production de TR Pompage (pompage de chape fluide, Rhône-Alpes), construit
à partir du prototype validé `site-v3-reference.html`.

- **Stack** : Vite · React 18 · TypeScript · Tailwind CSS v4 · React Three Fiber · GLSL
- **Pages** : `/` (pompage) · `/preparation` · `/poncage` · `/sinistres`
- **Docs de pilotage** : `CLAUDE.md` (règles) · `PROMPT.md` (phases P0 → P6)

## Commandes

```bash
npm install       # dépendances
npm run dev       # serveur local
npm run build     # build prod (tsc + vite)
npm run preview   # vérifier le build (port 4173)
npm test          # tests vitest (logique du calculateur)
npm run captures  # captures d'écran des 4 pages (nécessite preview lancé)
```

## Déploiement Vercel (preview par PR)

1. Sur [vercel.com](https://vercel.com) : **Add New → Project** → importer le repo
   GitHub `tr-pompage-site`.
2. Framework détecté automatiquement (Vite, cf. `vercel.json`) — ne rien changer,
   **Deploy**.
3. Chaque pull request reçoit ensuite automatiquement une **URL de preview**
   commentée dans la PR ; `main` est déployé en production.
4. Variables d'environnement (à partir de P3) : `RESEND_API_KEY` dans
   *Settings → Environment Variables* (jamais dans le code).

## Contenu à fournir par le client

- Coordonnées réelles (actuellement placeholders : `06 00 00 00 00`,
  `contact@trpompage.fr`).
- Chantiers réels + photos pour la carte (P2 : `src/data/chantiers.json`,
  `public/photos/chantiers/`). Les données actuelles sont des **démonstrations**.
- Confirmation des chiffres de cadence (valeurs indicatives affichées :
  20 m³/h, 1000 m²/j, 180 m, 30 mm).
