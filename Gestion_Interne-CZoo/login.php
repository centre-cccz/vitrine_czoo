<?php

declare(strict_types=1);

require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/functions.php';
start_internal_session();

if (current_user() !== null) {
    redirect_internal('dashboard.php');
}

$error = isset($_GET['expired']) ? 'Votre session a expiré. Veuillez vous reconnecter.' : null;
?><!doctype html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Connexion — Espace de gestion CCCZ</title>
    <link rel="stylesheet" href="<?= e(internal_url('assets/css/app.css')) ?>">
</head>
<body class="login-page">
<main class="login-shell">
    <section class="login-intro" aria-labelledby="institution-title">
        <img class="login-logo" src="/images/logos/CZoo_Profil.svg" alt="Centre culturel congolais Le Zoo" width="88" height="88">
        <p class="login-kicker">Espace professionnel sécurisé</p>
        <h1 id="institution-title">Centre Culturel Congolais <span>« Le Zoo »</span></h1>
        <p class="lead">Administration, coordination et gestion des activités du Centre.</p>
        <small class="login-technical">Gestion_Interne-CZOO</small>
    </section>
    <section class="login-panel" aria-labelledby="login-title">
        <div class="login-card">
            <img class="compact-logo" src="/images/logos/CZoo_Profil.svg" alt="" width="54" height="54">
            <p class="eyebrow">Accès institutionnel</p>
            <h2 id="login-title">Bienvenue</h2>
            <p class="muted">Connectez-vous avec vos identifiants professionnels.</p>
            <?php if ($error): ?><div class="flash error" role="alert"><strong>Session expirée</strong><br><?= e($error) ?></div><?php endif; ?>
            <?php if ($flash = consume_flash()): ?><div class="flash <?= e($flash['type']) ?>" role="alert"><?= e($flash['message']) ?></div><?php endif; ?>
            <form method="post" action="<?= e(internal_url('authenticate.php')) ?>">
                <input type="hidden" name="csrf_token" value="<?= e(csrf_token()) ?>">
                <div class="field">
                    <label class="field-label" for="email">Adresse e-mail professionnelle</label>
                    <input id="email" name="email" type="email" autocomplete="username" placeholder="nom@ccclezoo.cd" required>
                </div>
                <div class="field">
                    <label class="field-label" for="password">Mot de passe</label>
                    <div class="password-field">
                        <input id="password" name="password" type="password" autocomplete="current-password" required>
                        <button class="password-toggle" type="button" data-password-toggle aria-label="Afficher le mot de passe">Afficher</button>
                    </div>
                </div>
                <button class="button primary" type="submit" data-loading-text="Connexion en cours…">Se connecter</button>
            </form>
            <a class="back-link" href="/accueil.html">← Retour au portail public</a>
        </div>
    </section>
</main>
<script src="<?= e(internal_url('assets/js/app.js')) ?>" defer></script>
</body>
</html>
