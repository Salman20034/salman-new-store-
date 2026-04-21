<?php
// admin/api/delete_product.php
require_once '../../backend/config/db.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['id'])) {
    sendResponse('error', 'Missing ID');
}

$id = $data['id'];

try {
    $stmt = $pdo->prepare("DELETE FROM products WHERE id = ?");
    $stmt->execute([$id]);
    
    sendResponse('success', 'Product deleted successfully');
} catch (PDOException $e) {
    sendResponse('error', 'Database error: ' . $e->getMessage());
}
?>
