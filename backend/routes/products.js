// backend/routes/products.js - WITH IMAGE URL CONVERSION MIDDLEWARE
const express = require('express');
const router = express.Router();
const { promisePool } = require('../config/database');
const https = require('https');
const { URLSearchParams } = require('url');

// ✅ IMPORT IMAGE URL CONVERTER MIDDLEWARE
const { imageUrlConverterMiddleware } = require('../middleware/imageUrlConverter');

// ✅ APPLY MIDDLEWARE TO ALL ROUTES - AUTOMATIC IMAGE URL CONVERSION
router.use(imageUrlConverterMiddleware);

// Allowed categories (whitelist)
const ALLOWED_CATEGORIES = ['watches', 'clothes', 'bags', 'perfumes'];

// Helper function to validate category
const isValidCategory = (category) => {
  return ALLOWED_CATEGORIES.includes(category);
};

// Helper function to get table name from category
const getTableName = (category) => {
  if (!isValidCategory(category)) {
    throw new Error('Invalid category');
  }
  return category;
};

// @route   GET /api/products
// @desc    Get all products from all categories with filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { 
      category, 
      gender, 
      brand, 
      minPrice, 
      maxPrice, 
      inStock,
      search,
      limit = 50,
      offset = 0 
    } = req.query;

    let products = [];

    if (category && isValidCategory(category)) {
      const tableName = getTableName(category);
      let query = `SELECT *, '${category}' as category FROM ${tableName} WHERE 1=1`;
      const params = [];

      if (gender) {
        query += ' AND gender = ?';
        params.push(gender);
      }

      if (brand) {
        query += ' AND brand = ?';
        params.push(brand);
      }

      if (minPrice) {
        query += ' AND price >= ?';
        params.push(parseFloat(minPrice));
      }

      if (maxPrice) {
        query += ' AND price <= ?';
        params.push(parseFloat(maxPrice));
      }

      if (inStock === 'true') {
        query += ' AND stock > 0';
      }

      if (search) {
        query += ' AND (name LIKE ? OR brand LIKE ? OR code LIKE ?)';
        const searchTerm = `%${search}%`;
        params.push(searchTerm, searchTerm, searchTerm);
      }

      query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
      params.push(parseInt(limit), parseInt(offset));

      const [results] = await promisePool.query(query, params);
      products = results;

    } else {
      const queries = ALLOWED_CATEGORIES.map(cat => {
        let query = `SELECT *, '${cat}' as category FROM ${cat} WHERE 1=1`;
        const params = [];

        if (gender) {
          query += ' AND gender = ?';
          params.push(gender);
        }

        if (brand) {
          query += ' AND brand = ?';
          params.push(brand);
        }

        if (minPrice) {
          query += ' AND price >= ?';
          params.push(parseFloat(minPrice));
        }

        if (maxPrice) {
          query += ' AND price <= ?';
          params.push(parseFloat(maxPrice));
        }

        if (inStock === 'true') {
          query += ' AND stock > 0';
        }

        if (search) {
          query += ' AND (name LIKE ? OR brand LIKE ? OR code LIKE ?)';
          const searchTerm = `%${search}%`;
          params.push(searchTerm, searchTerm, searchTerm);
        }

        return { query, params };
      });

      const results = await Promise.all(
        queries.map(({ query, params }) => promisePool.query(query, params))
      );

      products = results.flatMap(([rows]) => rows);
      products.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      const start = parseInt(offset);
      const end = start + parseInt(limit);
      products = products.slice(start, end);
    }

    // ✅ Image URLs are automatically converted by middleware
    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products'
    });
  }
});

// @route   GET /api/products/category/:category
// @desc    Get products by specific category
// @access  Public
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { gender, brand, minPrice, maxPrice, inStock, limit = 50, offset = 0 } = req.query;

    if (!isValidCategory(category)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category. Must be: watches, clothes, bags, or perfumes'
      });
    }

    const tableName = getTableName(category);
    let query = `SELECT *, '${category}' as category FROM ${tableName} WHERE 1=1`;
    const params = [];

    if (gender) {
      query += ' AND gender = ?';
      params.push(gender);
    }

    if (brand) {
      query += ' AND brand = ?';
      params.push(brand);
    }

    if (minPrice) {
      query += ' AND price >= ?';
      params.push(parseFloat(minPrice));
    }

    if (maxPrice) {
      query += ' AND price <= ?';
      params.push(parseFloat(maxPrice));
    }

    if (inStock === 'true') {
      query += ' AND stock > 0';
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [products] = await promisePool.query(query, params);

    // ✅ Image URLs are automatically converted by middleware
    res.json({
      success: true,
      category,
      count: products.length,
      products
    });
  } catch (error) {
    console.error('Get category products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products'
    });
  }
});

// @route   GET /api/products/:category/:code
// @desc    Get single product by category and CODE
// @access  Public
router.get('/:category/:code', async (req, res) => {
  try {
    const { category, code } = req.params;

    if (!isValidCategory(category)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category'
      });
    }

    const tableName = getTableName(category);
    const [products] = await promisePool.query(
      `SELECT *, '${category}' as category FROM ${tableName} WHERE code = ?`,
      [code]
    );

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // ✅ Image URLs are automatically converted by middleware
    res.json({
      success: true,
      product: products[0]
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product'
    });
  }
});

// @route   POST /api/products/:category
// @desc    Create new product in specific category (Admin only)
// @access  Private/Admin
router.post('/:category', async (req, res) => {
  try {
    const { category } = req.params;
    
    if (!isValidCategory(category)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category'
      });
    }

    const {
      code, name, brand, gender, price, stock,
      description, image_front, image_back, images, sizes, colors, features
    } = req.body;

    if (!code || !name || !brand || !gender || !price) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const tableName = getTableName(category);

    const [existing] = await promisePool.query(
      `SELECT id FROM ${tableName} WHERE code = ?`,
      [code]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Product code already exists'
      });
    }

    const [result] = await promisePool.query(
      `INSERT INTO ${tableName} (
        code, name, brand, gender, price, stock,
        description, image_front, image_back, images, sizes, colors, features
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        code, name, brand, gender, price, stock || 0,
        description || null,
        image_front || null,
        image_back || null,
        images ? JSON.stringify(images) : null,
        sizes ? JSON.stringify(sizes) : null,
        colors ? JSON.stringify(colors) : null,
        features ? JSON.stringify(features) : null
      ]
    );

    const productId = result.insertId;

    const [products] = await promisePool.query(
      `SELECT *, '${category}' as category FROM ${tableName} WHERE id = ?`,
      [productId]
    );

    // ✅ Image URLs are automatically converted by middleware
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: products[0]
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create product'
    });
  }
});

// @route   PUT /api/products/:category/:code
// @desc    Update product by CODE (Admin only)
// @access  Private/Admin
router.put('/:category/:code', async (req, res) => {
  try {
    const { category, code } = req.params;

    if (!isValidCategory(category)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category'
      });
    }

    const {
      name, brand, gender, price, stock,
      description, image_front, image_back, images, sizes, colors, features
    } = req.body;

    const tableName = getTableName(category);

    const [existing] = await promisePool.query(
      `SELECT id FROM ${tableName} WHERE code = ?`,
      [code]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await promisePool.query(
      `UPDATE ${tableName} SET
        name = COALESCE(?, name),
        brand = COALESCE(?, brand),
        gender = COALESCE(?, gender),
        price = COALESCE(?, price),
        stock = COALESCE(?, stock),
        description = COALESCE(?, description),
        image_front = COALESCE(?, image_front),
        image_back = COALESCE(?, image_back),
        images = COALESCE(?, images),
        sizes = COALESCE(?, sizes),
        colors = COALESCE(?, colors),
        features = COALESCE(?, features),
        updated_at = NOW()
      WHERE code = ?`,
      [
        name, brand, gender, price, stock,
        description, image_front, image_back,
        images ? JSON.stringify(images) : null,
        sizes ? JSON.stringify(sizes) : null,
        colors ? JSON.stringify(colors) : null,
        features ? JSON.stringify(features) : null,
        code
      ]
    );

    const [products] = await promisePool.query(
      `SELECT *, '${category}' as category FROM ${tableName} WHERE code = ?`,
      [code]
    );

    // ✅ Image URLs are automatically converted by middleware
    res.json({
      success: true,
      message: 'Product updated successfully',
      product: products[0]
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update product'
    });
  }
});

// @route   DELETE /api/products/:category/:code
// @desc    Delete product by CODE (Admin only)
// @access  Private/Admin
router.delete('/:category/:code', async (req, res) => {
  try {
    const { category, code } = req.params;

    if (!isValidCategory(category)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category'
      });
    }

    const tableName = getTableName(category);
    const [result] = await promisePool.query(
      `DELETE FROM ${tableName} WHERE code = ?`,
      [code]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product'
    });
  }
});

// @route   PATCH /api/products/:category/:code/stock
// @desc    Update product stock by CODE (Admin only)
// @access  Private/Admin
router.patch('/:category/:code/stock', async (req, res) => {
  try {
    const { category, code } = req.params;
    const { stock } = req.body;

    if (!isValidCategory(category)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category'
      });
    }

    if (stock === undefined || stock < 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid stock value'
      });
    }

    const tableName = getTableName(category);
    const [result] = await promisePool.query(
      `UPDATE ${tableName} SET stock = ?, updated_at = NOW() WHERE code = ?`,
      [stock, code]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const [products] = await promisePool.query(
      `SELECT *, '${category}' as category FROM ${tableName} WHERE code = ?`,
      [code]
    );

    // ✅ Image URLs are automatically converted by middleware
    res.json({
      success: true,
      message: 'Stock updated successfully',
      product: products[0]
    });
  } catch (error) {
    console.error('Update stock error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update stock'
    });
  }
});

// @route   PATCH /api/products/:category/:code/restock
// @desc    Update product stock by CODE and automatically notify all waiting customers
// @access  Admin
router.patch('/:category/:code/restock', async (req, res) => {
  try {
    const { category, code } = req.params;
    const { stock } = req.body;

    console.log('📦 Restock request received:', { category, code, stock });

    if (!isValidCategory(category)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category. Must be: watches, clothes, bags, or perfumes'
      });
    }

    if (!stock || isNaN(stock) || stock < 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid stock value'
      });
    }

    const tableName = getTableName(category);

    // Find product by CODE
    const [products] = await promisePool.query(
      `SELECT * FROM ${tableName} WHERE code = ?`,
      [code]
    );

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Product with code ${code} not found in ${category}`
      });
    }

    const product = products[0];
    console.log('📦 Product found:', product.name, '(code:', code, ')');

    // Update stock by CODE
    await promisePool.query(
      `UPDATE ${tableName} SET stock = ?, updated_at = NOW() WHERE code = ?`,
      [stock, code]
    );

    console.log(`📊 Stock updated to: ${stock}`);

    // Find notification requests by CODE
    const [requests] = await promisePool.query(
      `SELECT * FROM notify_requests 
       WHERE product_code = ? 
       AND status = 'pending'
       ORDER BY created_at ASC`,
      [code]
    );

    console.log(`👥 Found ${requests.length} customers waiting for product code: ${code}`);

    if (requests.length === 0) {
      return res.json({
        success: true,
        message: 'Product restocked successfully (no customers to notify)',
        product: {
          code: product.code,
          name: product.name,
          category: category,
          stock: stock
        },
        notifications: {
          total: 0,
          success: 0,
          failed: 0
        }
      });
    }

    let successCount = 0;
    let failCount = 0;
    const notificationResults = [];
    const whatsappLinks = [];

    for (const request of requests) {
      try {
        const result = await notifyCustomer(request, product);
        
        await promisePool.query(
          `UPDATE notify_requests 
           SET status = 'notified', notified_at = NOW() 
           WHERE id = ?`,
          [request.id]
        );
        
        successCount++;
        notificationResults.push({
          customer: request.customer_name,
          phone: request.customer_phone,
          status: 'success',
          methods: result.methods,
          whatsappLink: result.whatsappLink
        });
        
        if (result.whatsappLink) {
          whatsappLinks.push({
            customer: request.customer_name,
            phone: request.customer_phone,
            link: result.whatsappLink
          });
        }
        
        console.log(`✅ Notified: ${request.customer_name}`);
        
      } catch (error) {
        failCount++;
        notificationResults.push({
          customer: request.customer_name,
          phone: request.customer_phone,
          status: 'failed',
          error: error.message
        });
        console.error(`❌ Failed to notify ${request.customer_name}:`, error.message);
      }
    }

    res.json({
      success: true,
      message: `Product restocked! ${successCount} customers notified successfully`,
      product: {
        code: product.code,
        name: product.name,
        category: category,
        stock: stock
      },
      notifications: {
        total: requests.length,
        success: successCount,
        failed: failCount,
        details: notificationResults
      },
      whatsappLinks
    });

  } catch (error) {
    console.error('❌ Restock error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to restock product and notify customers',
      error: error.message
    });
  }
});

// ✅ Helper function to notify individual customer
async function notifyCustomer(request, product) {
  const customerName = request.customer_name;
  const productName = product.name;
  const productPrice = product.price;
  const productCode = product.code;
  const customerPhone = request.customer_phone;
  const customerEmail = request.customer_email;

  // ✅ IMPORTANT: Keep emojis in the message - they work in WhatsApp!
  const message = `🎉 GOOD NEWS ${customerName}!

The product you requested is now BACK IN STOCK! 🎊

📦 ${productName}
💰 Price: ${productPrice}
🔖 Code: ${productCode}

Visit our store now to purchase before it runs out again!

Thank you for your patience! ✨`;

  const methodsUsed = [];
  let whatsappLink = null;

  try {
    // Send admin notification via Telegram
    try {
      await sendTelegramAdminNotification(customerPhone, customerName, message, product);
      methodsUsed.push('telegram_admin');
      console.log(`  ✓ Telegram admin notification sent`);
    } catch (err) {
      console.error(`  ✗ Telegram admin failed:`, err.message);
    }

    // Create WhatsApp link
    if (customerPhone) {
      try {
        whatsappLink = createWhatsAppLink(customerPhone, customerName, message);
        methodsUsed.push('whatsapp_link_created');
        console.log(`  ✓ WhatsApp link created for ${customerName}`);
      } catch (err) {
        console.error(`  ✗ WhatsApp link creation failed:`, err.message);
      }
    }

    // Send Email
    if (customerEmail) {
      try {
        await sendEmailToCustomer(customerEmail, customerName, productName, productPrice, productCode);
        methodsUsed.push('email');
        console.log(`  ✓ Email sent`);
      } catch (err) {
        console.error(`  ✗ Email failed:`, err.message);
      }
    }

    if (methodsUsed.length === 0) {
      throw new Error('All notification methods failed');
    }

    return { success: true, methods: methodsUsed, whatsappLink };

  } catch (error) {
    console.error(`❌ Failed to notify ${customerName}:`, error);
    throw error;
  }
}

// Send Telegram notification to admin
function sendTelegramAdminNotification(phone, customerName, message, product) {
  return new Promise((resolve, reject) => {
    const botToken = "8569799627:AAGefB4FsdxBBzyiH_K8BH2ESIpYYk0swqQ";
    const adminChatId = "8397935689";
    
    const adminMessage = `📤 *RESTOCK NOTIFICATION*\n\n` +
      `👤 Customer: ${customerName}\n` +
      `📞 Phone: ${phone}\n` +
      `📦 Product: ${product.name}\n` +
      `💰 Price: ${product.price}\n` +
      `🔖 Code: ${product.code}\n\n` +
      `─────────────────\n${message}`;
    
    const postData = JSON.stringify({
      chat_id: adminChatId,
      text: adminMessage,
      parse_mode: 'Markdown'
    });

    const options = {
      hostname: 'api.telegram.org',
      path: `/bot${botToken}/sendMessage`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.ok) {
            resolve(response);
          } else {
            reject(new Error(`Telegram error: ${JSON.stringify(response)}`));
          }
        } catch (err) {
          reject(err);
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });
    
    req.write(postData);
    req.end();
  });
}

// ✅ FIXED: Create WhatsApp link with proper message encoding
function createWhatsAppLink(phone, customerName, message) {
  // Clean phone number - remove all non-digits
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  
  // DON'T remove emojis - they work in WhatsApp!
  // Just trim whitespace
  const cleanMessage = message.trim();
  
  // Encode for URL - this properly encodes emojis and special characters
  const encodedMessage = encodeURIComponent(cleanMessage);
  
  const whatsappLink = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
  
  console.log(`📱 WhatsApp link created for ${customerName}: +${cleanPhone}`);
  console.log(`📝 Message length: ${cleanMessage.length} characters`);
  console.log(`🔗 Link length: ${whatsappLink.length} characters`);
  
  return whatsappLink;
}

// Send email notification
function sendEmailToCustomer(email, name, productName, price, code) {
  return new Promise((resolve, reject) => {
    const emailMessage = `Hi ${name}!

GREAT NEWS! 🎉

The product you requested is now back in stock!

Product Details:
━━━━━━━━━━━━━━━━
📦 Name: ${productName}
🔖 Code: ${code}
💰 Price: ${price}

Visit our store now to purchase before it runs out again!

Thank you for your patience!

Best regards,
Selection Team`;

    // Create form data manually
    const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
    const formData = [];
    
    formData.push(`--${boundary}\r\n`);
    formData.push(`Content-Disposition: form-data; name="_subject"\r\n\r\n`);
    formData.push(`🎉 ${productName} is Back in Stock!\r\n`);
    
    formData.push(`--${boundary}\r\n`);
    formData.push(`Content-Disposition: form-data; name="message"\r\n\r\n`);
    formData.push(`${emailMessage}\r\n`);
    
    formData.push(`--${boundary}\r\n`);
    formData.push(`Content-Disposition: form-data; name="_captcha"\r\n\r\n`);
    formData.push(`false\r\n`);
    
    formData.push(`--${boundary}\r\n`);
    formData.push(`Content-Disposition: form-data; name="_template"\r\n\r\n`);
    formData.push(`box\r\n`);
    
    formData.push(`--${boundary}--\r\n`);
    
    const postData = formData.join('');

    const options = {
      hostname: 'formsubmit.co',
      path: `/${email}`,
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      if (res.statusCode === 200 || res.statusCode === 302) {
        resolve();
      } else {
        reject(new Error(`Email failed with status ${res.statusCode}`));
      }
    });

    req.on('error', (err) => {
      reject(err);
    });
    
    req.write(postData);
    req.end();
  });
}

// @route   GET /api/products/stats/summary
// @desc    Get product statistics from all tables (Admin only)
// @access  Private/Admin
router.get('/stats/summary', async (req, res) => {
  try {
    const statsPromises = ALLOWED_CATEGORIES.map(async (category) => {
      const [stats] = await promisePool.query(`
        SELECT 
          '${category}' as category,
          COUNT(*) as total_products,
          SUM(stock) as total_stock,
          SUM(stock * price) as inventory_value,
          COUNT(CASE WHEN stock = 0 THEN 1 END) as out_of_stock,
          COUNT(CASE WHEN stock > 0 AND stock < 10 THEN 1 END) as low_stock
        FROM ${category}
      `);
      return stats[0];
    });

    const categoryStats = await Promise.all(statsPromises);

    const totals = categoryStats.reduce((acc, stat) => {
      acc.total_products += stat.total_products;
      acc.total_stock += stat.total_stock || 0;
      acc.inventory_value += stat.inventory_value || 0;
      acc.out_of_stock += stat.out_of_stock;
      acc.low_stock += stat.low_stock;
      return acc;
    }, {
      total_products: 0,
      total_stock: 0,
      inventory_value: 0,
      out_of_stock: 0,
      low_stock: 0
    });

    const genderPromises = ALLOWED_CATEGORIES.map(async (category) => {
      const [stats] = await promisePool.query(`
        SELECT gender, COUNT(*) as count
        FROM ${category}
        GROUP BY gender
      `);
      return stats;
    });

    const genderResults = await Promise.all(genderPromises);
    const genderStats = genderResults.flat().reduce((acc, stat) => {
      const existing = acc.find(s => s.gender === stat.gender);
      if (existing) {
        existing.count += stat.count;
      } else {
        acc.push(stat);
      }
      return acc;
    }, []);

    res.json({
      success: true,
      summary: totals,
      by_category: categoryStats,
      by_gender: genderStats
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics'
    });
  }
});

module.exports = router;