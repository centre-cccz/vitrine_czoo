# Design system

## Palette de couleurs observée

- vert institutionnel : `#0f6b3a`
- vert sombre : `#1c3a2d`
- or : `#d4af37`
- fond neutre : `#f7f3eb`
- texte principal : `#1c3a2d`
- texte secondaire : `#546451`

## Typographie

- `Segoe UI`, `Tahoma`, `Geneva`, `Verdana` pour l’écosystème global
- hiérarchies claires par titres, lead et microcopy
- style sérieux et culturel, sans surchargement

## Éléments communs

- boutons arrondis et accentués
- cartes avec ombres légères et bordures subtiles
- sections espacées et hiérarchisées
- navigation sticky avec image/logo de marque
- footer visuellement net et lisible

## Incohérences observées

- plusieurs variantes de styles et de layouts selon les pages
- certains fichiers CSS ajoutent des règles héritées ou redondantes
- la page d’accueil a connu plusieurs formulations visuelles sans un modèle commun stable

## Recommandation

- définir un système de tokens basé sur : couleurs, radius, espace, type, ombres
- organiser les styles en base + composants + pages
- ne pas mélange de logique de page et de design system dans les mêmes fichiers
- conserver la personnalité culturelle du Centre sans surcharge visuelle
