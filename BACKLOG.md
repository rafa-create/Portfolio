# Backlog

## Audit recruteur (2026-08-28) — note globale 7,4/10

Référence : audit contenu orienté chasseur de têtes. Le site vise la **visibilité**, pas une recherche active d’emploi.

---

### P1 — Impact chiffre Stilog (métriques métier)

**Constat :** pas de chiffres (utilisateurs, temps gagné, volume de calculs, cadence de livraison).

**Décision :** ⏸ **Reporté / compliqué** — contenu soumis au secret des affaires (Safran). Ne pas inventer de metrics.

**Piste si un jour débloqué (anonymisé, fourchettes, ou qualitatif) :**
- « utilisé au quotidien par l’équipe métier Safran » (sans nombre)
- « remplace des étapes manuelles sur les maillages d’aubages » (sans %)
- « livraisons itératives sur le logiciel interne » (sans fréquence précise)

---

### P2 — Signal disponibilité / mobilité

**Constat audit :** pas de statut « ouvert aux opportunités », mobilité, type de contrat.

**Décision :** ❌ **Volontairement hors scope** — pas en recherche ; le site sert à se rendre visible uniquement. Ne pas ajouter de bandeau dispo / préavis / mobilité.

---

### P3 — Visuel Stilog (timeline + page)

**Constat :** aperçu hover = photo escape game → première impression peu « métier ».

**Décision :** ✅ **Fait**

**Action :**
- Remplacer l’image preview timeline (`stilog-escape-game.jpg`) par une visuelle pro Stilog.
- Source proposée : [visual-motor-stilog.jpg](https://stilog.com/fr/wp-content/uploads/2025/02/visual-motor-stilog.jpg) (télécharger en local, ex. `images/companies/stilog-visual-motor.jpg`).
- Conserver la photo escape game dans la section **Équipe** de `pages/stilog.html`.
- Mettre à jour `og:image` Stilog si l’hero/preview change.

---

### P4 — Stack Stilog trop légère

**Constat :** `Python · SQL · Git · VS Code` seul — sous-représente le poste actuel vs Alten/Insolem.

**Décision :** ✅ **Fait** (sans divulguer stack interne confidentielle si limite)

**Action :** enrichir avec libs / domaine publics plausibles (NumPy, SciPy, visualisation, desktop, etc.) — à valider avec ce qui est affichable.

---

### P5 — Compétences hors chemin principal

**Constat :** grille compétences en bas de `pages/education.html` seulement.

**Décision :** ✅ **Fait**

**Action :** bloc **Compétences** synthétique sur l’accueil (6–8 tags ou mini-grille), lien vers `#skills` sur la page formation.

---

### P6 — Passages à risque (ton recruteur)

**Constat :** passages trop perso / informels pour un lecteur corporate.

**Décision :** ✅ **Fait**

**Actions ciblées :**
| Zone | Problème | Correction |
|------|----------|------------|
| `pages/education.html` — Jean Perrin | Anecdote whisky / uisge beatha 1494 | Retirer ou raccourcir fortement |
| `pages/education.html` — devoirs UC (EN) | « how bad my English was XD » | Reformuler pro (ex. « early-stage English ») |
| `pages/education.html` — Jean Perrin | Classement DAUR 72ᵉ PSI | Adoucir ou remplacer (milieu de tableau / retirer le chiffre) |

---

### P7 — GitHub sous-exploité

**Constat audit :** pas de repos mis en avant sur l’accueil.

**Décision :** ⚠️ **Partiellement faux** — Bike Shelter a déjà un lien code (`git-badge` → `Bike-Shelter-GITH` sur `pages/bike-shelter.html`).

**Actions restantes (optionnel) :**
- SAMI / BeatOnStep : même pattern si repo public pertinent.
- Accueil : pas obligatoire ; les pages projet suffisent pour l’instant.

---

### P8 — Stage ouvrier 2021 sur la timeline

**Décision :** 🎨 **Carte blanche** — garder, raccourcir ou retirer selon ressenti ; pas de contrainte audit.

---

### P9 — UX mobile timeline (« Survolez… »)

**Décision :** 🎨 **Carte blanche** — améliorer le fallback mobile (tap / preview toujours visible) si un jour prioritaire.

---

### P10 — Détails secondaires

| Item | Décision |
|------|----------|
| **À propos** absent du menu | Optionnel |
| **LinkedIn dans `#contact`** | ✅ **À faire** — bouton LinkedIn à côté de l’email (LinkedIn déjà en footer) |
| **BeatOnStep « Actuellement »** | ✅ **À clarifier** — libellé **side project** (FR/EN), pas un poste ou une startup |
| **Robot SAMI** hors accueil projets | OK — reste sur page formation (#ensem) |
| **Page `/recruiter` ou PDF 1 page** | Backlog long terme, non prioritaire |

---

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

---

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

---

## Synthèse priorités implémentation

| Priorité | Item | Statut |
|----------|------|--------|
| 🔴 | P3 — Image Stilog pro | ✅ Fait |
| 🔴 | P6 — Passages à risque formation | ✅ Fait |
| 🟠 | P4 — Stack Stilog | ✅ Fait |
| 🟠 | P5 — Compétences sur accueil | ✅ Fait |
| 🟠 | P10 — LinkedIn contact + BeatOnStep side project | ✅ Fait |
| ⏸ | P1 — Metrics Stilog | Reporté (secret) |
| ❌ | P2 — Dispo / mobilité | Hors scope volontaire |
| 🎨 | P8, P9 | Carte blanche |
| ℹ️ | P7 — GitHub | Bike Shelter OK ; reste optionnel |
