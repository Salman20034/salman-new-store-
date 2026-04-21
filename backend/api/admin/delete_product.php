<?php
// backend/api/admin/delete_product.php
require_once '../../config/db.php';
checkAdmin();

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || empty($data['id'])) {
    sendResponse('error', 'Product ID is required');
}

try {
    $stmt = $pdo->prepare("DELETE FROM products WHERE id = ?");
    $stmt->execute([$data['id']]);
    
    sendResponse('success', 'Product deleted successfully');
} catch (PDOException $e) {
    sendResponse('error', 'Failed to delete product: ' . $e->getMessage());
}
?>
