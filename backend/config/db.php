<?php
// backend/config/db.php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// CORS Headers
// For production, you might want to restrict this to your actual frontend URL
$allowed_origins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://your-app.vercel.app',
    'https://your-app.netlify.app'
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origin, $allowed_origins) || empty($origin)) {
    header("Access-Control-Allow-Origin: " . ($origin ?: "*"));
} else {
    // If you want to allow everything for now (easier for beginners):
    header("Access-Control-Allow-Origin: *");
}

header("Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE, PUT");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

session_start();

// Database Configuration
// CHANGE THESE FOR PRODUCTION (e.g., InfinityFree/000webhost credentials)
$host = 'localhost'; 
$db   = 'mk_store';
$user = 'root';
$pass = '';
$port = '3306'; // Standard MySQL port. Local might be 3307.
$charset = 'utf8mb4';

// Check if running on localhost to auto-switch settings
if ($_SERVER['REMOTE_ADDR'] == '127.0.0.1' || $_SERVER['REMOTE_ADDR'] == '::1') {
    $port = '3307'; // Your local XAMPP port
}

$dsn = "mysql:host=$host;port=$port;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
     $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
     header('Content-Type: application/json');
     echo json_encode(['status' => 'error', 'message' => 'Database connection failed: ' . $e->getMessage()]);
     exit;
}

// Helper function to return JSON response
function sendResponse($status, $dataOrMessage) {
    header('Content-Type: application/json');
    if ($status === 'success') {
        echo json_encode(['status' => 'success', 'data' => $dataOrMessage]);
    } else {
        echo json_encode(['status' => 'error', 'message' => $dataOrMessage]);
    }
    exit;
}

// Security Helper
function checkAdmin() {
    if (!isset($_SESSION['admin_id'])) {
        sendResponse('error', 'Unauthorized: Admin access required');
    }
}

function checkUser($requested_user_id) {
    if (!isset($_SESSION['user_id']) || $_SESSION['user_id'] != $requested_user_id) {
        sendResponse('error', 'Unauthorized: You can only access your own data');
    }
}
?>
