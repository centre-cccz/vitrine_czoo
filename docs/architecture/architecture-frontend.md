# Architecture frontend

## Technos observées

- HTML5
- CSS3
- JavaScript vanilla
- Bootstrap 5 via CDN
- Font Awesome via CDN
- PHP pour traitement d’un formulaire

## Structure

- `accueil.html` : page d’entrée principale
- `programmes.html` : catalogue des activités
- `actualites.html` : actualités et agenda
- `galerie.html` : médiathèque visuelle et évènements
- `apropos.html` : institution, histoire, gouvernance
- `partenaires.html` : institutionnels et collaborateurs
- `contact.html` : coordonnées et formulaire de contact
- `event.html` : détails d’un événement

## Composants partagés

- `includes/nav.html` : navigation principale
- `includes/footer.html` : pied de page commun
- `js/include-nav.js` : inclusion du header/footer
- `script.js` : logique de mise en évidence de la page active

## CSS

- `css/style.css` : styles globaux de base
- `css/theme.css` : variables de thème
- `css/accueil.css` : styles spécifiques à l’accueil
- `css/programmes.css`, `css/actualites.css`, etc. : styles spécifiques

## Points de friction

- plusieurs fichiers CSS s’ajoutent à la logique globale
- certaines règles semblent redondantes entre fichiers
- page d’accueil précédemment très dense et répétitive ; la refonte cible vise à simplifier l’architecture éditoriale

## Recommandation

- centraliser les variables et composants de navigation
- réduire les doublons de styles spécifiques
- maintenir une hiérarchie claire : base → sections → pages
- éviter d’introduire un framework sans besoin réel avant la phase suivante
