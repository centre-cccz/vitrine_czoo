<?php

declare(strict_types=1);

require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/permissions.php';
require_permission('dashboard.read');

$pageTitle = 'Tableau de bord';
$user = current_user();
$db = Database::getInstance();
$contactCount = (int) $db->getConnection()->query('SELECT COUNT(*) FROM contact_requests')->fetchColumn();
$pageItems = [];
foreach (['activites', 'projets', 'documents'] as $module) {
    if (has_permission(module_permission($module))) {
        $pageItems[$module] = $db->listItems($module, 5);
    }
}
require __DIR__ . '/includes/header.php';
?>
<div class="page-heading">
    <div>
        <p class="eyebrow">Pilotage institutionnel</p>
        <h1>Bonjour <?= e($user['name']) ?></h1>
        <p class="muted"><?= e($user['direction_name']) ?> · <?= e(implode(', ', $_SESSION['internal_roles'] ?? [])) ?></p>
    </div>
</div>
<section class="stats-grid" aria-label="Indicateurs">
    <article class="stat-card stat-card-accent"><span>Demandes de contact</span><strong><?= $contactCount ?></strong><small>Données publiques reçues</small></article>
    <article class="stat-card"><span>Permissions actives</span><strong><?= count($_SESSION['internal_permissions'] ?? []) ?></strong><small>Selon votre rôle</small></article>
    <article class="stat-card"><span>Session</span><strong>Active</strong><small>Expiration après 30 minutes</small></article>
</section>
<?php $accessibleModules = array_filter(['administration', 'personnel', 'finances', 'intendance', 'bibliotheque', 'culture-arts', 'activites', 'projets', 'espaces', 'patrimoine', 'partenaires', 'documents', 'rapports'], static fn (string $module): bool => has_permission(module_permission($module))); ?>
<section class="panel">
    <div class="panel-heading"><div><h2>Vos espaces de travail</h2><p class="table-caption">Accès disponibles selon vos permissions.</p></div><span class="badge"><?= count($accessibleModules) ?></span></div>
    <?php if (!$accessibleModules): ?><div class="empty-state"><p class="muted">Aucun module métier n'est disponible pour votre compte.</p></div><?php else: ?>
        <div class="shortcut-grid"><?php foreach ($accessibleModules as $module): ?><a class="shortcut" href="<?= e(internal_url($module . '/index.php')) ?>"><strong><?= e(module_label($module)) ?></strong><small>Ouvrir l'espace</small></a><?php endforeach; ?></div>
    <?php endif; ?>
</section>
<section class="content-grid">
    <article class="panel">
        <h2>À traiter</h2>
        <p class="muted">Aucune tâche interne n’a été inventée. Les éléments apparaîtront après leur création dans les modules autorisés.</p>
    </article>
    <article class="panel">
        <h2>Activités récentes</h2>
        <?php $recentItems = array_merge(...array_values($pageItems ?: [[]])); ?>
        <?php if (!$recentItems): ?><div class="empty-state"><p class="muted">Aucune activité enregistrée.</p></div><?php else: ?>
            <ul class="activity-list"><?php foreach (array_slice($recentItems, 0, 5) as $item): ?><li><strong><?= e($item['title']) ?></strong><span><?= e($item['module']) ?> · <?= e($item['status']) ?></span></li><?php endforeach; ?></ul>
        <?php endif; ?>
    </article>
</section>
<?php require __DIR__ . '/includes/footer.php'; ?>
