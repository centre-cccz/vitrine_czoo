<?php

declare(strict_types=1);

require_once dirname(__DIR__, 2) . '/Gestion_Interne-CZoo/includes/auth.php';

header('Content-Type: application/json; charset=utf-8');
start_internal_session();

if (current_user() === null) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => ['code' => 'unauthenticated', 'message' => 'Authentification requise']]);
    exit;
}
if (!has_permission('finances.read')) {
    http_response_code(403);
    echo json_encode(['success' => false, 'error' => ['code' => 'forbidden', 'message' => 'Permission insuffisante']]);
    exit;
}

try {
    $items = Database::getInstance()->listItems('finances');
    echo json_encode(['success' => true, 'data' => $items, 'message' => 'Éléments financiers'], JSON_THROW_ON_ERROR);
} catch (Throwable $exception) {
    error_log('Finance API failure: ' . $exception->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => ['code' => 'server_error', 'message' => 'Erreur interne']]);
}
