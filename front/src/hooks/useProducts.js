// src/hooks/useProducts.js
import { useState, useEffect } from 'react';
import { getAllProducts, getProductsByCategory, getProduct, getOrders, getOrder } from '../services/api';

/**
 * Hook to fetch all products with optional filters
 * @param {Object} filters - { category, gender, brand, etc. }
 * @param {Boolean} immediate - Whether to fetch immediately on mount
 */
export function useProducts(filters = {}, immediate = true) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const fetchProducts = async (customFilters = filters) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllProducts(customFilters);
      setProducts(response.products || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (immediate) {
      fetchProducts();
    }
  }, [JSON.stringify(filters), immediate]);

  return { products, loading, error, refetch: fetchProducts };
}

/**
 * Hook to fetch products by category
 * @param {String} category - watches, clothes, bags, perfumes
 * @param {Object} filters - { gender, brand, etc. }
 * @param {Boolean} immediate - Whether to fetch immediately on mount
 */
export function useProductsByCategory(category, filters = {}, immediate = true) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const fetchProducts = async (customFilters = filters) => {
    if (!category) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await getProductsByCategory(category, customFilters);
      setProducts(response.products || []);
    } catch (err) {
      setError(err.message);
      console.error(`Error fetching ${category}:`, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (immediate && category) {
      fetchProducts();
    }
  }, [category, JSON.stringify(filters), immediate]);

  return { products, loading, error, refetch: fetchProducts };
}

/**
 * Hook to fetch single product
 * @param {String} category - watches, clothes, bags, perfumes
 * @param {String|Number} idOrCode - Product ID or code
 * @param {Boolean} immediate - Whether to fetch immediately on mount
 */
export function useProduct(category, idOrCode, immediate = true) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const fetchProduct = async () => {
    if (!category || !idOrCode) return;

    try {
      setLoading(true);
      setError(null);
      const response = await getProduct(category, idOrCode);
      setProduct(response.product || null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (immediate && category && idOrCode) {
      fetchProduct();
    }
  }, [category, idOrCode, immediate]);

  return { product, loading, error, refetch: fetchProduct };
}

/**
 * Hook to fetch orders
 * @param {Object} filters - { userId, status, limit, offset }
 */
export function useOrders(filters = {}) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async (customFilters = filters) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getOrders(customFilters);
      setOrders(response.orders || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [JSON.stringify(filters)]);

  return { orders, loading, error, refetch: fetchOrders };
}

/**
 * Hook to fetch single order
 * @param {String|Number} idOrOrderNumber
 */
export function useOrder(idOrOrderNumber) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrder = async () => {
    if (!idOrOrderNumber) return;

    try {
      setLoading(true);
      setError(null);
      const response = await getOrder(idOrOrderNumber);
      setOrder(response.order || null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching order:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (idOrOrderNumber) {
      fetchOrder();
    }
  }, [idOrOrderNumber]);

  return { order, loading, error, refetch: fetchOrder };
}

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