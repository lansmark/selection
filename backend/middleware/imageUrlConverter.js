// backend/middleware/imageUrlConverter.js - PRODUCTION READY
// Converts relative image paths to full URLs based on current request

/**
 * Get the base URL from request or environment variable
 * This works in both development and production
 */
const getBaseUrl = (req) => {
  // Try to get from environment variable first (for production)
  if (process.env.API_URL) {
    return process.env.API_URL;
  }
  
  // Otherwise build from request (works in dev and production)
  const protocol = req.protocol;
  const host = req.get('host');
  return `${protocol}://${host}`;
};

/**
 * Converts image path to full URL
 * @param {string} imagePath - Image path from database
 * @param {object} req - Express request object
 * @returns {string} - Full image URL
 */
const convertImagePath = (imagePath, req) => {
  if (!imagePath) return null;
  
  // If already a full URL (http:// or https://), return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If starts with /uploads, convert to full URL
  if (imagePath.startsWith('/uploads')) {
    const baseUrl = getBaseUrl(req);
    return `${baseUrl}${imagePath}`;
  }
  
  // If it's an assets path from public folder
  // In production, you might serve these from a CDN or the same domain
  if (imagePath.startsWith('/assets')) {
    // For development: return as is (frontend serves /public)
    if (process.env.NODE_ENV === 'development') {
      return imagePath;
    }
    // For production: convert to full URL
    const baseUrl = getBaseUrl(req);
    return `${baseUrl}${imagePath}`;
  }
  
  // Default: return as is
  return imagePath;
};

/**
 * Middleware to convert product image paths to full URLs
 * Use this AFTER fetching products from database
 */
const convertProductImageUrls = (req) => {
  return (product) => {
    if (!product) return product;
    
    return {
      ...product,
      image_front: convertImagePath(product.image_front, req),
      image_back: convertImagePath(product.image_back, req),
      // Also handle alternate field names
      imageFront: convertImagePath(product.imageFront || product.image_front, req),
      imageBack: convertImagePath(product.imageBack || product.image_back, req)
    };
  };
};

/**
 * Express middleware to automatically convert image URLs in responses
 * This works for both single product and multiple products responses
 */
const imageUrlConverterMiddleware = (req, res, next) => {
  // Store original json function
  const originalJson = res.json.bind(res);
  
  // Override json function
  res.json = function(data) {
    if (data && data.success) {
      // Single product response
      if (data.product) {
        data.product = convertProductImageUrls(req)(data.product);
      }
      
      // Multiple products response
      if (data.products && Array.isArray(data.products)) {
        data.products = data.products.map(convertProductImageUrls(req));
      }
    }
    
    // Call original json function with modified data
    return originalJson(data);
  };
  
  next();
};

module.exports = {
  convertImagePath,
  convertProductImageUrls,
  imageUrlConverterMiddleware,
  getBaseUrl
};