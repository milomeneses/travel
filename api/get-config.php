<?php
header('Content-Type: application/json; charset=utf-8');
$configFile = __DIR__ . '/../data/config.json';

if (!file_exists($configFile)) {
    http_response_code(404);
    echo json_encode(['error' => 'Config not found']);
    exit;
}

echo file_get_contents($configFile);
