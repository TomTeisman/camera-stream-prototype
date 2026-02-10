<?php
header('Content-Type: application/json');

if (!isset($_FILES['photo'])) {
    echo json_encode(['success' => false, 'error' => 'No file']);
    exit;
}

$uploadDir = __DIR__ . '/../uploads/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

$tmpName = $_FILES['photo']['tmp_name'];
$mime = mime_content_type($tmpName);

if (!in_array($mime, ['image/jpeg', 'image/png'])) {
    echo json_encode(['success' => false, 'error' => 'Invalid file type']);
    exit;
}

$filename = 'photo.jpg';
$destination = $uploadDir . $filename;

if (!move_uploaded_file($tmpName, $destination)) {
    echo json_encode(['success' => false, 'error' => 'Save failed']);
    exit;
}

echo json_encode(['success' => 'true', 'filename' => $filename]);