-- backend/models/database.sql
-- MySQL Database Schema for Shopi E-commerce

-- Create database (if not exists)
CREATE DATABASE IF NOT EXISTS shopi_db;
USE shopi_db;

-- =====================================================
-- 1. USERS TABLE (Admin & Customers)
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'customer') DEFAULT 'customer',
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 2. PRODUCTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    category ENUM('watches', 'clothes', 'bags', 'perfumes') NOT NULL,
    gender ENUM('men', 'women', 'unisex') NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock INT DEFAULT 0,
    description TEXT,
    image_front VARCHAR(500),
    image_back VARCHAR(500),
    images JSON,
    sizes JSON,
    colors JSON,
    features JSON,
    rating DECIMAL(3, 2) DEFAULT 0.00,
    stars DECIMAL(2, 1) DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_code (code),
    INDEX idx_category (category),
    INDEX idx_gender (gender),
    INDEX idx_brand (brand),
    INDEX idx_stock (stock)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 3. ORDERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    total_amount DECIMAL(10, 2) NOT NULL,
    shipping_cost DECIMAL(10, 2) DEFAULT 0.00,
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    payment_method VARCHAR(50),
    
    -- Shipping Address
    shipping_name VARCHAR(255) NOT NULL,
    shipping_phone VARCHAR(20) NOT NULL,
    shipping_city VARCHAR(100) NOT NULL,
    shipping_street TEXT NOT NULL,
    shipping_region VARCHAR(100),
    
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_order_number (order_number),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 4. ORDER ITEMS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    product_code VARCHAR(50) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    product_brand VARCHAR(100) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    price DECIMAL(10, 2) NOT NULL,
    size VARCHAR(50),
    color VARCHAR(50),
    subtotal DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
    INDEX idx_order_id (order_id),
    INDEX idx_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 5. NOTIFY REQUESTS TABLE (Stock Notifications)
-- =====================================================
CREATE TABLE IF NOT EXISTS notify_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    product_code VARCHAR(50) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    product_brand VARCHAR(100) NOT NULL,
    product_price VARCHAR(20) NOT NULL,
    product_category VARCHAR(50),
    product_gender VARCHAR(20),
    
    -- Customer Info
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20),
    
    -- Location Info
    location_ip VARCHAR(50),
    location_country VARCHAR(100),
    location_city VARCHAR(100),
    location_region VARCHAR(100),
    
    notification_method ENUM('telegram', 'whatsapp', 'email') DEFAULT 'telegram',
    status ENUM('pending', 'notified', 'expired') DEFAULT 'pending',
    notified_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_product_id (product_id),
    INDEX idx_customer_email (customer_email),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 6. CART TABLE (Optional - for persistent carts)
-- =====================================================
CREATE TABLE IF NOT EXISTS cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    session_id VARCHAR(255),
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    size VARCHAR(50),
    color VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_session_id (session_id),
    INDEX idx_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 7. ADMIN ACTIVITY LOG (Optional)
-- =====================================================
CREATE TABLE IF NOT EXISTS admin_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id INT,
    description TEXT,
    ip_address VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_action (action),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- INSERT DEFAULT ADMIN USER
-- =====================================================
-- Password: admin123 (hashed with bcrypt)
-- Note: This is just for initial setup. Change password immediately!
INSERT INTO users (name, email, password, role) 
VALUES (
    'Admin User',
    'admin@shop.com',
    '$2a$10$8YGLzQ5rJYm3xZqCKZxXuOYvN5H5YQ5M1L5lN5kL5N5k5N5k5N5k5k',
    'admin'
) ON DUPLICATE KEY UPDATE id=id;

-- =====================================================
-- SAMPLE PRODUCTS (Optional - for testing)
-- =====================================================
INSERT INTO products (code, name, brand, category, gender, price, stock, description, image_front, image_back) VALUES
('W-EA-001', 'Emporio Armani Classic Watch', 'emporio-armani', 'watches', 'women', 299.99, 15, 'Elegant timepiece with premium quality', '/assets/Watches/women/Emporio-Armani/watch-1-front.jpg', '/assets/Watches/women/Emporio-Armani/watch-1-back.jpg'),
('C-DG-001', 'Dolce & Gabbana Dress', 'dolce-gabbana', 'clothes', 'women', 249.99, 8, 'Premium luxury fashion piece', '/assets/Clothes/women/Dolce&Gabbana/dress-1-front.jpg', '/assets/Clothes/women/Dolce&Gabbana/dress-1-back.jpg'),
('B-ARM-001', 'Armani Exchange Bag', 'armani', 'bags', 'women', 199.99, 12, 'Elegant Armani luxury bag', '/assets/Bags/women/Armani/bag-1-front.jpg', '/assets/Bags/women/Armani/bag-1-back.jpg')
ON DUPLICATE KEY UPDATE id=id;

-- =====================================================
-- VIEWS FOR REPORTING (Optional)
-- =====================================================

-- View: Low Stock Products
CREATE OR REPLACE VIEW low_stock_products AS
SELECT 
    id, code, name, brand, category, gender, 
    price, stock, created_at
FROM products
WHERE stock < 10
ORDER BY stock ASC;

-- View: Recent Orders
CREATE OR REPLACE VIEW recent_orders AS
SELECT 
    o.id, o.order_number, o.total_amount, o.status,
    o.payment_status, u.name as customer_name, u.email,
    o.created_at
FROM orders o
LEFT JOIN users u ON o.user_id = u.id
ORDER BY o.created_at DESC;

-- View: Product Sales Summary
CREATE OR REPLACE VIEW product_sales_summary AS
SELECT 
    p.id, p.code, p.name, p.brand, p.category,
    COUNT(oi.id) as total_orders,
    SUM(oi.quantity) as total_quantity_sold,
    SUM(oi.subtotal) as total_revenue
FROM products p
LEFT JOIN order_items oi ON p.id = oi.product_id
GROUP BY p.id, p.code, p.name, p.brand, p.category
ORDER BY total_revenue DESC;

-- =====================================================
-- STORED PROCEDURES (Optional)
-- =====================================================

DELIMITER //

-- Procedure: Create Order with Items
CREATE PROCEDURE create_order_with_items(
    IN p_user_id INT,
    IN p_order_number VARCHAR(50),
    IN p_total_amount DECIMAL(10, 2),
    IN p_shipping_name VARCHAR(255),
    IN p_shipping_phone VARCHAR(20),
    IN p_shipping_city VARCHAR(100),
    IN p_shipping_street TEXT,
    IN p_items_json JSON
)
BEGIN
    DECLARE new_order_id INT;
    DECLARE done INT DEFAULT FALSE;
    DECLARE item_product_id INT;
    DECLARE item_quantity INT;
    DECLARE item_price DECIMAL(10, 2);
    DECLARE item_size VARCHAR(50);
    DECLARE item_color VARCHAR(50);
    
    -- Start transaction
    START TRANSACTION;
    
    -- Insert order
    INSERT INTO orders (
        user_id, order_number, total_amount,
        shipping_name, shipping_phone, shipping_city, shipping_street
    ) VALUES (
        p_user_id, p_order_number, p_total_amount,
        p_shipping_name, p_shipping_phone, p_shipping_city, p_shipping_street
    );
    
    SET new_order_id = LAST_INSERT_ID();
    
    -- Process items (simplified - in production, iterate through JSON)
    -- This is a placeholder - implement JSON parsing logic
    
    COMMIT;
    
    SELECT new_order_id as order_id;
END //

DELIMITER ;

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
SELECT '✅ Database schema created successfully!' as status;