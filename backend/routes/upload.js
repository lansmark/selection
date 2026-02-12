// backend/routes/upload.js - PRODUCTION READY
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads/products');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('📁 Created uploads directory:', uploadsDir);
}

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename: timestamp-randomstring-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9]/g, '-') // Replace special chars with dash
      .toLowerCase();
    cb(null, nameWithoutExt + '-' + uniqueSuffix + ext);
  }
});

// File filter to only accept images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, JPG, PNG, GIF, WEBP) are allowed!'));
  }
};

// Configure multer upload
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

// ✅ PRODUCTION READY: Upload single image
router.post('/', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // ✅ SAVE RELATIVE PATH TO DATABASE (works in dev AND production)
    const relativePath = `/uploads/products/${req.file.filename}`;
    
    // ✅ RETURN FULL URL TO FRONTEND (for immediate display)
    const protocol = req.protocol;
    const host = req.get('host');
    const fullUrl = `${protocol}://${host}${relativePath}`;
    
    console.log('✅ Image uploaded successfully');
    console.log('   Relative path (for DB):', relativePath);
    console.log('   Full URL (for display):', fullUrl);
    
    res.json({
      success: true,
      imageUrl: relativePath,      // ✅ SAVE THIS TO DATABASE
      fullUrl: fullUrl,             // ✅ USE THIS FOR DISPLAY (optional)
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype
    });
  } catch (error) {
    console.error('❌ Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload image',
      error: error.message
    });
  }
});

// ✅ Upload multiple images
router.post('/multiple', upload.array('images', 5), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const protocol = req.protocol;
    const host = req.get('host');
    
    const imageUrls = req.files.map(file => {
      const relativePath = `/uploads/products/${file.filename}`;
      return {
        url: relativePath,                           // ✅ Save to DB
        fullUrl: `${protocol}://${host}${relativePath}`, // ✅ For display
        filename: file.filename,
        originalName: file.originalname,
        size: file.size
      };
    });

    console.log(`✅ ${req.files.length} images uploaded successfully`);
    
    res.json({
      success: true,
      images: imageUrls,
      count: req.files.length
    });
  } catch (error) {
    console.error('❌ Multiple upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload images',
      error: error.message
    });
  }
});

// ✅ Delete image
router.delete('/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filepath = path.join(uploadsDir, filename);

    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      console.log('🗑️  Image deleted:', filename);
      res.json({
        success: true,
        message: 'Image deleted successfully',
        filename: filename
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }
  } catch (error) {
    console.error('❌ Delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete image',
      error: error.message
    });
  }
});

module.exports = router;