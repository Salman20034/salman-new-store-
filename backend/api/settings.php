<?php
// backend/api/settings.php
require_once '../config/db.php';

try {
    $stmt = $pdo->query("SELECT * FROM store_settings WHERE id = 1");
    $settings = $stmt->fetch();
    
    if (!$settings) {
        sendResponse('error', 'Settings not found');
    }
    
    // Cast types
    $settings['delivery_charge'] = (float)$settings['delivery_charge'];
    $settings['min_order_amount'] = (float)$settings['min_order_amount'];
    
    sendResponse('success', $settings);
} catch (PDOException $e) {
    sendResponse('error', 'Failed to fetch settings: ' . $e->getMessage());
}
?>
