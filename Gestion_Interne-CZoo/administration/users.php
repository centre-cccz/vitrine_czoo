<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/includes/auth.php';

require_permission('admin.users');
$db = Database::getInstance()->getConnection();
$current = current_user();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    verify_csrf();
    $name = trim((string) ($_POST['name'] ?? ''));
    $email = filter_var(trim((string) ($_POST['email'] ?? '')), FILTER_VALIDATE_EMAIL);
    $password = (string) ($_POST['password'] ?? '');
    $directionId = filter_var($_POST['direction_id'] ?? null, FILTER_VALIDATE_INT);
    if ($name === '' || !$email || strlen($password) < 12 || !$directionId) {
        flash('error', 'Nom, email, direction et mot de passe de 12 caractères minimum sont requis.');
        redirect_internal('administration/users.php');
    }
    $statement = $db->prepare('INSERT INTO users (direction_id, name, email, password_hash) VALUES (:direction_id, :name, :email, :password_hash)');
    $statement->execute([
        ':direction_id' => $directionId,
        ':name' => $name,
        ':email' => $email,
        ':password_hash' => password_hash($password, PASSWORD_DEFAULT),
    ]);
    $userId = (int) $db->lastInsertId();
    $roleId = $db->query("SELECT id FROM roles WHERE name = 'directeur'")->fetchColumn();
    $roleStatement = $db->prepare('INSERT INTO user_roles (user_id, role_id) VALUES (:user_id, :role_id)');
    $roleStatement->execute([':user_id' => $userId, ':role_id' => $roleId]);
    Database::getInstance()->recordAudit((int) $current['id'], $current['direction_name'], 'CREATE', 'user', (string) $userId, 'success');
    flash('success', 'Compte directeur créé.');
    redirect_internal('administration/users.php');
}

$directions = $db->query('SELECT id, name FROM directions ORDER BY name')->fetchAll();
$users = $db->query('SELECT u.id, u.name, u.email, u.is_active, d.name AS direction_name FROM users u JOIN directions d ON d.id = u.direction_id ORDER BY u.name')->fetchAll();
$pageTitle = 'Administration des comptes';
require __DIR__ . '/../includes/header.php';
?>
<div class="page-heading"><div><p class="eyebrow">Administration</p><h1>Comptes directeurs</h1><p class="muted">Aucune inscription publique. Les comptes sont créés par une permission d’administration.</p></div></div>
<section class="panel">
    <div class="panel-heading"><div><h2>Comptes existants</h2><p class="table-caption">Comptes autorisés à accéder à la gestion interne.</p></div><span class="badge"><?= count($users) ?></span></div>
    <?php if (!$users): ?><div class="empty-state"><p class="muted">Aucun compte directeur enregistré.</p></div><?php else: ?><div class="table-wrap"><table><thead><tr><th>Nom</th><th>Email</th><th>Direction</th><th>Statut</th></tr></thead><tbody>
    <?php foreach ($users as $item): ?><tr><td><strong><?= e($item['name']) ?></strong></td><td><?= e($item['email']) ?></td><td><?= e($item['direction_name']) ?></td><td><span class="status-badge"><?= (bool) $item['is_active'] ? 'Actif' : 'Désactivé' ?></span></td></tr><?php endforeach; ?>
    </tbody></table></div>
    <?php endif; ?>
</section>
<section class="panel">
    <h2>Créer un compte directeur</h2>
    <p class="table-caption">Un mot de passe temporaire d'au moins 12 caractères est requis.</p>
    <form method="post" class="form-grid">
        <input type="hidden" name="csrf_token" value="<?= e(csrf_token()) ?>">
        <label for="user-name">Nom <input id="user-name" name="name" maxlength="160" required></label>
        <label for="user-email">Email <input id="user-email" name="email" type="email" autocomplete="off" required></label>
        <label for="user-password">Mot de passe temporaire <input id="user-password" name="password" type="password" minlength="12" autocomplete="new-password" required></label>
        <label for="user-direction">Direction <select id="user-direction" name="direction_id" required><option value="">Sélectionner</option><?php foreach ($directions as $direction): ?><option value="<?= (int) $direction['id'] ?>"><?= e($direction['name']) ?></option><?php endforeach; ?></select></label>
        <div class="form-actions"><button class="button primary" type="submit">Créer le compte</button></div>
    </form>
</section>
<?php require __DIR__ . '/../includes/footer.php'; ?>
