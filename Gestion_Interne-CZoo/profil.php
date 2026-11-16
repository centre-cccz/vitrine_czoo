<?php

declare(strict_types=1);

require_once __DIR__ . '/includes/auth.php';
require_permission('profile.read');

$pageTitle = 'Profil du directeur';
$user = current_user();
require __DIR__ . '/includes/header.php';
?>
<div class="page-heading"><div><p class="eyebrow">Compte individuel</p><h1>Votre profil</h1><p class="muted">Informations de votre compte de gestion interne.</p></div></div>
<section class="profile-grid">
<article class="panel profile-card">
    <dl class="details-list">
        <div><dt>Nom</dt><dd><?= e($user['name']) ?></dd></div>
        <div><dt>Email</dt><dd><?= e($user['email']) ?></dd></div>
        <div><dt>Direction</dt><dd><?= e($user['direction_name']) ?></dd></div>
        <div><dt>Rôle</dt><dd><?= e(implode(', ', $_SESSION['internal_roles'] ?? [])) ?></dd></div>
        <div><dt>Statut</dt><dd>Actif</dd></div>
        <div><dt>Dernière connexion</dt><dd><?= e($user['last_login_at'] ?? 'Première connexion') ?></dd></div>
    </dl>
    <p class="muted">La modification du rôle, de la direction et des permissions est réservée à l’administration autorisée.</p>
</article>
<article class="panel">
    <p class="eyebrow">Accès</p>
    <h2>Compte sécurisé</h2>
    <p class="muted">Votre accès est protégé par une session privée et des permissions attribuées par rôle.</p>
    <a class="button" href="<?= e(internal_url('logout.php')) ?>">Se déconnecter</a>
</article>
</section>
<?php require __DIR__ . '/includes/footer.php'; ?>
