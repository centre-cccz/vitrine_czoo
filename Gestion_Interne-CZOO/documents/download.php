<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/includes/auth.php';

require_permission('documents.download');
$documentId = filter_var($_GET['id'] ?? null, FILTER_VALIDATE_INT);
if (!$documentId) {
    http_response_code(404);
    exit('Document introuvable.');
}

$db = Database::getInstance();
$statement = $db->getConnection()->prepare('SELECT * FROM internal_documents WHERE id = :id');
$statement->execute([':id' => $documentId]);
$document = $statement->fetch();
if (!$document) {
    http_response_code(404);
    exit('Document introuvable.');
}

$root = getenv('INTERNAL_DOCUMENTS_PATH');
if (!$root) {
    http_response_code(503);
    exit('Stockage documentaire non configuré.');
}
$rootPath = realpath($root);
$filePath = $rootPath ? realpath($rootPath . DIRECTORY_SEPARATOR . $document['storage_path']) : false;
$insideRoot = $rootPath && $filePath && strpos($filePath, $rootPath . DIRECTORY_SEPARATOR) === 0;
if (!$rootPath || !$filePath || !is_file($filePath) || !$insideRoot) {
    http_response_code(404);
    exit('Document introuvable.');
}

$user = current_user();
$db->recordAudit((int) $user['id'], $user['direction_name'], 'DOWNLOAD', 'document', (string) $documentId, 'success');
header('Content-Type: ' . $document['mime_type']);
header('Content-Disposition: attachment; filename="' . rawurlencode($document['title']) . '"');
header('X-Content-Type-Options: nosniff');
readfile($filePath);
