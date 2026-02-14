// backend/routes/admin.js - DATABASE-BASED ADMIN AUTHENTICATION
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { promisePool } = require('../config/database');

const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';

// 🔐 ADMIN LOGIN ROUTE (Database-based)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('📝 Admin login attempt:', email);

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find admin in database
    const [admins] = await promisePool.query(
      'SELECT * FROM admins WHERE email = ? AND status = ?',
      [email, 'active']
    );

    if (admins.length === 0) {
      // Add delay to prevent brute force attacks
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('❌ Admin not found:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const admin = admins[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, admin.password_hash);
    
    if (!isPasswordValid) {
      // Add delay to prevent brute force attacks
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('❌ Invalid password for:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    await promisePool.query(
      'UPDATE admins SET last_login = NOW() WHERE id = ?',
      [admin.id]
    );

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: admin.id,
        email: admin.email,
        role: admin.role,
        name: admin.name
      },
      ADMIN_JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('✅ Admin login successful:', email);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    });

  } catch (error) {
    console.error('❌ Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// 🔐 VERIFY TOKEN ROUTE
router.get('/verify', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, ADMIN_JWT_SECRET);

    res.json({
      success: true,
      user: {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        name: decoded.name
      }
    });

  } catch (error) {
    console.error('❌ Token verification failed:', error.message);
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
});

// 🔐 MIDDLEWARE: Verify Admin Token
const verifyAdminToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const decoded = jwt.verify(token, ADMIN_JWT_SECRET);

    if (!decoded.role || !['admin', 'super_admin'].includes(decoded.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    req.admin = decoded;
    next();

  } catch (error) {
    console.error('❌ Token verification failed:', error.message);
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

// 🔐 MIDDLEWARE: Verify Super Admin
const verifySuperAdmin = (req, res, next) => {
  if (req.admin.role !== 'super_admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Super admin privileges required.'
    });
  }
  next();
};

// ====================================
// ADMIN MANAGEMENT ROUTES
// ====================================

// GET all admins (Super Admin only)
router.get('/admins', verifyAdminToken, verifySuperAdmin, async (req, res) => {
  try {
    const [admins] = await promisePool.query(
      'SELECT id, name, email, role, status, created_at, last_login FROM admins ORDER BY created_at DESC'
    );

    res.json({
      success: true,
      admins
    });

  } catch (error) {
    console.error('❌ Get admins error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admins'
    });
  }
});

// CREATE new admin (Super Admin only)
router.post('/admins', verifyAdminToken, verifySuperAdmin, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }

    // Check if email already exists
    const [existing] = await promisePool.query(
      'SELECT id FROM admins WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Insert new admin
    const [result] = await promisePool.query(
      'INSERT INTO admins (name, email, password_hash, role, status) VALUES (?, ?, ?, ?, ?)',
      [name, email, password_hash, role || 'admin', 'active']
    );

    console.log('✅ New admin created:', email);

    res.json({
      success: true,
      message: 'Admin created successfully',
      admin: {
        id: result.insertId,
        name,
        email,
        role: role || 'admin'
      }
    });

  } catch (error) {
    console.error('❌ Create admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create admin'
    });
  }
});

// UPDATE admin (Super Admin only)
router.put('/admins/:id', verifyAdminToken, verifySuperAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, status } = req.body;

    // Check if admin exists
    const [existing] = await promisePool.query(
      'SELECT id FROM admins WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    // Prevent super admin from changing their own role
    if (parseInt(id) === req.admin.id && role !== 'super_admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot change your own role'
      });
    }

    // Update admin
    await promisePool.query(
      'UPDATE admins SET name = ?, email = ?, role = ?, status = ? WHERE id = ?',
      [name, email, role, status, id]
    );

    console.log('✅ Admin updated:', email);

    res.json({
      success: true,
      message: 'Admin updated successfully'
    });

  } catch (error) {
    console.error('❌ Update admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update admin'
    });
  }
});

// CHANGE PASSWORD
router.put('/admins/:id/password', verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    // Only allow admins to change their own password or super admin to change any
    if (parseInt(id) !== req.admin.id && req.admin.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Get admin
    const [admins] = await promisePool.query(
      'SELECT * FROM admins WHERE id = ?',
      [id]
    );

    if (admins.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    const admin = admins[0];

    // If changing own password, verify current password
    if (parseInt(id) === req.admin.id) {
      const isPasswordValid = await bcrypt.compare(currentPassword, admin.password_hash);
      
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }
    }

    // Hash new password
    const password_hash = await bcrypt.hash(newPassword, 10);

    // Update password
    await promisePool.query(
      'UPDATE admins SET password_hash = ? WHERE id = ?',
      [password_hash, id]
    );

    console.log('✅ Password changed for admin ID:', id);

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('❌ Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password'
    });
  }
});

// DELETE admin (Super Admin only)
router.delete('/admins/:id', verifyAdminToken, verifySuperAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent super admin from deleting themselves
    if (parseInt(id) === req.admin.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    // Delete admin
    const [result] = await promisePool.query(
      'DELETE FROM admins WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    console.log('✅ Admin deleted, ID:', id);

    res.json({
      success: true,
      message: 'Admin deleted successfully'
    });

  } catch (error) {
    console.error('❌ Delete admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete admin'
    });
  }
});

module.exports = router;