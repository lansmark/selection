// src/context/CartContext.jsx
import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [addedProduct, setAddedProduct] = useState(null);

  const addToCart = (product, qty = 1, size, color) => {
    setCartItems((prev) => [
      ...prev,
      { ...product, qty, size, color }
    ]);

    setAddedProduct(product);
    setShowModal(true);

    setTimeout(() => setShowModal(false), 2500); // auto-close (same behavior as screenshot)
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        cartCount: cartItems.length,
        showModal,
        addedProduct,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
