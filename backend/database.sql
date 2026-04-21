-- MK Store Database Schema

CREATE DATABASE IF NOT EXISTS mk_store;
USE mk_store;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    nameMl VARCHAR(255),
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    originalPrice DECIMAL(10, 2),
    image VARCHAR(255),
    category VARCHAR(100),
    stockQuantity INT DEFAULT 0,
    unit VARCHAR(50),
    inStock BOOLEAN DEFAULT TRUE,
    isLocal BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cart table
CREATE TABLE IF NOT EXISTS cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id VARCHAR(50) NOT NULL,
    quantity INT DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    status ENUM('Pending', 'Processing', 'Delivered', 'Cancelled') DEFAULT 'Pending',
    customerName VARCHAR(255),
    customerPhone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Order Items table
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id VARCHAR(50) NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Admin table (Simple admin auth)
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample admin
INSERT IGNORE INTO admins (username, password) VALUES ('salman', '$2y$10$68wJJHhBuJsAugPxlvCmneLR9yI7tTFurYS5IU3/WKe51HYWk4WO6'); -- password: salman123

-- Insert sample products
INSERT IGNORE INTO products (id, name, nameMl, description, price, originalPrice, image, category, stockQuantity, unit, inStock, isLocal) VALUES
('prod-1', 'Fresh Apple 1', 'ആപ്പിൾ', 'High quality fresh apple sourced directly for MK Store.', 120.00, 144.00, 'https://picsum.photos/seed/Apple0/400/400', 'Fruits & Vegetables', 100, '1 kg', 1, 1),
('prod-2', 'Organic Banana 2', 'പഴം', 'High quality organic banana sourced directly for MK Store.', 60.00, NULL, 'https://picsum.photos/seed/Banana1/400/400', 'Fruits & Vegetables', 150, '1 kg', 1, 0),
('prod-3', 'Premium Milk 3', 'പാൽ', 'High quality premium milk sourced directly for MK Store.', 25.00, 30.00, 'https://picsum.photos/seed/Milk2/400/400', 'Dairy Products', 200, '500 ml', 1, 1),
('prod-4', 'Local Bread 4', 'ബ്രെഡ്', 'High quality local bread sourced directly for MK Store.', 40.00, NULL, 'https://picsum.photos/seed/Bread3/400/400', 'Snacks', 50, '1 pack', 1, 0),
('prod-5', 'Farm Matta Rice 5', 'മട്ട അരി', 'High quality farm matta rice sourced directly for MK Store.', 200.00, 240.00, 'https://picsum.photos/seed/MattaRice4/400/400', 'Rice & Grains', 80, '5 kg', 1, 1);

-- Store Settings table
CREATE TABLE IF NOT EXISTS store_settings (
    id INT PRIMARY KEY DEFAULT 1,
    store_name VARCHAR(255) DEFAULT 'MK Store',
    contact_phone VARCHAR(20) DEFAULT '7594900823',
    contact_email VARCHAR(255) DEFAULT 'support@mkstore.in',
    store_logo VARCHAR(255),
    delivery_charge DECIMAL(10, 2) DEFAULT 0.00,
    min_order_amount DECIMAL(10, 2) DEFAULT 0.00
);

INSERT IGNORE INTO store_settings (id, store_name, contact_phone, contact_email) VALUES (1, 'MK Store', '7594900823', 'support@mkstore.in');
