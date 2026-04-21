<?php
// backend/api/orders.php
require_once '../config/db.php';

$user_id = isset($_GET['user_id']) ? $_GET['user_id'] : null;
checkUser($user_id);

if (!$user_id) {
    sendResponse('error', 'User ID is required');
}

try {
    $stmt = $pdo->prepare("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC");
    $stmt->execute([$user_id]);
    $orders = $stmt->fetchAll();

    foreach ($orders as &$order) {
        $stmtItems = $pdo->prepare("
            SELECT oi.*, p.name, p.image 
            FROM order_items oi 
            JOIN products p ON oi.product_id = p.id 
            WHERE oi.order_id = ?
        ");
        $stmtItems->execute([$order['id']]);
        $order['items'] = $stmtItems->fetchAll();
        $order['total'] = (float)$order['total'];
        
        foreach ($order['items'] as &$item) {
            $item['price'] = (float)$item['price'];
            $item['quantity'] = (int)$item['quantity'];
        }
    }

    sendResponse('success', $orders);
} catch (PDOException $e) {
    sendResponse('error', 'Failed to fetch orders: ' . $e->getMessage());
}
?>
