<?php
// backend/api/admin/update_settings.php
require_once '../../config/db.php';
checkAdmin();

$store_name = $_POST['store_name'] ?? '';
$contact_phone = $_POST['contact_phone'] ?? '';
$contact_email = $_POST['contact_email'] ?? '';
$delivery_charge = $_POST['delivery_charge'] ?? 0;
$min_order_amount = $_POST['min_order_amount'] ?? 0;

try {
    $logo_path = null;
    
    // Handle logo upload
    if (isset($_FILES['logo']) && $_FILES['logo']['error'] === UPLOAD_ERR_OK) {
        $upload_dir = '../../uploads/';
        $file_extension = pathinfo($_FILES['logo']['name'], PATHINFO_EXTENSION);
        $file_name = 'logo_' . time() . '.' . $file_extension;
        $target_file = $upload_dir . $file_name;
        
        if (move_uploaded_file($_FILES['logo']['tmp_name'], $target_file)) {
            $logo_path = 'backend/uploads/' . $file_name;
        }
    }

    $sql = "UPDATE store_settings SET 
            store_name = ?, 
            contact_phone = ?, 
            contact_email = ?, 
            delivery_charge = ?, 
            min_order_amount = ?";
    
    $params = [$store_name, $contact_phone, $contact_email, $delivery_charge, $min_order_amount];

    if ($logo_path) {
        $sql .= ", store_logo = ?";
        $params[] = $logo_path;
    }

    $sql .= " WHERE id = 1";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    sendResponse('success', 'Settings updated successfully');
} catch (PDOException $e) {
    sendResponse('error', 'Failed to update settings: ' . $e->getMessage());
}
?>
