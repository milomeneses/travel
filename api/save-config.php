<?php
header('Content-Type: application/json; charset=utf-8');
$configFile = __DIR__ . '/../data/config.json';

$raw = file_get_contents('php://input');
if (!$raw) {
    http_response_code(400);
    echo json_encode(['error' => 'Empty payload']);
    exit;
}

$data = json_decode($raw, true);
if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON']);
    exit;
}

$encoded = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
if ($encoded === false) {
    http_response_code(400);
    echo json_encode(['error' => 'Unable to encode JSON']);
    exit;
}

file_put_contents($configFile, $encoded);

echo json_encode(['status' => 'ok']);
