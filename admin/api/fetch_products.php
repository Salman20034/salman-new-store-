
<?php
require_once '../../backend/config/db.php';

try {
    $stmt = $pdo->query("SELECT * FROM products ORDER BY created_at DESC");
    $products = $stmt->fetchAll();
    
    sendResponse('success', $products);
} catch (PDOException $e) {
    sendResponse('error', 'Database error: ' . $e->getMessage());
}
?>
