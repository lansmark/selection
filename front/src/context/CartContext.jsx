// src/context/CartContext.jsx
import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]); // 👈 Renamed to 'cart' for consistency
  const [showModal, setShowModal] = useState(false);
  const [addedProduct, setAddedProduct] = useState(null);

  // 👇 Updated to handle both old and new API
  const addToCart = (product, qty = 1, size, color) => {
    // Support both ways of calling:
    // 1. addToCart(product, qty, size, color) - old way
    // 2. addToCart({ ...product, quantity, selectedSize, selectedColor }) - new way
    
    const item = typeof qty === 'number' 
      ? { ...product, qty, size, color, id: product.id || Date.now() }
      : { ...product, id: product.id || Date.now() }; // qty is actually the whole object in new way

    setCart((prev) => [...prev, item]);

    setAddedProduct(product);
    setShowModal(true);

    setTimeout(() => setShowModal(false), 2500);
  };

  // 👇 Remove item from cart by id
  const removeFromCart = (itemId) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  };

  // 👇 Update quantity of an item in cart
  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return; // Don't allow quantity less than 1
    
    setCart((prev) => 
      prev.map((item) => 
        item.id === itemId 
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  // 👇 Clear entire cart
  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,              // 👈 Now exports 'cart' instead of 'cartItems'
        cartItems: cart,   // 👈 Keep backward compatibility
        addToCart,
        removeFromCart,
        updateQuantity,    // 👈 Export updateQuantity
        clearCart,
        cartCount: cart.length,
        showModal,
        addedProduct,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);