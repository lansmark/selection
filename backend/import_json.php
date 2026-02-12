<?php
/**
 * JSON to MySQL Import Script for Shopi E-commerce
 * Save this file in: backend/import_json.php
 * 
 * IMPROVED VERSION with:
 * - Fixed processJsonField to handle scalars correctly
 * - Proper error handling and variable initialization
 * - SQL injection prevention with whitelist validation
 * - Query failure checks
 * - Transaction support for data integrity
 */

// =====================================================
// DATABASE CONFIGURATION
// =====================================================
$db_config = [
    'host' => 'localhost',
    'username' => 'root',
    'password' => '',
    'database' => 'shopi_db'
];

// =====================================================
// JSON FILES CONFIGURATION
// Path is relative to backend folder
// =====================================================
$json_files = [
    // Watches
    ['file' => '../front/src/assets/data/watches-data-men.json', 'category' => 'watches', 'gender' => 'men'],
    ['file' => '../front/src/assets/data/watches-data-women.json', 'category' => 'watches', 'gender' => 'women'],
    
    // Clothes
    ['file' => '../front/src/assets/data/clothes-data-men.json', 'category' => 'clothes', 'gender' => 'men'],
    ['file' => '../front/src/assets/data/clothes-data-women.json', 'category' => 'clothes', 'gender' => 'women'],
    
    // Bags
    ['file' => '../front/src/assets/data/bags-data-men.json', 'category' => 'bags', 'gender' => 'men'],
    ['file' => '../front/src/assets/data/bags-data-women.json', 'category' => 'bags', 'gender' => 'women'],
    
    // Perfumes
    ['file' => '../front/src/assets/data/perfumes-data-men.json', 'category' => 'perfumes', 'gender' => 'men'],
    ['file' => '../front/src/assets/data/perfumes-data-women.json', 'category' => 'perfumes', 'gender' => 'women'],
];

// =====================================================
// ALLOWED CATEGORIES (Whitelist for security)
// =====================================================
$ALLOWED_CATEGORIES = ['watches', 'clothes', 'bags', 'perfumes'];

// =====================================================
// CONNECT TO DATABASE
// =====================================================
try {
    $conn = new mysqli(
        $db_config['host'],
        $db_config['username'],
        $db_config['password'],
        $db_config['database']
    );
    
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }
    
    $conn->set_charset("utf8mb4");
    echo "✅ Database connected successfully\n\n";
    
} catch (Exception $e) {
    die("❌ Error: " . $e->getMessage() . "\n");
}

// =====================================================
// IMPORT STATISTICS
// =====================================================
$stats = [
    'total_files' => 0,
    'successful_imports' => 0,
    'failed_imports' => 0,
    'total_products' => 0,
    'by_category' => [
        'watches' => 0,
        'clothes' => 0,
        'bags' => 0,
        'perfumes' => 0
    ]
];

// =====================================================
// HELPER FUNCTION: GENERATE PRODUCT CODE
// =====================================================
function generateProductCode($category, $brand, $gender, $index) {
    $categoryCode = strtoupper(substr($category, 0, 1));
    $brandCode = strtoupper(substr(preg_replace('/[^a-z]/i', '', $brand), 0, 3));
    $genderCode = strtoupper(substr($gender, 0, 1));
    
    // Ensure index is an integer
    $indexNum = (int)$index;
    
    return sprintf("%s-%s-%s-%03d", $categoryCode, $brandCode, $genderCode, $indexNum);
}

// =====================================================
// HELPER FUNCTION: PREPARE SQL INSERT (WITH VALIDATION)
// =====================================================
function prepareInsertStatement($conn, $category) {
    global $ALLOWED_CATEGORIES;
    
    // Validate category against whitelist
    if (!in_array($category, $ALLOWED_CATEGORIES, true)) {
        throw new Exception("Invalid category/table name: " . $category);
    }
    
    $table = $category; // watches, clothes, bags, perfumes
    
    $sql = "INSERT INTO {$table} (
        code, name, brand, gender, price, stock, description,
        image_front, image_back, images, sizes, colors, features,
        rating, stars
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    $stmt = $conn->prepare($sql);
    
    if (!$stmt) {
        throw new Exception("Failed to prepare statement for {$category}: " . $conn->error);
    }
    
    return $stmt;
}

// =====================================================
// HELPER FUNCTION: PROCESS JSON FIELD (FIXED)
// =====================================================
function processJsonField($field) {
    // Return null only for explicit null
    if ($field === null) {
        return null;
    }
    
    // Encode arrays/objects to JSON
    if (is_array($field) || is_object($field)) {
        return json_encode($field, JSON_UNESCAPED_UNICODE);
    }
    
    // Return scalars as strings (no extra JSON quotes)
    return (string) $field;
}

// =====================================================
// MAIN IMPORT FUNCTION (WITH TRANSACTIONS)
// =====================================================
function importJsonFile($conn, $fileInfo, &$stats) {
    $filePath = $fileInfo['file'];
    $category = $fileInfo['category'];
    $gender = $fileInfo['gender'];
    
    echo "📁 Processing: {$filePath}\n";
    echo "   Category: {$category} | Gender: {$gender}\n";
    
    // Check if file exists
    if (!file_exists($filePath)) {
        echo "   ⚠️  File not found, skipping...\n\n";
        $stats['failed_imports']++;
        return;
    }
    
    // Read and decode JSON
    $jsonContent = file_get_contents($filePath);
    $jsonData = json_decode($jsonContent, true);
    
    if ($jsonData === null) {
        echo "   ❌ Invalid JSON format: " . json_last_error_msg() . "\n\n";
        $stats['failed_imports']++;
        return;
    }
    
    // Extract products array from the wrapper object
    // Supports: data (generic key) or category_data (specific key)
    $products = null;
    $dataKey = $category . '_data';
    
    if (isset($jsonData['data'])) {
        // Generic "data" key
        $products = $jsonData['data'];
    } elseif (isset($jsonData[$dataKey])) {
        // Specific key like "watches_data", "bags_data", etc.
        $products = $jsonData[$dataKey];
    } elseif (is_array($jsonData) && isset($jsonData[0])) {
        // Fallback: if it's already an array
        $products = $jsonData;
    }
    
    if (empty($products)) {
        echo "   ⚠️  No products found in file (looking for 'data' or '{$dataKey}' key)\n\n";
        return;
    }
    
    // Prepare statement
    try {
        $stmt = prepareInsertStatement($conn, $category);
    } catch (Exception $e) {
        echo "   ❌ " . $e->getMessage() . "\n\n";
        $stats['failed_imports']++;
        return;
    }
    
    // Start transaction for this file
    $conn->begin_transaction();
    
    $imported = 0;
    $skipped = 0;
    $hasError = false;
    
    // Import each product
    foreach ($products as $index => $product) {
        // Initialize name BEFORE try block (for catch block access)
        $name = $product['name'] ?? 'Unnamed Product';
        
        try {
            // Generate code if not exists, or make existing code unique by gender
            if (isset($product['code']) && !empty($product['code'])) {
                $originalCode = $product['code'];
                $genderMarker = strtoupper(substr($gender, 0, 1));
                
                // Check if code already has gender marker (-M-, -W-, -U-)
                if (strpos($originalCode, '-M-') === false && 
                    strpos($originalCode, '-W-') === false && 
                    strpos($originalCode, '-U-') === false) {
                    
                    // Simply append gender marker at the end
                    // W-EMP-001 becomes W-EMP-001-M or W-EMP-001-W
                    $code = $originalCode . '-' . $genderMarker;
                } else {
                    $code = $originalCode;
                }
            } else {
                $code = generateProductCode($category, $product['brand'] ?? 'UNKNOWN', $gender, (int)$index + 1);
            }
            
            // Prepare data
            $brand = $product['brand'] ?? 'Unknown';
            $price = isset($product['price']) ? floatval(preg_replace('/[^0-9.]/', '', $product['price'])) : 0.00;
            $stock = isset($product['stock']) ? intval($product['stock']) : 0;
            $description = $product['about'] ?? $product['description'] ?? null;
            $image_front = $product['imageFront'] ?? $product['image_front'] ?? null;
            $image_back = $product['imageBack'] ?? $product['image_back'] ?? null;
            $images = processJsonField($product['images'] ?? null);
            $sizes = processJsonField($product['sizes'] ?? null);
            $colors = processJsonField($product['colors'] ?? null);
            $features = processJsonField($product['features'] ?? null);
            $rating = isset($product['rating']) ? floatval($product['rating']) : 0.00;
            $stars = isset($product['stars']) ? floatval($product['stars']) : 0.0;
            
            // Bind parameters
            $bindResult = $stmt->bind_param(
                "ssssdisssssssdd",
                $code,
                $name,
                $brand,
                $gender,
                $price,
                $stock,
                $description,
                $image_front,
                $image_back,
                $images,
                $sizes,
                $colors,
                $features,
                $rating,
                $stars
            );
            
            if (!$bindResult) {
                throw new Exception("Bind failed: " . $stmt->error);
            }
            
            // Execute
            if ($stmt->execute()) {
                $imported++;
                $stats['total_products']++;
                $stats['by_category'][$category]++;
            } else {
                // Check if it's a duplicate key error
                if ($stmt->errno == 1062) {
                    $skipped++;
                } else {
                    throw new Exception("Execute failed: " . $stmt->error);
                }
            }
            
        } catch (Exception $e) {
            echo "   ⚠️  Error importing product '{$name}': " . $e->getMessage() . "\n";
            $skipped++;
            // Don't set hasError for duplicate keys, only for real errors
            if ($stmt->errno != 1062) {
                $hasError = true;
            }
        }
    }
    
    $stmt->close();
    
    // Commit or rollback transaction
    if ($hasError) {
        $conn->rollback();
        echo "   ❌ Transaction rolled back due to errors\n\n";
        $stats['failed_imports']++;
    } else {
        $conn->commit();
        echo "   ✅ Imported: {$imported} products\n";
        if ($skipped > 0) {
            echo "   ⚠️  Skipped: {$skipped} products (duplicates or minor errors)\n";
        }
        echo "\n";
        $stats['successful_imports']++;
    }
}

// =====================================================
// PROCESS ALL FILES
// =====================================================
echo "========================================\n";
echo "   SHOPI JSON IMPORT SCRIPT\n";
echo "   IMPROVED VERSION v2.0\n";
echo "========================================\n\n";

$stats['total_files'] = count($json_files);

foreach ($json_files as $fileInfo) {
    importJsonFile($conn, $fileInfo, $stats);
}

// =====================================================
// DISPLAY FINAL STATISTICS
// =====================================================
echo "========================================\n";
echo "   IMPORT COMPLETED\n";
echo "========================================\n\n";

echo "📊 STATISTICS:\n";
echo "   Total Files Processed: {$stats['total_files']}\n";
echo "   Successful Imports: {$stats['successful_imports']}\n";
echo "   Failed Imports: {$stats['failed_imports']}\n";
echo "   Total Products Imported: {$stats['total_products']}\n\n";

echo "📦 BY CATEGORY:\n";
foreach ($stats['by_category'] as $category => $count) {
    echo "   " . ucfirst($category) . ": {$count} products\n";
}
echo "\n";

// =====================================================
// VERIFY DATABASE COUNTS (WITH ERROR CHECKING)
// =====================================================
echo "========================================\n";
echo "   DATABASE VERIFICATION\n";
echo "========================================\n\n";

foreach ($ALLOWED_CATEGORIES as $category) {
    $result = $conn->query("SELECT COUNT(*) as count FROM {$category}");
    
    if ($result) {
        $row = $result->fetch_assoc();
        echo "   {$category}: {$row['count']} records in database\n";
    } else {
        echo "   {$category}: query failed (" . $conn->error . ")\n";
    }
}

// =====================================================
// CLOSE CONNECTION
// =====================================================
$conn->close();

echo "\n✅ Import script completed successfully!\n";
echo "========================================\n";
?>