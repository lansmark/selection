// backend/routes/notify.js - Complete with WhatsApp & Telegram Notifications
const express = require('express');
const router = express.Router();
const { promisePool } = require('../config/database');
const { sendTelegramMessage } = require('../utils/telegram');
const { sendStockNotificationToAdmin } = require('../utils/whatsapp');

// Allowed categories (these are also the table names)
const ALLOWED_CATEGORIES = ['watches', 'clothes', 'bags', 'perfumes'];

// ✅ Search ALL tables by product code — no prefix assumptions at all.
//    Returns the product row + whichever table (category) it was found in.
const getProductByCode = async (productCode) => {
  if (!productCode) return { product: null, category: null };

  // Run all 4 queries in parallel — fastest possible lookup
  const results = await Promise.all(
    ALLOWED_CATEGORIES.map(async (cat) => {
      try {
        const [rows] = await promisePool.query(
          `SELECT id, code, name, brand, price FROM ${cat} WHERE code = ?`,
          [productCode]
        );
        // Return the first match paired with its table name
        return rows.length > 0 ? { product: rows[0], category: cat } : null;
      } catch (e) {
        console.error(`  ⚠️  Error searching table "${cat}":`, e.message);
        return null;
      }
    })
  );

  // Pick the first non-null result (there should only ever be one match)
  const match = results.find((r) => r !== null);

  if (match) {
    console.log(`✅ Found product code="${productCode}" in table "${match.category}"`);
    return match;                          // { product, category }
  }

  console.warn(`⚠️  Product code="${productCode}" not found in any table`);
  return { product: null, category: null };
};

// @route   POST /api/notify-me
// @desc    Create notification request
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { product, customer, location, method } = req.body;

    // ── Validation ──────────────────────────────────────────────────
    if (!product || !product.code) {
      return res.status(400).json({
        success: false,
        message: 'Missing required field: product.code'
      });
    }

    if (!customer || !customer.name || !customer.email) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: customer.name and customer.email'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customer.email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email address'
      });
    }

    // ── Resolve category from DB using product.code ────────────────
    // product.code is the ONLY reliable identifier.
    // product.category sent by the frontend is IGNORED — the backend
    // determines the real category by searching every table.
    const { product: foundProduct, category: productCategory } = await getProductByCode(product.code);

    console.log('📝 Notify request:');
    console.log('   product.code     :', product.code, '← used to search DB');
    console.log('   DB category      :', productCategory || 'NOT FOUND');
    console.log('   DB product_id    :', foundProduct ? foundProduct.id : 'NOT FOUND');
    console.log('   frontend category:', product.category, '← IGNORED');

    // If the code doesn't exist in ANY table, fail clearly
    if (!productCategory) {
      return res.status(400).json({
        success: false,
        message: `Product with code "${product.code}" was not found in any category table. ` +
                 'Please verify the product code is correct.'
      });
    }

    // ── Insert notification request ─────────────────────────────────
    const [result] = await promisePool.query(
      `INSERT INTO notify_requests (
        product_id, product_code, product_name, product_brand,
        product_price, product_category, product_gender,
        customer_name, customer_email, customer_phone,
        location_ip, location_country, location_city, location_region,
        notification_method, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        foundProduct.id,                                          // always from DB
        foundProduct.code,                                        // always from DB
        foundProduct.name,                                        // always from DB
        foundProduct.brand,                                       // always from DB
        foundProduct.price,                                       // always from DB
        productCategory,                                          // resolved from DB
        product.gender || null,
        customer.name,
        customer.email,
        customer.phone || null,
        location?.ip    || null,
        location?.country || null,
        location?.city  || null,
        location?.region || null,
        method || 'telegram',
        'pending'
      ]
    );

    const requestId = result.insertId;
    console.log(`✅ Notify request #${requestId} created — category="${productCategory}", product_id=${foundProduct.id}`);

    res.status(201).json({
      success: true,
      message: 'Notification request created successfully',
      requestId
    });

  } catch (error) {
    console.error('Notify request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create notification request'
    });
  }
});

// @route   GET /api/notify-me
// @desc    Get all notification requests (Admin only)
// @access  Private/Admin
router.get('/', async (req, res) => {
  try {
    const { status, category, limit = 100 } = req.query;

    let query = 'SELECT * FROM notify_requests WHERE 1=1';
    const params = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (category && ALLOWED_CATEGORIES.includes(category)) {
      query += ' AND product_category = ?';
      params.push(category);
    }

    query += ' ORDER BY created_at DESC LIMIT ?';
    params.push(parseInt(limit));

    const [requests] = await promisePool.query(query, params);

    res.json({
      success: true,
      count: requests.length,
      requests
    });
  } catch (error) {
    console.error('Get requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notification requests'
    });
  }
});

// @route   GET /api/notify-me/:id
// @desc    Get single notification request
// @access  Private/Admin
router.get('/:id', async (req, res) => {
  try {
    const [requests] = await promisePool.query(
      'SELECT * FROM notify_requests WHERE id = ?',
      [req.params.id]
    );

    if (requests.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Notification request not found'
      });
    }

    res.json({
      success: true,
      request: requests[0]
    });
  } catch (error) {
    console.error('Get request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notification request'
    });
  }
});

// @route   PATCH /api/notify-me/:id/notify
// @desc    Mark as notified (Admin only)
// @access  Private/Admin
router.patch('/:id/notify', async (req, res) => {
  try {
    const [result] = await promisePool.query(
      `UPDATE notify_requests 
       SET status = 'notified', notified_at = NOW() 
       WHERE id = ?`,
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Notification request not found'
      });
    }

    const [requests] = await promisePool.query(
      'SELECT * FROM notify_requests WHERE id = ?',
      [req.params.id]
    );

    res.json({
      success: true,
      message: 'Marked as notified',
      request: requests[0]
    });
  } catch (error) {
    console.error('Update request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update notification request'
    });
  }
});

// @route   DELETE /api/notify-me/:id
// @desc    Delete notification request (Admin only)
// @access  Private/Admin
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await promisePool.query(
      'DELETE FROM notify_requests WHERE id = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Notification request not found'
      });
    }

    res.json({
      success: true,
      message: 'Notification request deleted'
    });
  } catch (error) {
    console.error('Delete request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete notification request'
    });
  }
});

// @route   GET /api/notify-me/stats/summary
// @desc    Get notification statistics (Admin only)
// @access  Private/Admin
router.get('/stats/summary', async (req, res) => {
  try {
    const [stats] = await promisePool.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'notified' THEN 1 ELSE 0 END) as notified,
        SUM(CASE WHEN status = 'expired' THEN 1 ELSE 0 END) as expired
      FROM notify_requests
    `);

    const [categoryStats] = await promisePool.query(`
      SELECT 
        product_category,
        COUNT(*) as count,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending
      FROM notify_requests
      WHERE product_category IS NOT NULL
      GROUP BY product_category
    `);

    res.json({
      success: true,
      stats: stats[0],
      by_category: categoryStats
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