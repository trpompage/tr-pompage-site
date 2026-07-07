# TR POMPAGE — Kit Claude Code (upload iPhone)

## Mettre ces 4 fichiers sur GitHub (depuis l'iPhone)
1. Sur **github.com** (Safari) : **New repository** → nom `tr-pompage-site` → Create.
2. Dans le repo : **Add file → Upload files** → sélectionne dans l'app Fichiers :
   `README.md`, `CLAUDE.md`, `PROMPT.md`, `site-v3-reference.html`
3. **Commit changes**. C'est tout — pas de dossier, pas de zip.

## Lancer Claude Code depuis l'iPhone
1. Ouvre **claude.ai/code** (Safari ou app Claude) → connecte **GitHub** → choisis `tr-pompage-site` → nouvelle session.
2. Dans le sélecteur de modèle de la session, choisis **Fable 5** (pas besoin de fichier de config : le choix se fait ici).
3. Colle :
   `Lis CLAUDE.md puis exécute PROMPT.md phase par phase, en commençant par le plan de P0.`
4. Valide les plans, relis les diffs, et vérifie le rendu sur les URLs de preview Vercel dans Safari.

## Rappels
- **Fable 5** : le plus capable, ~2× le coût d'Opus 4.8 → garde-le pour les grosses phases (P1, P2, P5), repasse sur Opus/Sonnet pour les retouches.
- Les données de la carte et les vignettes photo de `site-v3-reference.html` sont des **exemples** : tes vrais chantiers et clichés arriveront en P2.
- Coordonnées placeholder (06 00 00 00 00 / contact@trpompage.fr) : à remplacer quand tu fournis les vraies.
