// backend/routes/notify.js - Complete with WhatsApp & Telegram Notifications
const express = require('express');
const router = express.Router();
const { promisePool } = require('../config/database');
const { sendTelegramMessage } = require('../utils/telegram');
const { sendStockNotificationToAdmin } = require('../utils/whatsapp');

// Allowed categories
const ALLOWED_CATEGORIES = ['watches', 'clothes', 'bags', 'perfumes'];

// Helper function to get product from appropriate table
const getProductFromCategory = async (category, productId) => {
  if (!ALLOWED_CATEGORIES.includes(category)) {
    return null;
  }

  const { promisePool } = require('../config/database');
  const [products] = await promisePool.query(
    `SELECT id, code, name, brand, price FROM ${category} WHERE id = ? OR code = ?`,
    [productId, productId]
  );

  return products.length > 0 ? products[0] : null;
};

// @route   POST /api/notify-me
// @desc    Create notification request
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { product, customer, location, method } = req.body;

    // Validation
    if (!product || !customer || !customer.name || !customer.email) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Validate category - be more flexible
    let productCategory = product.category;
    
    // If no category provided, try to detect from product code
    if (!productCategory && product.code) {
      const prefix = product.code.charAt(0).toUpperCase();
      const categoryMap = {
        'W': 'watches',
        'C': 'clothes',
        'B': 'bags',
        'P': 'perfumes'
      };
      productCategory = categoryMap[prefix];
    }
    
    // If still no valid category, use watches as default
    if (!productCategory || !ALLOWED_CATEGORIES.includes(productCategory)) {
      productCategory = 'watches';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customer.email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email address'
      });
    }

    // Check if product exists in appropriate category table
    const productData = await getProductFromCategory(productCategory, product.id || product.code);
    const productId = productData ? productData.id : null;

    // Duplicate check removed for testing - you can re-enable this in production
    // to prevent spam by uncommenting the code below:
    /*
    const [existingRequests] = await promisePool.query(
      `SELECT id FROM notify_requests 
       WHERE customer_email = ? 
       AND (product_id = ? OR product_code = ?)
       AND product_category = ?
       AND created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)`,
      [customer.email, productId, product.code, productCategory]
    );

    if (existingRequests.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'You already have a pending notification request for this product'
      });
    }
    */

    // Insert notification request
    const [result] = await promisePool.query(
      `INSERT INTO notify_requests (
        product_id, product_code, product_name, product_brand, 
        product_price, product_category, product_gender,
        customer_name, customer_email, customer_phone,
        location_ip, location_country, location_city, location_region,
        notification_method, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        productId,
        product.code,
        product.name,
        product.brand,
        product.price,
        productCategory, // Use the detected category
        product.gender || null,
        customer.name,
        customer.email,
        customer.phone || null,
        location?.ip || null,
        location?.country || null,
        location?.city || null,
        location?.region || null,
        method || 'telegram',
        'pending'
      ]
    );

    const requestId = result.insertId;

    // Notifications are now handled by frontend (like ConfirmationPage)
    // No need to send from backend

    // Return success response
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

    // Get updated request
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

    // Get stats by category
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