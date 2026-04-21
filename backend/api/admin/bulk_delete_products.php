<?php
// backend/api/admin/bulk_delete_products.php
require_once '../../config/db.php';
checkAdmin();

$data = json_decode(file_get_contents('php://input'), true);
$ids = isset($data['ids']) ? $data['ids'] : [];

if (empty($ids)) {
    sendResponse('error', 'No product IDs provided');
}

try {
    $placeholders = str_repeat('?,', count($ids) - 1) . '?';
    $stmt = $pdo->prepare("DELETE FROM products WHERE id IN ($placeholders)");
    $stmt->execute($ids);
    
    sendResponse('success', 'Products deleted successfully');
} catch (PDOException $e) {
    sendResponse('error', 'Database error: ' . $e->getMessage());
}
?>
