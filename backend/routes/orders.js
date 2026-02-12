// backend/routes/orders.js - Updated for Separate Tables
const express = require('express');
const router = express.Router();
const { promisePool } = require('../config/database');

// Allowed categories
const ALLOWED_CATEGORIES = ['watches', 'clothes', 'bags', 'perfumes'];

// Helper function to get product from appropriate table
const getProductFromTable = async (connection, category, productId) => {
  if (!ALLOWED_CATEGORIES.includes(category)) {
    throw new Error('Invalid category');
  }
  
  const [products] = await connection.query(
    `SELECT id, stock, price, code, name, brand FROM ${category} WHERE id = ?`,
    [productId]
  );
  
  return products.length > 0 ? products[0] : null;
};

// Helper function to update stock in appropriate table
const updateStockInTable = async (connection, category, productId, quantity) => {
  if (!ALLOWED_CATEGORIES.includes(category)) {
    throw new Error('Invalid category');
  }
  
  await connection.query(
    `UPDATE ${category} SET stock = stock - ? WHERE id = ?`,
    [quantity, productId]
  );
};

// Helper function to generate order number
const generateOrderNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `ORD-${year}${month}${day}-${random}`;
};

// @route   POST /api/orders
// @desc    Create new order
// @access  Public (should be Private in production)
router.post('/', async (req, res) => {
  const connection = await promisePool.getConnection();
  
  try {
    const { 
      userId, 
      items, 
      totalAmount, 
      shippingCost,
      shippingAddress,
      paymentMethod,
      notes 
    } = req.body;

    // Validation
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item'
      });
    }

    if (!shippingAddress || !shippingAddress.name || !shippingAddress.phone || 
        !shippingAddress.city || !shippingAddress.street) {
      return res.status(400).json({
        success: false,
        message: 'Complete shipping address is required'
      });
    }

    // Validate all items have category
    for (const item of items) {
      if (!item.category || !ALLOWED_CATEGORIES.includes(item.category)) {
        return res.status(400).json({
          success: false,
          message: `Invalid or missing category for product ${item.productId}`
        });
      }
    }

    // Start transaction
    await connection.beginTransaction();

    try {
      // Generate order number
      const orderNumber = generateOrderNumber();

      // Insert order
      const [orderResult] = await connection.query(
        `INSERT INTO orders (
          user_id, order_number, total_amount, shipping_cost,
          shipping_name, shipping_phone, shipping_city, shipping_street, shipping_region,
          payment_method, notes, status, payment_status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'pending')`,
        [
          userId || null,
          orderNumber,
          totalAmount,
          shippingCost || 0,
          shippingAddress.name,
          shippingAddress.phone,
          shippingAddress.city,
          shippingAddress.street,
          shippingAddress.region || null,
          paymentMethod || 'cash',
          notes || null
        ]
      );

      const orderId = orderResult.insertId;

      // Insert order items and update stock
      for (const item of items) {
        // Get product from appropriate category table
        const product = await getProductFromTable(connection, item.category, item.productId);

        if (!product) {
          throw new Error(`Product ${item.productId} not found in ${item.category}`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for product ${item.productId} (${product.name})`);
        }

        // Insert order item with category
        await connection.query(
          `INSERT INTO order_items (
            order_id, product_id, product_code, product_name, product_brand,
            quantity, price, size, color, subtotal, product_category
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            orderId,
            item.productId,
            item.productCode || product.code,
            item.productName || product.name,
            item.productBrand || product.brand,
            item.quantity,
            item.price || product.price,
            item.size || null,
            item.color || null,
            item.subtotal,
            item.category
          ]
        );

        // Update product stock in appropriate table
        await updateStockInTable(connection, item.category, item.productId, item.quantity);
      }

      // Commit transaction
      await connection.commit();

      // Get complete order with items
      const [orders] = await connection.query(
        `SELECT o.*, 
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'id', oi.id,
              'product_id', oi.product_id,
              'product_code', oi.product_code,
              'product_name', oi.product_name,
              'product_category', oi.product_category,
              'quantity', oi.quantity,
              'price', oi.price,
              'size', oi.size,
              'color', oi.color,
              'subtotal', oi.subtotal
            )
          ) as items
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        WHERE o.id = ?
        GROUP BY o.id`,
        [orderId]
      );

      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        order: orders[0]
      });

    } catch (error) {
      // Rollback transaction on error
      await connection.rollback();
      throw error;
    }

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create order'
    });
  } finally {
    connection.release();
  }
});

// @route   GET /api/orders
// @desc    Get all orders (Admin) or user orders
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { userId, status, limit = 50, offset = 0 } = req.query;

    let query = `
      SELECT o.*, u.name as customer_name, u.email as customer_email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (userId) {
      query += ' AND o.user_id = ?';
      params.push(userId);
    }

    if (status) {
      query += ' AND o.status = ?';
      params.push(status);
    }

    query += ' ORDER BY o.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [orders] = await promisePool.query(query, params);

    res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
});

// @route   GET /api/orders/:id
// @desc    Get single order with items
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const [orders] = await promisePool.query(
      `SELECT o.*, u.name as customer_name, u.email as customer_email
       FROM orders o
       LEFT JOIN users u ON o.user_id = u.id
       WHERE o.id = ? OR o.order_number = ?`,
      [req.params.id, req.params.id]
    );

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const order = orders[0];

    // Get order items
    const [items] = await promisePool.query(
      'SELECT * FROM order_items WHERE order_id = ?',
      [order.id]
    );

    order.items = items;

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order'
    });
  }
});

// @route   PATCH /api/orders/:id/status
// @desc    Update order status (Admin only)
// @access  Private/Admin
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const [result] = await promisePool.query(
      'UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?',
      [status, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Order status updated successfully'
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status'
    });
  }
});

// @route   PATCH /api/orders/:id/payment-status
// @desc    Update payment status (Admin only)
// @access  Private/Admin
router.patch('/:id/payment-status', async (req, res) => {
  try {
    const { paymentStatus } = req.body;

    if (!paymentStatus || !['pending', 'paid', 'failed', 'refunded'].includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment status'
      });
    }

    const [result] = await promisePool.query(
      'UPDATE orders SET payment_status = ?, updated_at = NOW() WHERE id = ?',
      [paymentStatus, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Payment status updated successfully'
    });
  } catch (error) {
    console.error('Update payment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update payment status'
    });
  }
});

// @route   GET /api/orders/stats/summary
// @desc    Get order statistics (Admin only)
// @access  Private/Admin
router.get('/stats/summary', async (req, res) => {
  try {
    const [stats] = await promisePool.query(`
      SELECT 
        COUNT(*) as total_orders,
        SUM(total_amount) as total_revenue,
        AVG(total_amount) as average_order_value,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_orders,
        COUNT(CASE WHEN status = 'processing' THEN 1 END) as processing_orders,
        COUNT(CASE WHEN status = 'shipped' THEN 1 END) as shipped_orders,
        COUNT(CASE WHEN status = 'delivered' THEN 1 END) as delivered_orders,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_orders
      FROM orders
    `);

    const [recentOrders] = await promisePool.query(`
      SELECT id, order_number, total_amount, status, created_at
      FROM orders
      ORDER BY created_at DESC
      LIMIT 10
    `);

    res.json({
      success: true,
      summary: stats[0],
      recent_orders: recentOrders
    });
  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order statistics'
    });
  }
});

module.exports = router;

