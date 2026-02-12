// src/hooks/useBrands.js
import { useState, useEffect } from 'react';

/**
 * Hook to extract unique brands from products
 * @param {Array} products - Array of products
 */
export function useBrands(products) {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    if (!products || products.length === 0) {
      setBrands([]);
      return;
    }

    const uniqueBrands = Array.from(
      new Set(products.map((p) => p.brand?.toLowerCase()).filter(Boolean))
    );
    
    setBrands(uniqueBrands);
  }, [products]);

  return brands;
}