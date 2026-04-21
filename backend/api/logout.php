<?php
// backend/api/logout.php
require_once '../config/db.php';

session_unset();
session_destroy();

sendResponse('success', 'Logged out successfully');
?>
