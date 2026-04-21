<?php
// admin/api/bulk_delete.php
require_once '../../backend/config/db.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['ids']) || !is_array($data['ids'])) {
    sendResponse('error', 'Missing IDs list');
}

$ids = $data['ids'];

if (empty($ids)) {
    sendResponse('success', 'No products selected');
}

try {
    // Prepare placeholders for the IN clause
    $placeholders = str_repeat('?,', count($ids) - 1) . '?';
    $stmt = $pdo->prepare("DELETE FROM products WHERE id IN ($placeholders)");
    $stmt->execute($ids);
    
    sendResponse('success', count($ids) . ' products deleted successfully');
} catch (PDOException $e) {
    sendResponse('error', 'Database error: ' . $e->getMessage());
}
?>
