<?php
// admin/api/edit_product.php
require_once '../../backend/config/db.php';

// Handle both JSON and Multipart/Form-Data
if (strpos($_SERVER['CONTENT_TYPE'] ?? '', 'application/json') !== false) {
    $data = json_decode(file_get_contents('php://input'), true);
} else {
    $data = $_POST;
}

if (!$data || !isset($data['id'])) {
    sendResponse('error', 'Missing ID');
}

$id = $data['id'];
$name = trim($data['name']);
$price = (float)$data['price'];
$category = $data['category'] ?? 'General';
$stockQuantity = isset($data['stockQuantity']) ? (int)$data['stockQuantity'] : 0;
$image = $data['image'] ?? '';

// Handle File Upload
if (isset($_FILES['image_file']) && $_FILES['image_file']['error'] === UPLOAD_ERR_OK) {
    $fileTmpPath = $_FILES['image_file']['tmp_name'];
    $fileName = $_FILES['image_file']['name'];
    $fileNameCmps = explode(".", $fileName);
    $fileExtension = strtolower(end($fileNameCmps));

    $newFileName = md5(time() . $fileName) . '.' . $fileExtension;
    $uploadFileDir = '../../backend/uploads/';
    
    if (!is_dir($uploadFileDir)) mkdir($uploadFileDir, 0777, true);
    
    $dest_path = $uploadFileDir . $newFileName;

    if(move_uploaded_file($fileTmpPath, $dest_path)) {
        $image = 'backend/uploads/' . $newFileName;
    }
}

try {
    $stmt = $pdo->prepare("UPDATE products SET name = ?, price = ?, category = ?, stockQuantity = ?, image = ? WHERE id = ?");
    $stmt->execute([$name, $price, $category, $stockQuantity, $image, $id]);
    
    sendResponse('success', 'Product updated successfully');
} catch (PDOException $e) {
    sendResponse('error', 'Database error: ' . $e->getMessage());
}
?>
