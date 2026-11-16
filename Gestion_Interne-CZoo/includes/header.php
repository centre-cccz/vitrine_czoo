<?php

declare(strict_types=1);

require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/permissions.php';
start_internal_session();
$pageTitle = $pageTitle ?? 'Gestion_Interne-CZOO';
$user = current_user();
$flashMessage = consume_flash();
?><!doctype html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?= e($pageTitle) ?> — Gestion_Interne-CZOO</title>
    <link rel="stylesheet" href="<?= e(internal_url('assets/css/app.css')) ?>">
</head>
<body>
<header class="app-header">
    <button class="menu-toggle" type="button" data-menu-toggle aria-expanded="false" aria-controls="internal-navigation">Menu</button>
    <a class="brand" href="<?= e(internal_url('dashboard.php')) ?>">
        <img src="/images/logos/CZoo_Profil.svg" alt="" width="42" height="42">
        <span class="brand-copy"><span>CCCZ</span><small>Gestion interne</small></span>
    </a>
    <div class="header-user">
        <span class="avatar" aria-hidden="true"><?= e(strtoupper(substr((string) ($user['name'] ?? 'C'), 0, 1))) ?></span>
        <span class="user-summary"><strong><?= e($user['name'] ?? '') ?></strong><small><?= e($user['direction_name'] ?? '') ?> · <?= e(implode(', ', $_SESSION['internal_roles'] ?? [])) ?></small></span>
        <a href="<?= e(internal_url('profil.php')) ?>">Profil</a>
        <a href="<?= e(internal_url('logout.php')) ?>">Déconnexion</a>
    </div>
</header>
<div class="app-layout">
<aside class="sidebar" id="internal-navigation" aria-label="Navigation interne">
    <div class="sidebar-heading">Espace professionnel</div>
    <a href="<?= e(internal_url('dashboard.php')) ?>"<?= $pageTitle === 'Tableau de bord' ? ' aria-current="page"' : '' ?>>Tableau de bord</a>
    <?php
    $navigationGroups = [
        'Administration' => ['administration'],
        'Organisation' => ['personnel'],
        'Activités' => ['activites', 'projets', 'espaces'],
        'Culture' => ['culture-arts', 'bibliotheque', 'patrimoine'],
        'Ressources' => ['finances', 'intendance', 'documents'],
        'Relations' => ['partenaires'],
        'Rapports' => ['rapports'],
    ];
    foreach ($navigationGroups as $groupLabel => $modules):
        $availableModules = array_filter($modules, static fn (string $module): bool => has_permission(module_permission($module)));
        if (!$availableModules) continue;
    ?>
        <div class="sidebar-group">
            <div class="sidebar-group-title"><?= e($groupLabel) ?></div>
            <?php foreach ($availableModules as $module): ?>
                <a href="<?= e(internal_url($module . '/index.php')) ?>"<?= $pageTitle === module_label($module) ? ' aria-current="page"' : '' ?>><?= e(module_label($module)) ?></a>
            <?php endforeach; ?>
        </div>
    <?php endforeach; ?>
</aside>
<button class="nav-overlay" type="button" aria-label="Fermer le menu"></button>
<main class="app-main">
<nav class="breadcrumb" aria-label="Fil d’Ariane">
    <a href="<?= e(internal_url('dashboard.php')) ?>">CCCZ</a>
    <span aria-hidden="true">/</span>
    <span><?= e($pageTitle) ?></span>
</nav>
<?php if ($flashMessage): ?>
    <div class="flash <?= e($flashMessage['type']) ?>" role="status"><?= e($flashMessage['message']) ?></div>
<?php endif; ?>
