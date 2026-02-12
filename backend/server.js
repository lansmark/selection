// backend/server.js - WITH IMAGE UPLOAD INTEGRATION
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// =====================================================
// CORS CONFIGURATION - FIXED FOR VITE
// =====================================================
const corsOptions = {
  origin: [
    'http://localhost:3000',  // React default
    'http://localhost:5173',  // Vite default (YOUR FRONTEND)
    'http://localhost:5174',  // Vite alternative port
    'http://127.0.0.1:5173',
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// =====================================================
// MIDDLEWARE
// =====================================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve static files (for images)
app.use('/assets', express.static('public/assets'));

// ✅ IMPORTANT: Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// =====================================================
// DATABASE CONNECTION
// =====================================================
const { testConnection } = require('./config/database');

// =====================================================
// ROUTES
// =====================================================
const authRoutes = require('./routes/auth');
const productsRoutes = require('./routes/products');
const ordersRoutes = require('./routes/orders');
const notifyRoutes = require('./routes/notify');
const uploadRoutes = require('./routes/upload'); // ✅ NEW

app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/notify-me', notifyRoutes);
app.use('/api/upload', uploadRoutes); // ✅ NEW

// =====================================================
// HEALTH CHECK & INFO ROUTES
// =====================================================
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uploads: path.join(__dirname, 'uploads/products') // ✅ NEW
  });
});

app.get('/api/routes', (req, res) => {
  res.json({
    routes: [
      { path: '/api/auth/login', method: 'POST' },
      { path: '/api/auth/register', method: 'POST' },
      { path: '/api/products', method: 'GET' },
      { path: '/api/products/category/:category', method: 'GET' },
      { path: '/api/products/:category/:id', method: 'GET' },
      { path: '/api/orders', method: 'GET, POST' },
      { path: '/api/notify-me', method: 'GET, POST' },
      { path: '/api/upload', method: 'POST', description: 'Upload single image' }, // ✅ NEW
      { path: '/api/upload/multiple', method: 'POST', description: 'Upload multiple images' }, // ✅ NEW
      { path: '/api/upload/:filename', method: 'DELETE', description: 'Delete image' }, // ✅ NEW
    ]
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Shopi E-commerce API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      routes: '/api/routes',
      products: '/api/products',
      auth: '/api/auth/login',
      upload: '/api/upload' // ✅ NEW
    }
  });
});

// =====================================================
// ERROR HANDLING MIDDLEWARE
// =====================================================
// Multer error handling
app.use((err, req, res, next) => {
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 5MB.'
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected field name for file upload.'
      });
    }
  }
  
  if (err.message && err.message.includes('Only image files')) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  
  next(err);
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    message: `Route ${req.url} not found` 
  });
});

// =====================================================
// START SERVER
// =====================================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log('==================================================');
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 API: http://localhost:${PORT}/api`);
  console.log(`🏥 Health: http://localhost:${PORT}/api/health`);
  console.log(`🔍 Routes: http://localhost:${PORT}/api/routes`);
  console.log(`🔐 Auth: http://localhost:${PORT}/api/auth/login`);
  console.log(`📦 Products: http://localhost:${PORT}/api/products`);
  console.log(`📤 Upload: http://localhost:${PORT}/api/upload`); // ✅ NEW
  console.log(`📁 Uploads Dir: ${path.join(__dirname, 'uploads/products')}`); // ✅ NEW
  console.log(`💾 Database: MySQL`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('==================================================');
  
  // Test database connection
  await testConnection();
});

module.exports = app;