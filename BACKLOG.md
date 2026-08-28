# Backlog

## Accueil — aperçu photo au survol (Formation + Projets)

**Contexte (2026-08-28) :** sections **Diplômes et cursus** et **Ce que j’ai construit** = logo + texte seulement (plus sobre). Les visuels restent sur les pages dédiées (`pages/*.html`).

**Plus tard :** au survol / focus d’une carte, afficher la **grosse image en preview** (comme la timeline Parcours : `journey-preview` + `journey-preview-shot`), sans remettre la photo en permanence dans la carte.

**Formation — images candidates :**
- CPGE : `images/education/edinburgh-group-forth.jpg`
- ENSEM : `images/education/ensem-group.jpg`
- UC : `images/education/uc-campus.jpg`

**Projets — images candidates :**
- BeatOnStep : `images/beatonstep/site-screenshot-adaptive.png`
- Smart Bike Shelter : `images/bike-shelter/hero.jpg`
- Robot SAMI : `images/rover/optitrack-prime-x22.jpg` (fond sombre, `object-fit: contain`)
- ENSEM Conseil : `images/ensem-conseil/flinboost.jpg`

## Explorateur de repos GitHub

**Objectif :** rendre la structure des repos plus visible sur les pages projet code (SAMI, Bike Shelter, etc.).

**Approche retenue (hybride, pas d’API custom) :**

1. Garder les badges `git-badge` actuels → lien direct GitHub.
2. Ajouter un lien secondaire **Explorer le code** vers [GitHubTree](https://githubtree.mgks.dev/) par repo, ex. :
   - `https://githubtree.mgks.dev/?repo=rafa-create/SAMI_GITH`
   - `https://githubtree.mgks.dev/?repo=rafa-create/Bike-Shelter-GITH`
3. *(Optionnel)* Arbre statique au build via CLI `gh-tree` (`npx gh-tree user/repo -d 3 --style minimal`) collé dans un `<pre>` — cohérent avec le design du site, zero JS runtime.

**Pages candidates :** `pages/rover.html`, `pages/bike-shelter.html` (éventuellement BeatOnStep si repo code distinct).

**Non retenu pour l’instant :** explorateur interactif maison via API GitHub (CORS, rate limits, maintenance).
