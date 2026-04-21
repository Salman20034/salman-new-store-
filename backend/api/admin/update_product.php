<?php
// backend/api/admin/update_product.php
require_once '../../config/db.php';
checkAdmin();

// Handle both JSON and Multipart/Form-Data
if (strpos($_SERVER['CONTENT_TYPE'] ?? '', 'application/json') !== false) {
    $data = json_decode(file_get_contents('php://input'), true);
} else {
    $data = $_POST;
}

if (!$data || !isset($data['id'])) {
    sendResponse('error', 'Product ID is required');
}

$imagePath = $data['image'] ?? null;

// Handle File Upload
if (isset($_FILES['image_file']) && $_FILES['image_file']['error'] === UPLOAD_ERR_OK) {
    $fileTmpPath = $_FILES['image_file']['tmp_name'];
    $fileName = $_FILES['image_file']['name'];
    $fileSize = $_FILES['image_file']['size'];
    $fileType = $_FILES['image_file']['type'];
    $fileNameCmps = explode(".", $fileName);
    $fileExtension = strtolower(end($fileNameCmps));

    // Sanitize file name
    $newFileName = md5(time() . $fileName) . '.' . $fileExtension;
    $uploadFileDir = '../../uploads/';
    $dest_path = $uploadFileDir . $newFileName;

    if(move_uploaded_file($fileTmpPath, $dest_path)) {
        $imagePath = 'backend/uploads/' . $newFileName;
    }
}

try {
    $stmt = $pdo->prepare("UPDATE products SET name = ?, nameMl = ?, description = ?, price = ?, originalPrice = ?, image = ?, category = ?, stockQuantity = ?, unit = ?, inStock = ?, isLocal = ? WHERE id = ?");
    $stmt->execute([
        $data['name'],
        isset($data['nameMl']) ? $data['nameMl'] : null,
        isset($data['description']) ? $data['description'] : null,
        $data['price'],
        isset($data['originalPrice']) && $data['originalPrice'] !== '' ? $data['originalPrice'] : null,
        $imagePath,
        isset($data['category']) ? $data['category'] : null,
        isset($data['stockQuantity']) ? $data['stockQuantity'] : 0,
        isset($data['unit']) ? $data['unit'] : null,
        isset($data['inStock']) ? (int)$data['inStock'] : 1,
        isset($data['isLocal']) ? (int)$data['isLocal'] : 0,
        $data['id']
    ]);
    
    sendResponse('success', 'Product updated successfully');
} catch (PDOException $e) {
    sendResponse('error', 'Failed to update product: ' . $e->getMessage());
}
?>
