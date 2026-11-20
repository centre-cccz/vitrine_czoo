# Stratégie de gestion des événements

> Statut : **proposition à valider par la Direction Générale**. Ce document décrit une cible, pas une fonctionnalité déjà implémentée.

## 1. Le circuit, de la programmation à la mise en ligne

| Phase | Qui | Produit |
| --- | --- | --- |
| 1. Conception | Direction de l'Animation et de la Préservation culturelle | Fiche événement : objet ou artiste, lieu, billetterie, équipe, partenaires pressentis, budget estimé |
| 2. Arbitrage | Direction Générale, avec l'Animation | Validation, place au calendrier, partenaires retenus, rattachement à un projet |
| 3. Préparation | Finances, Intendance, Administration, Bibliothèque (si le lieu est la bibliothèque) | Budget, logistique, autorisations, personnel affecté |
| 4. Mise en ligne | Pool Informatique | Publication sur le site, billetterie ou inscriptions, supports de communication |
| 5. Exécution | Équipe désignée dans la fiche | Déroulement, contrôle d'accès, encaissements |
| 6. Clôture | Animation, Finances, Pool Informatique | Rapport, fréquentation, recettes, archivage (rubrique « Retour sur ») |

**Règle** : le Pool Informatique publie ce qui est validé ; il ne programme pas. Aucun événement non validé par la Direction Générale n'est publié.

## 2. Fiche événement (champs à renseigner par l'Animation)

- Titre, catégorie (voir § 6), résumé court (200 caractères), description.
- Artiste(s), compagnie(s) ou objet de l'évènement.
- Lieu : salle de spectacle, galerie, bibliothèque, jardin, village des artistes, extérieur.
- Dates et horaires (une ou plusieurs séances), capacité du lieu.
- Billetterie : gratuit, payant, sur invitation ; tarifs ; canaux de vente (caisse, en ligne, partenaires).
- Équipe : agents et cadres responsables, avec leur rôle (régie, accueil, sécurité, communication).
- Partenaires et projet de rattachement.
- Budget estimé et visuels (affiche, photos), avec droits d'usage.

## 3. Statuts

`brouillon` → `proposé` (Animation) → `validé` (Direction Générale) → `en préparation` → `publié` (Pool Informatique) → `terminé` → `archivé`. Un événement peut passer à `annulé` depuis tout statut après `proposé`, avec motif.

## 4. Lien avec le schéma existant (`migrations/0002`)

| Besoin | Déjà prévu | À ajouter |
| --- | --- | --- |
| Événement, catégorie | `events`, `categories`, `event_occurrences` | Statuts `proposé`, `validé`, `publié` (aujourd'hui : draft, scheduled, cancelled, completed, archived) |
| Lieu | `spaces`, `event_occurrences.space_id` | Contrôle des conflits de réservation d'un même lieu |
| Artistes, partenaires | `artists`, `event_artists`, `partners`, `event_partners` | — |
| Projet | `projects` | `events.project_id` |
| Agents et cadres responsables | rien | `event_staff (event_id, user_id, role)` |
| Billetterie | `capacity`, `default_price` seulement | `ticket_types`, `tickets` (numéro, QR, statut, paiement) |
| Validation | rien | `event_approvals (event_id, user_id, décision, commentaire, date)` |
| Budget et recettes | `finance_entries.project_id` | `finance_entries.event_id` |

Une migration `0004` serait nécessaire. Elle ne doit pas être exécutée avant validation du circuit par la Direction Générale (voir `migrations/MIGRATIONS_README.md`).

## 5. Permissions suggérées (aucune n'existe encore)

`evenements.propose` (Animation), `evenements.validate` (Direction Générale), `evenements.publish` (Pool Informatique et Direction Générale), `evenements.read`.

## 6. Catalogue des types d'événements

| Famille | Exemples | Lieu habituel |
| --- | --- | --- |
| Scènes | théâtre, danse, concert, rumba, jazz, humour, conte, cirque et arts de la rue | Salle de spectacle, jardin |
| Festivals | FEKIPAF, JUCOTEJ, Kinshasa Jazz, musique traditionnelle, mode, poésie | Salle, jardin, galerie |
| Cinéma | projections, ciné-débats, ciné-club, festival du film européen | Salle de spectacle |
| Arts visuels | expositions, vernissages, expo-vente, résidences d'artistes, portes ouvertes du village des artistes | Galerie, jardin, village |
| Littérature | lectures publiques, Biblio-Forum, dédicaces, clubs de lecture, salon du livre | Bibliothèque |
| Jeunesse et écoles | programme jeunesse, visites scolaires, concours « génies en herbe », vacances culturelles | Bibliothèque, salle |
| Formation | masterclasses, ateliers, cours de l'Institut National des Arts | Salles, ateliers |
| Patrimoine et mémoire | journées des peuples autochtones, expositions d'archives, visites guidées du site (1956) | Galerie, site entier |
| Rencontres | conférences, colloques, forums, tables rondes, séminaires | Salle, bibliothèque |
| Éco-citoyen | journées d'assainissement, plantation, tri des déchets (lien avec le projet « Centre vert ») | Jardin |
| Solidaire | concerts de bienfaisance, collectes | Salle |
| Locations et privés | lancements, conférences d'entreprise, tournages, cérémonies | Selon disponibilité |

### Calendrier annuel récurrent (journées internationales à exploiter)

21 mars : poésie · 27 mars : théâtre · 23 avril : livre · 29 avril : danse · 30 avril : jazz · 18 mai : musées · 25 mai : Afrique · 5 juin : environnement · 21 juin : fête de la musique · 30 juin : fête de l'indépendance.

## 7. Checklist de mise en ligne (Pool Informatique)

1. Statut `validé` confirmé par la Direction Générale.
2. Fiche complète : date, lieu, tarif, contact, visuel libre de droits.
3. Billetterie ou inscription testée de bout en bout.
4. Page publiée, vérifiée sur mobile.
5. Diffusion : site, réseaux sociaux, WhatsApp, partenaires.
6. Retrait ou passage à « Retour sur » le lendemain de la fin.

## 8. Indicateurs de clôture

Fréquentation (inscrits, présents), recettes et coûts, partenaires mobilisés, satisfaction, photos et vidéos, enseignements. Ces données alimentent le rapport annuel soumis à la tutelle.

## 9. Rapport d’activité (obligatoire pour chaque événement)

Chaque événement ou activité du Centre donne lieu à un rapport public, quel que soit son format. Le rapport est la dernière étape du circuit (phase 6) et alimente le rapport annuel soumis à la tutelle.

**Contenu standard** : objectifs et public ciblé ; fréquentation (inscrits, présents) ; déroulé réalisé ; points forts ; difficultés rencontrées ; budget, recettes et partenaires mobilisés ; recommandations ; photos, vidéos et retombées médias ; avis du public.

**Statuts** : `prévu` (publié après l’événement) → `en préparation` → `publié` (avec PDF officiel).

**Mise en œuvre actuelle (site public)** : `js/reports-data.js` (une entrée par événement, clé = identifiant dans `js/events-data.js`), pages `rapports.html` (liste) et `rapport.html?id=...` (fiche). Les pages programmation, galerie, événement et actualités renvoient vers le rapport ; un événement terminé sans rapport affiche « Rapport en préparation » et le modèle attendu.

**Cible (Gestion interne)** : table `event_reports (event_id, statut, résumé, chiffres, objectifs, points_forts, difficultés, budget, perspectives, document_id, publié_par, publié_le)` liée à `events` et `internal_documents`, avec la permission `rapports.publish` (validation par la Direction Générale avant publication). À intégrer à la migration `0004`.

**Règle** : un événement ne passe à `archivé` qu’une fois son rapport publié.