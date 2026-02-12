// src/context/CartContext.jsx - FIXED VERSION
import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Load cart from localStorage on mount
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('shopping_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
      return [];
    }
  });
  
  const [showModal, setShowModal] = useState(false);
  const [addedProduct, setAddedProduct] = useState(null);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('shopping_cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
    }
  }, [cart]);

  /**
   * Add item to cart with proper unique ID
   * @param {Object} product - Product object
   * @param {Number} quantity - Quantity to add (default: 1)
   * @param {String} size - Selected size
   * @param {String} color - Selected color
   */
  const addToCart = (product, quantity = 1, size, color) => {
    // Generate unique cart ID based on product + variant
    const cartId = `${product.id}-${size || 'default'}-${color || 'default'}-${Date.now()}`;
    
    const cartItem = {
      ...product,
      cartId, // Unique identifier for this cart entry
      quantity: Number(quantity), // Ensure it's a number
      size: size || product.size || 'One Size',
      color: color || product.color || 'Default',
      addedAt: new Date().toISOString()
    };

    setCart((prev) => [...prev, cartItem]);
    setAddedProduct(product);
    setShowModal(true);

    setTimeout(() => setShowModal(false), 2500);
  };

  /**
   * Remove item from cart by cartId
   * @param {String} cartId - Unique cart identifier
   */
  const removeFromCart = (cartId) => {
    setCart((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  /**
   * Update quantity of item in cart
   * @param {String} cartId - Unique cart identifier
   * @param {Number} newQuantity - New quantity value
   */
  const updateQuantity = (cartId, newQuantity) => {
    const qty = Number(newQuantity);
    
    if (qty < 1) {
      console.warn('Quantity must be at least 1');
      return;
    }
    
    setCart((prev) =>
      prev.map((item) =>
        item.cartId === cartId
          ? { ...item, quantity: qty }
          : item
      )
    );
  };

  /**
   * Clear entire cart
   */
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('shopping_cart');
  };

  /**
   * Get total number of items (sum of all quantities)
   */
  const getTotalItems = () => {
    return cart.reduce((total, item) => total + (item.quantity || 1), 0);
  };

  /**
   * Get subtotal of cart (without shipping)
   */
  const getSubtotal = () => {
    return cart.reduce((sum, item) => {
      const price = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
      const quantity = item.quantity || 1;
      return sum + (price * quantity);
    }, 0);
  };

  /**
   * Check if product variant already exists in cart
   * @param {String} productId - Product ID
   * @param {String} size - Size variant
   * @param {String} color - Color variant
   */
  const isInCart = (productId, size, color) => {
    return cart.some(item => 
      item.id === productId && 
      item.size === (size || 'One Size') && 
      item.color === (color || 'Default')
    );
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartItems: cart, // Backward compatibility
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getSubtotal,
        isInCart,
        cartCount: getTotalItems(), // Total quantity, not just array length
        showModal,
        addedProduct,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

