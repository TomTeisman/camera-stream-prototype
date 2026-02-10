<?php

$filePath = __DIR__ . '/../uploads/photo.jpg';
if(!file_exists($filePath)) {
    echo json_encode(['error' => 'No file exists']);
    exit;
}

unlink($filePath);
