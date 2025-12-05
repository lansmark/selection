// src/pages/Product/ProductPages.jsx
import React from "react";
import { useParams } from "react-router-dom";
import { useProduct } from "../../hooks/useProduct";
import { useCart } from "../../context/CartContext";

const ProductPage = () => {
  const { id } = useParams();
  const { product, loading } = useProduct(id);
  const { addToCart } = useCart();

  if (loading) return <div className="p-6">Loading...</div>;
  if (!product) return <div className="p-6">Not found</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 md:grid md:grid-cols-2 gap-8">
      <div>
        <img src={product.images[0]} className="w-full h-[420px] object-contain" alt="" />
      </div>
      <div>
        <h1 className="text-2xl font-bold">{product.name}</h1>
        <div className="text-2xl font-semibold">{product.currency} {(product.price_cents / 100).toFixed(2)}</div>
        <p className="mt-4">{product.description}</p>
        <div className="mt-6">
          <button
            onClick={() => addToCart(product, 1, null)}
            className="bg-red-600 text-white px-6 py-3 rounded"
          >
            Add to select-brand
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;