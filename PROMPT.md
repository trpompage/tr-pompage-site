# PROMPT DE MISSION — à coller tel quel dans Claude Code

Lis d'abord `CLAUDE.md` puis ouvre `site-v3-reference.html` dans un navigateur pour comprendre le prototype validé (interactions, tokens, copy). Ta mission : transformer ce prototype mono-fichier en **vrai site de production** pour TR Pompage, en montant le niveau technique sans perdre l'identité.

Travaille en **mode plan** au démarrage de chaque phase : présente ton plan, attends ma validation, puis exécute. Une phase = des commits atomiques + un build vert + une auto-critique face à la référence.

## P0 — Fondations
Scaffold Vite + React 18 + TS + Tailwind v4 + R3F/drei + vite-plugin-glsl. Migre la structure de la référence en pages et composants : pages `/`, `/preparation`, `/poncage`, `/sinistres` avec vraies routes (React Router), composants `Hero`, `Marquee`, `Principe`, `Metiers`, `Calculateur`, `CarteChantiers`, `Clients`, `Contact`, `Gauge`, `Preloader`, `GooCursor`, `PageHero`, `Steps`, `Callout`, `CoupeSysteme`. Extraits les tokens en thème Tailwind. Le site doit être iso-fonctionnel avec la référence à la fin de P0.

## P1 — Hero fluide nouvelle génération
Remplace/augmente le raymarching actuel par une **vraie simulation fluide Navier-Stokes WebGL2** (advection, divergence, pression, vorticity confinement) teintée chape (`--screed`) sur fond `--ink`, réactive au pointeur, en couche derrière les métaballs 3D existantes (garde la flaque + gouttes au clic). Post-processing léger (bloom subtil sur le liseré orange). Qualité adaptative : FBO half-res si FPS < 45, frame statique si `prefers-reduced-motion`.

## P2 — Carte des chantiers réelle + calculateur testé
Remplace la carte SVG de démonstration par une vraie carte **MapLibre GL avec fond sombre** stylé aux tokens du site : marqueurs par ville, badges de comptage, filtres par métier, panneau de fiches chantier. Données dans `src/data/chantiers.json` (ville, coordonnées GPS, catégorie, titre, méta, chemin photo) pour que le client les édite sans toucher au code. Prépare `public/photos/chantiers/` avec un composant `<PhotoChantier>` qui affiche la vignette SVG d'attente tant que la photo réelle n'existe pas. Extrais la logique du calculateur dans `src/lib/` et **teste-la avec Vitest** (volume, temps, toupies, formats fr-FR).

## P3 — Formulaire de devis réel
Section devis : nom entreprise, métier (select), téléphone, email, ville chantier, surface m², épaisseur mm, type de chape, échéance, message. Validation zod, honeypot + rate-limit simple, envoi via **Resend** (route serverless Vercel, `RESEND_API_KEY` en variable d'env). Récap auto dans l'email : volume estimé + temps de pompage (réutilise `src/lib/`). État succès thématisé : tampon "DEMANDE COULÉE ✓".

## P4 — SEO & contenu
Meta FR complètes, Open Graph + image OG générée (1200×630, style tokens), `schema.org/LocalBusiness` (zone Rhône-Alpes), sitemap + robots, page 404 "CHANTIER INTROUVABLE" avec le blob, favicon goutte orange. Titres et hiérarchie Hn propres.

## P5 — Performance & accessibilité
Objectif Lighthouse mobile ≥ 95 partout : fonts self-hostées + `font-display:swap`, code-splitting des canvas (lazy + `IntersectionObserver`), preload critique, compression assets. Audit a11y : navigation clavier complète (y compris COULER), focus visibles, contrastes, `aria-hidden` sur le décoratif, reduced-motion vérifié sur chaque animation.

## P6 — Déploiement
Config Vercel (env vars documentées dans `.env.example`), déploiement, vérification Lighthouse en prod, README final avec instructions de mise à jour du contenu (téléphone, email, chiffres de cadence) pour que le client soit autonome.

Contraintes permanentes : tokens et interdits de `CLAUDE.md`, copy FR vouvoiement, aucune donnée inventée (avis, certifs, références), coordonnées placeholder inchangées jusqu'à fourniture des vraies.
