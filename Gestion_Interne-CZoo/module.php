<?php

declare(strict_types=1);

require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/permissions.php';

$module = $module ?? '';
if ($module === '' || !preg_match('/^[a-z0-9-]+$/', $module)) {
    http_response_code(404);
    exit('Module introuvable.');
}
require_permission(module_permission($module));

$db = Database::getInstance();
$user = current_user();
$createPermission = $module . '.create';
$canCreate = has_permission($createPermission);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!$canCreate) {
        http_response_code(403);
        exit('Création non autorisée.');
    }
    verify_csrf();
    $title = trim((string) ($_POST['title'] ?? ''));
    $description = trim((string) ($_POST['description'] ?? ''));
    if ($title === '' || strlen($title) > 255) {
        flash('error', 'Le titre est obligatoire et doit rester court.');
        redirect_internal($module . '/index.php');
    }
    $id = $db->createItem($module, $title, $description, (int) $user['id']);
    $db->recordAudit((int) $user['id'], $user['direction_name'], 'CREATE', $module, (string) $id, 'success');
    flash('success', 'Élément créé.');
    redirect_internal($module . '/index.php');
}

$items = $db->listItems($module);
$pageTitle = module_label($module);
require __DIR__ . '/includes/header.php';
?>
<div class="page-heading">
    <div><p class="eyebrow">Gestion métier</p><h1><?= e(module_label($module)) ?></h1><p class="muted">Données internes accessibles selon votre direction et vos permissions.</p></div>
    <?php if ($canCreate): ?><div class="page-heading-actions"><a class="button primary" href="#create-item">+ Ajouter</a></div><?php endif; ?>
</div>
<section class="panel">
    <div class="panel-heading"><div><h2>Éléments enregistrés</h2><p class="table-caption">Contenu accessible dans votre périmètre.</p></div><span class="badge"><?= count($items) ?></span></div>
    <?php if (!$items): ?><div class="empty-state"><p class="muted">Aucun élément enregistré. Aucune donnée fictive n’est affichée.</p></div><?php else: ?>
        <div class="table-wrap"><table><thead><tr><th>Titre</th><th>Statut</th><th>Créé par</th><th>Mis à jour</th></tr></thead><tbody>
        <?php foreach ($items as $item): ?><tr><td><strong><?= e($item['title']) ?></strong><br><small><?= e($item['description']) ?></small></td><td><span class="status-badge"><?= e($item['status']) ?></span></td><td><?= e($item['creator_name']) ?></td><td><?= e($item['updated_at']) ?></td></tr><?php endforeach; ?>
        </tbody></table></div>
    <?php endif; ?>
</section>
<?php if ($module === 'administration' && has_permission('admin.users')): ?>
<p><a class="button" href="<?= e(internal_url('administration/users.php')) ?>">Gérer les comptes directeurs</a></p>
<?php endif; ?>
<?php if ($canCreate): ?>
<section class="panel" id="create-item">
    <h2>Créer un élément</h2>
    <p class="table-caption">Les champs marqués sont enregistrés dans le module <?= e(module_label($module)) ?>.</p>
    <form method="post" class="form-grid">
        <input type="hidden" name="csrf_token" value="<?= e(csrf_token()) ?>">
        <label for="item-title">Titre <input id="item-title" name="title" maxlength="255" required></label>
        <label for="item-description">Description <textarea id="item-description" name="description" rows="4"></textarea></label>
        <div class="form-actions"><button class="button primary" type="submit">Enregistrer</button></div>
    </form>
</section>
<?php endif; ?>
<?php require __DIR__ . '/includes/footer.php'; ?>
