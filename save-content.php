<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

const ADMIN_PASSWORD_HASH = 'aca60048d584b59951f1b8d37ac5b727b1a975b4a061c6c0b6f6327612846e51';

$input = file_get_contents('php://input');
if ($input === false) {
  http_response_code(400);
  echo json_encode(['message' => 'Invalid payload.']);
  exit;
}

$payload = json_decode($input, true);
if (!is_array($payload)) {
  http_response_code(400);
  echo json_encode(['message' => 'Invalid JSON.']);
  exit;
}

$passwordHash = $payload['passwordHash'] ?? '';
if (!hash_equals(ADMIN_PASSWORD_HASH, $passwordHash)) {
  http_response_code(401);
  echo json_encode(['message' => 'Unauthorized.']);
  exit;
}

$locale = $payload['locale'] ?? '';
if (!in_array($locale, ['en', 'es'], true)) {
  http_response_code(400);
  echo json_encode(['message' => 'Invalid locale.']);
  exit;
}

$content = $payload['content'] ?? null;
if (!is_array($content)) {
  http_response_code(400);
  echo json_encode(['message' => 'Missing content.']);
  exit;
}

$requiredHeroFields = ['title', 'subtitle', 'primaryCta'];
foreach ($requiredHeroFields as $field) {
  if (empty($content['hero'][$field])) {
    http_response_code(400);
    echo json_encode(['message' => 'Hero fields are required.']);
    exit;
  }
}

if (!isset($content['chaptersList']) || count($content['chaptersList']) !== 5) {
  http_response_code(400);
  echo json_encode(['message' => 'Chapters list must contain 5 items.']);
  exit;
}

if (!isset($content['thingsList']) || !is_array($content['thingsList'])) {
  http_response_code(400);
  echo json_encode(['message' => 'Things list is required.']);
  exit;
}

$forbiddenPattern = '/romance|rum master/i';
foreach ($content['thingsList'] as $item) {
  if (!is_array($item) || empty($item['title'])) {
    http_response_code(400);
    echo json_encode(['message' => 'Each Thing must have a title.']);
    exit;
  }
  if (preg_match($forbiddenPattern, $item['title'])) {
    http_response_code(400);
    echo json_encode(['message' => 'Romance and Rum Master are not allowed.']);
    exit;
  }
}

$navFields = ['things', 'how', 'howLink', 'plan', 'planLink', 'eta', 'etaLink'];
foreach ($navFields as $field) {
  if (empty($content['nav'][$field])) {
    http_response_code(400);
    echo json_encode(['message' => 'Menu fields are required.']);
    exit;
  }
}

$dataDir = __DIR__ . '/data';
if (!is_dir($dataDir) && !mkdir($dataDir, 0755, true) && !is_dir($dataDir)) {
  http_response_code(500);
  echo json_encode(['message' => 'Failed to create data directory.']);
  exit;
}
$backupDir = $dataDir . '/backups';
if (!is_dir($backupDir) && !mkdir($backupDir, 0755, true) && !is_dir($backupDir)) {
  http_response_code(500);
  echo json_encode(['message' => 'Failed to create backup directory.']);
  exit;
}

$targetFile = sprintf('%s/%s.json', $dataDir, $locale);
if (file_exists($targetFile)) {
  $timestamp = date('Ymd-His');
  $backupFile = sprintf('%s/%s-%s.json', $backupDir, $locale, $timestamp);
  if (!copy($targetFile, $backupFile)) {
    http_response_code(500);
    echo json_encode(['message' => 'Failed to create backup.']);
    exit;
  }
}

$encoded = json_encode($content, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
if ($encoded === false) {
  http_response_code(500);
  echo json_encode(['message' => 'Failed to encode JSON.']);
  exit;
}

$tempFile = $targetFile . '.tmp';
if (file_put_contents($tempFile, $encoded, LOCK_EX) === false) {
  http_response_code(500);
  echo json_encode(['message' => 'Failed to write content.']);
  exit;
}

if (!rename($tempFile, $targetFile)) {
  http_response_code(500);
  echo json_encode(['message' => 'Failed to finalize content.']);
  exit;
}

echo json_encode(['message' => 'Saved', 'locale' => $locale]);
