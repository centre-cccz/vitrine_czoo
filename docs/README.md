# Documentation technique — Centre culturel congolais « Le Zoo »

## Objet

Ce dossier vise à documenter l’état réel du projet, la structure du site public, les dépendances techniques, les limites actuelles et la trajectoire recommandée pour la suite du développement, notamment la future Gestion interne.

Le projet observé est avant tout un site public statique en HTML/CSS/JavaScript, avec quelques points d’intégration PHP et base de données MySQL. Il ne s’agit pas d’une application web full-stack moderne à l’échelle d’un SaaS, mais d’un site institutionnel culturel avec un bon potentiel de structuration métier.

## Source de vérité

- Site public / contenu institutionnel : fichiers racine, pages HTML, CSS, JS, includes, images
- Base de données : `db.php`
- Formulaire de contact : `contact-submit.php`
- Documentation institutionnelle : `docs/*.md` et documents officiels du Centre
- Gestion interne : `Gestion_Interne-CZoo/` (première version PHP protégée)
- Provisionnement d’un directeur : `scripts/create-director.php` (CLI uniquement, mot de passe fourni hors dépôt)

## État général

- Architecture actuelle : statique, multi-pages, HTML/CSS/JS
- Frontend : pages HTML réutilisant un nav/footer partagé via includes
- Backend : limité à un wrapper PDO et un traitement PHP de contact
- Base de données : MySQL local (DSN défini dans `db.php`), table `contact_requests`
- Authentification : non présent sur le site public ; aucune auth réelle documentée
- Sécurité : basique, sans gestion de secrets, sans environnement de configuration séparé
- Déploiement : non documenté dans le dépôt; à confirmer chez le Centre
- Gestion interne : prévue comme architecture distincte, mais non implémentée

## Architecture du projet

- Site public : pages de contenu, actualités, galerie, programmation, contact, à propos
- Gestion interne : projet séparé, non encore déployé / implémenté
- Assets : images, logos, visuels, documents institutionnels
- Services externes : CDN Bootstrap, Font Awesome, mail PHP locale, base MySQL locale

## Documentation principale

| Domaine | Emplacement | Utilité |
| --- | --- | --- |
| Vision | `docs/vision/` | Mission, périmètre, objectifs |
| Architecture | `docs/architecture/` | Vue d’ensemble du système |
| ADR | `docs/adr/` | Décisions importantes |
| API | `docs/api/` | Contrats et conventions |
| Base de données | `docs/database/` | Schéma, entités et dictionnaire |
| Sécurité | `docs/security/` | Modèle, risques et recommandations |
| Diagrammes | `docs/diagrams/` | Contextes métiers et techniques |
| RFC | `docs/rfcs/` | Changements majeurs |
| Roadmap | `docs/roadmap/` | Evolution du projet |
| Opérations | `docs/operations/` | Déploiement, backups, restaurations |
| Gouvernance | `docs/governance/` | Standards et workflow |
| Audit | `docs/audit/` | État actuel vs cible |
| IA / agents | `docs/AI_CONTEXT.md`, `AGENTS.md` | Prise en main rapide |

## Points forts

- Structure claire et lisible d’un site institutionnel culturel
- Contenu historique et institutionnel déjà présent
- Navigation cohérente par pages
- Vocabulaire culturel et missionnel identifiable
- Base de données et formulaire de contact présents, même s’ils sont encore modestes

## Points faibles

- Site majoritairement statique, sans couche applicative clairement structurée
- Peu de séparation entre contenu, logique métier et infrastructure
- Pas de documentation technique centralisée
- Aucun standard CI/CD observable dans le dépôt
- Aucune authentification ni gestion d’utilisateurs documentée pour le site public
- Gestion interne non spécifiée comme système séparé et sécurisé
- Rôle des dépendances externes non maîtrisé dans un environnement de production

## Règles de travail

- Ne pas confondre l’état actuel (existant) et l’état cible (recommandé)
- Ne pas inventer un système qui n’existe pas
- Documenter explicitement les zones à confirmer par le Centre
- Préserver la séparation : site public / Gestion interne / infrastructure / données
- Préférer la simplicité, la sécurité et la maintenabilité

## Déploiement

Le dépôt ne contient pas de configuration explicite de build ou de déploiement. Les fichiers observés indiquent un hébergement PHP/MySQL classique, mais l’environnement exact n’est pas documenté dans le dépôt. À confirmer : CI/CD, DNS, nom de domaine, serveur Web, certificats HTTPS, sauvegardes et accès administratifs.

## Contribution

1. Lire cette documentation et les documents de référence.
2. Travailler en gardant la séparation entre état actuel et architecture cible.
3. Documenter les décisions importantes via l’ADR.
4. Pour les changements majeurs, utiliser le mécanisme RFC.
5. Ne pas ajouter de complexité sans nécessité explicite.

## Conclusion

Le projet est viable et cohérent comme site institutionnel public, mais il manque encore un socle de gouvernance technique, de sécurité et d’architecture de données. La prochaine étape logique est de stabiliser le site public, formaliser les données, puis concevoir la Gestion interne avec une séparation explicite d’accès, permissions et responsabilités.
