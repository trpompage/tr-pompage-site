# TR POMPAGE — Site vitrine "liquid 3D"

## Contexte métier
TR Pompage est une entreprise de **pompage de chape fluide** (anhydrite & ciment) basée en région lyonnaise, intervenant sur tout Rhône-Alpes. Clients : **professionnels uniquement** — carreleurs, plombiers-chauffagistes, constructeurs, maîtres d'œuvre. Le concept central du produit ET du site : **la chape est autonivelante** — tout le design file cette métaphore (liquide qui trouve son niveau).

## Référence de design (SOURCE DE VÉRITÉ)
`site-v3-reference.html` est le prototype validé par le client (4 pages : Accueil/Pompage, Préparation, Ponçage, Sinistres & autres).

**RÈGLE D'AMBITION — LE PLANCHER, PAS LE PLAFOND.** La référence fixe l'identité (tokens, ton, contenu métier, idées) mais le client attend un résultat **nettement plus spectaculaire** qu'elle. Interdiction de livrer une simple transposition : chaque phase doit faire paraître la référence comme une maquette. Avant de présenter un résultat, compare-le côte à côte à la référence ; si le gain n'est pas évident, itère d'abord. Le spectaculaire ne doit jamais coûter la lisibilité ni la performance (budgets en fin de fichier).

Idées de la référence à conserver et dépasser :
- Hero : métaballs 3D visqueuses (raymarching) + flaque autonivelante, gouttes au clic avec ondulations
- Fonte du blob au scroll ("la gravité fait le reste")
- Calculateur de coulée (m² × mm → m³, temps de pompage, toupies, cuve animée)
- Carte interactive des chantiers par ville (filtres par métier, panneau de fiches chantier) — données & vignettes de démonstration à remplacer
- Pages métier documentées : coupe du système de préparation (TMS®/polyane/Assour®/Tramichape®), protocole de ponçage en 5 temps, réparation fissures (agrafage résine) & sinistres
- Jauge de niveau au scroll, règles de titre qui s'autonivellent ("BULLE · 0,0°"), curseur goutte gooey, préloader "AMORÇAGE DE LA POMPE", boutons magnétiques, marquee

## Design tokens (NON NÉGOCIABLES)
```css
--ink:#15120D;        /* graphite coffrage (fond) */
--ink2:#1D1913;
--screed:#C9B694;     /* chape mouillée */
--screed-deep:#8F7D5C;
--bone:#EFE9DC;       /* texte */
--orange:#FF5A1F;     /* orange sécurité chantier (accent) */
```
- Display : **Bricolage Grotesque** 700/800 (uppercase) · Body : **Barlow** 400 · Data/labels : **Red Hat Mono** 400/700
- Interdits : dégradés violets, coins arrondis uniformes, Inter, cream+terracotta générique, emoji dans l'UI (sauf 📞 existant), lorem ipsum.

## Copy
- Français, **vouvoiement**, ton chantier direct et sûr de lui. Labels techniques en mono uppercase préfixés `//` quand pertinent.
- Chiffres de cadence (20 m³/h, 1000 m²/j, 180 m, 30 mm) = **valeurs indicatives** → toujours accompagnées de la mention "valeurs indicatives — chiffré sur plan". Ne jamais inventer de certifications, avis clients ou références chantier.
- Coordonnées placeholder à conserver telles quelles tant que le client ne fournit pas les vraies : `06 00 00 00 00`, `contact@trpompage.fr`.

## Stack cible
- **Vite + React 18 + TypeScript**, Tailwind CSS v4
- 3D : **React Three Fiber** + drei + postprocessing ; shaders GLSL dans `src/shaders/*.glsl` (plugin vite-plugin-glsl)
- Formulaire devis : API route/serverless + **Resend** (clé en env `RESEND_API_KEY`, jamais en dur) + honeypot anti-spam
- Déploiement : **Vercel**

## Exigences qualité
- Lighthouse ≥ 95 sur les 4 axes (mobile) ; LCP < 2,5 s
- `prefers-reduced-motion` respecté partout (3D → frame statique, sim/curseur désactivés)
- Qualité GPU adaptative conservée (mesure FPS → baisse DPR/pas de raymarching)
- Canvas 3D en pause hors viewport ; aucun listener scroll non-passif
- Accessibilité : focus visible, contrastes AA, canvas décoratifs `aria-hidden`, simulateur utilisable au clavier (bouton COULER focusable)
- SEO : meta FR, OG/Twitter cards, `schema.org/LocalBusiness`, sitemap, page 404 thématisée ("CHANTIER INTROUVABLE")

## Commandes
```bash
npm run dev       # serveur local
npm run build     # build prod
npm run preview   # vérifier le build
npx vitest        # tests (logique calculateur & simulateur)
```

## Méthode de travail attendue
1. Toujours commencer une grosse phase en **mode plan**, présenter le plan, attendre validation.
2. Committer par étape atomique avec messages en français (`feat: hero fluide navier-stokes`).
3. Après chaque phase : lancer le build, vérifier la console, faire un screenshot si l'outil le permet, s'auto-critiquer vs la référence avant de passer à la suite.
4. Ne jamais dégrader une interaction existante de la référence sans le signaler explicitement.
