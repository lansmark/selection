// src/services/api.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log('🔍 API_BASE_URL:', API_BASE_URL);  // <-- ADD THIS LINE

/**
 * Generic fetch wrapper with error handling
 */
async function fetchAPI(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// =====================================================
// PRODUCTS API
// =====================================================

/**
 * Get all products (from all categories)
 * @param {Object} filters - { category, gender, brand, minPrice, maxPrice, inStock, search, limit, offset }
 */
export async function getAllProducts(filters = {}) {
  const queryParams = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, value);
    }
  });

  const queryString = queryParams.toString();
  const endpoint = `/products${queryString ? `?${queryString}` : ''}`;
  
  return fetchAPI(endpoint);
}

/**
 * Get products by specific category
 * @param {String} category - watches, clothes, bags, perfumes
 * @param {Object} filters - { gender, brand, minPrice, maxPrice, inStock, limit, offset }
 */
export async function getProductsByCategory(category, filters = {}) {
  const queryParams = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, value);
    }
  });

  const queryString = queryParams.toString();
  const endpoint = `/products/category/${category}${queryString ? `?${queryString}` : ''}`;
  
  return fetchAPI(endpoint);
}

/**
 * Get single product by category and ID or code
 * @param {String} category - watches, clothes, bags, perfumes
 * @param {String|Number} idOrCode - Product ID or code
 */
export async function getProduct(category, idOrCode) {
  return fetchAPI(`/products/${category}/${idOrCode}`);
}

/**
 * Get product statistics (Admin)
 */
export async function getProductStats() {
  return fetchAPI('/products/stats/summary');
}

// =====================================================
// ORDERS API
// =====================================================

/**
 * Create new order
 * @param {Object} orderData - Order data with items, shipping address, etc.
 */
export async function createOrder(orderData) {
  return fetchAPI('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  });
}

/**
 * Get all orders (with optional filters)
 * @param {Object} filters - { userId, status, limit, offset }
 */
export async function getOrders(filters = {}) {
  const queryParams = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, value);
    }
  });

  const queryString = queryParams.toString();
  const endpoint = `/orders${queryString ? `?${queryString}` : ''}`;
  
  return fetchAPI(endpoint);
}

/**
 * Get single order by ID or order number
 * @param {String|Number} idOrOrderNumber
 */
export async function getOrder(idOrOrderNumber) {
  return fetchAPI(`/orders/${idOrOrderNumber}`);
}

/**
 * Update order status (Admin)
 * @param {Number} orderId
 * @param {String} status - pending, processing, shipped, delivered, cancelled
 */
export async function updateOrderStatus(orderId, status) {
  return fetchAPI(`/orders/${orderId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

/**
 * Update payment status (Admin)
 * @param {Number} orderId
 * @param {String} paymentStatus - pending, paid, failed, refunded
 */
export async function updatePaymentStatus(orderId, paymentStatus) {
  return fetchAPI(`/orders/${orderId}/payment-status`, {
    method: 'PATCH',
    body: JSON.stringify({ paymentStatus }),
  });
}

/**
 * Get order statistics (Admin)
 */
export async function getOrderStats() {
  return fetchAPI('/orders/stats/summary');
}

// =====================================================
// NOTIFY ME API
// =====================================================

/**
 * Create notification request for out-of-stock product
 * @param {Object} notifyData - { product, customer, location, method }
 */
export async function createNotifyRequest(notifyData) {
  return fetchAPI('/notify-me', {
    method: 'POST',
    body: JSON.stringify(notifyData),
  });
}

/**
 * Get all notification requests (Admin)
 * @param {Object} filters - { status, category, limit }
 */
export async function getNotifyRequests(filters = {}) {
  const queryParams = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, value);
    }
  });

  const queryString = queryParams.toString();
  const endpoint = `/notify-me${queryString ? `?${queryString}` : ''}`;
  
  return fetchAPI(endpoint);
}

/**
 * Mark notification as notified (Admin)
 * @param {Number} requestId
 */
export async function markAsNotified(requestId) {
  return fetchAPI(`/notify-me/${requestId}/notify`, {
    method: 'PATCH',
  });
}

/**
 * Get notification statistics (Admin)
 */
export async function getNotifyStats() {
  return fetchAPI('/notify-me/stats/summary');
}

// =====================================================
// AUTH API
// =====================================================

/**
 * Login user
 * @param {String} email
 * @param {String} password
 */
export async function login(email, password) {
  return fetchAPI('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

/**
 * Register new user
 * @param {Object} userData - { name, email, password, role }
 */
export async function register(userData) {
  return fetchAPI('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

/**
 * Get current user
 * @param {String} token - JWT token
 */
export async function getCurrentUser(token) {
  return fetchAPI('/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

/**
 * Change password
 * @param {String} token - JWT token
 * @param {String} currentPassword
 * @param {String} newPassword
 */
export async function changePassword(token, currentPassword, newPassword) {
  return fetchAPI('/auth/change-password', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

// =====================================================
// HELPER FUNCTIONS
// =====================================================

/**
 * Format price from API (removes $ and converts to number)
 * @param {String} price - "$499.00"
 * @returns {Number} - 499.00
 */
export function formatPrice(price) {
  if (typeof price === 'number') return price;
  return parseFloat(price.replace(/[^0-9.]/g, '')) || 0;
}

/**
 * Get category from product code
 * @param {String} code - "W-EMP-001-M"
 * @returns {String} - "watches"
 */
export function getCategoryFromCode(code) {
  const prefix = code.charAt(0).toUpperCase();
  const categoryMap = {
    'W': 'watches',
    'C': 'clothes',
    'B': 'bags',
    'P': 'perfumes',
  };
  return categoryMap[prefix] || 'watches';
}

export default {
  getAllProducts,
  getProductsByCategory,
  getProduct,
  getProductStats,
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  updatePaymentStatus,
  getOrderStats,
  createNotifyRequest,
  getNotifyRequests,
  markAsNotified,
  getNotifyStats,
  login,
  register,
  getCurrentUser,
  changePassword,
  formatPrice,
  getCategoryFromCode,
};