// src/pages/Orders/Orders.jsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { IoIosStar } from "react-icons/io";
import { useCart } from "../../context/CartContext";

const Orders = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const product = state?.product ?? state?.watch ?? state?.bag ?? state?.perfume ?? state?.item;

  const demoProduct = {
    id: "demo-001",
    name: "Sample Product",
    title: "Sample Product",
    brand: "Demo Brand",
    price: "$0",
    rating: 90,
    stars: 4.5,
    size: "One Size",
    color: "Black",
    imageFront: "/assets/placeholder/placeholder-1.png",
    imageBack: "/assets/placeholder/placeholder-2.png",
    images: ["/assets/placeholder/placeholder-1.png"],
    stock: 10,
    features: ["Premium quality", "Secure packaging", "30-day returns"],
    description: "This is a demo product.",
  };

  const p = product || demoProduct;

  const images = (() => {
    if (Array.isArray(p.images) && p.images.length) return p.images;
    const arr = [];
    if (p.imageFront) arr.push(p.imageFront);
    if (p.imageBack) arr.push(p.imageBack);
    if (arr.length) return arr;
    return ["/assets/placeholder/placeholder-1.png"];
  })();

  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState(p.size ?? "One Size");
  const [color, setColor] = useState(p.color ?? (p.colors ? p.colors[0] : "Default"));

  const stock = p.stock ?? 10;
  const isOutOfStock = stock === 0;
  const isLowStock = stock > 0 && stock <= 5;

  const increaseQty = () => {
    if (qty < stock) {
      setQty((q) => q + 1);
    }
  };
  
  const decreaseQty = () => setQty((q) => (q > 1 ? q - 1 : 1));

  const handleAddToCart = () => {
    if (isOutOfStock) {
      alert("Sorry, this item is out of stock!");
      return;
    }

    // Create cart item with quantity property
    const cartItem = {
      id: `${p.id}-${Date.now()}`, // Unique ID for each cart entry
      name: p.name || p.title,
      brand: p.brand,
      code: p.code,
      price: p.price,
      imageFront: p.imageFront || images[0],
      imageBack: p.imageBack || images[1],
      images: images,
      quantity: qty, // Use 'quantity' instead of 'qty'
      size: size,
      color: color,
      stock: stock,
    };
    
    addToCart(cartItem);
    
    // Navigate to cart after adding
    navigate("/cart");
  };

  const handleBuyNow = () => {
    if (isOutOfStock) {
      alert("Sorry, this item is out of stock!");
      return;
    }

    const cartItem = {
      id: `${p.id}-${Date.now()}`,
      name: p.name || p.title,
      brand: p.brand,
      code: p.code,
      price: p.price,
      imageFront: p.imageFront || images[0],
      imageBack: p.imageBack || images[1],
      images: images,
      quantity: qty,
      size: size,
      color: color,
      stock: stock,
    };
    
    addToCart(cartItem);
    navigate("/cart");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: IMAGES */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border overflow-hidden bg-white dark:bg-gray-800 shadow relative">
              {isOutOfStock && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
                  <span className="text-white text-3xl font-bold">OUT OF STOCK</span>
                </div>
              )}
              <div className="flex items-center justify-center h-[520px] bg-gray-50 dark:bg-gray-900">
                <img src={selectedImage} alt={p.title || p.name} className="max-h-full object-contain" />
              </div>
            </div>
            
            <div className="flex gap-3 mt-4 overflow-x-auto">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`border rounded-xl h-20 w-20 shrink-0 overflow-hidden ${
                    selectedImage === img ? "ring-2 ring-yellow-400" : "border-gray-200"
                  }`}
                >
                  <img src={img} alt={`${p.title || p.name} ${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-semibold">Product description</h3>
              <p className="mt-2 text-gray-700 dark:text-gray-300">{p.description ?? p.about ?? "High quality product."}</p>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold">Features</h4>
                  <ul className="list-disc pl-5 mt-2 text-gray-700 dark:text-gray-300">
                    {(p.features || ["High quality and durable"]).map((f, idx) => (
                      <li key={idx}>{f}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold">Shipping & Returns</h4>
                  <p className="mt-2 text-gray-700 dark:text-gray-300">
                    Ships from: <span className="font-semibold">UStore Warehouse</span>
                  </p>
                  <p className="mt-1 text-gray-700 dark:text-gray-300">Return policy: 30 days</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: DETAILS */}
          <aside className="lg:col-span-5">
            <div className="sticky top-20 space-y-6">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold">{p.title || p.name}</h1>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-1">
                    <IoIosStar className="text-yellow-400" />
                    <span className="font-medium">{p.stars ?? 4.5}</span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">{p.rating ?? 90}% recommend</div>
                  <div className="text-sm text-gray-500">| SKU: {p.code ?? p.sku ?? `#${p.id ?? "000"}`}</div>
                </div>
              </div>

              <div>
                <div className="text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white">{p.price}</div>
                <div className="mt-2 text-sm flex items-center gap-2">
                  {isOutOfStock ? (
                    <span className="font-medium text-red-600 bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-full">
                      Out of Stock
                    </span>
                  ) : isLowStock ? (
                    <span className="font-medium text-orange-600 bg-orange-50 dark:bg-orange-900/20 px-3 py-1 rounded-full">
                      Low Stock - Only {stock} left!
                    </span>
                  ) : (
                    <span className="font-medium text-green-600 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full">
                      In Stock ({stock} available)
                    </span>
                  )}
                  <span className="text-gray-500">| Sold by <strong>Selection</strong></span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-sm font-semibold mb-2">Size</div>
                  <div className="flex gap-2 flex-wrap">
                    {(p.sizes || [p.size || "One Size"]).map((s, i) => (
                      <button
                        key={i}
                        onClick={() => setSize(s)}
                        disabled={isOutOfStock}
                        className={`px-4 py-2 rounded-xl border ${
                          size === s ? "border-black bg-black text-white" : "border-gray-200 hover:border-gray-400"
                        } ${isOutOfStock ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-semibold mb-2">Color</div>
                  <div className="flex gap-2 items-center flex-wrap">
                    {(p.colors || [p.color || "Default"]).map((c, i) => (
                      <button
                        key={i}
                        onClick={() => setColor(c)}
                        disabled={isOutOfStock}
                        className={`px-4 py-2 rounded-xl border ${
                          color === c ? "border-black bg-black text-white" : "border-gray-200 hover:border-gray-400"
                        } ${isOutOfStock ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-xl">
                  <button 
                    onClick={decreaseQty} 
                    disabled={isOutOfStock}
                    className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaMinus />
                  </button>
                  <div className="px-4 font-semibold">{qty}</div>
                  <button 
                    onClick={increaseQty} 
                    disabled={isOutOfStock || qty >= stock}
                    className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaPlus />
                  </button>
                </div>
                <div className="flex-1 grid grid-cols-1 gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className={`w-full border rounded-xl py-3 font-semibold transition ${
                      isOutOfStock
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                  </button>
                  <button
                    onClick={handleBuyNow}
                    disabled={isOutOfStock}
                    className={`w-full py-3 rounded-xl font-semibold transition ${
                      isOutOfStock
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-yellow-500 text-black hover:bg-yellow-600"
                    }`}
                  >
                    Buy Now
                  </button>
                </div>
              </div>

              {!isOutOfStock && (
                <div className="text-sm">
                  {isLowStock ? (
                    <p className="text-orange-600 font-semibold">
                      ⚠️ Hurry! Only {stock} left in stock — order soon.
                    </p>
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400">
                      {stock} items available
                    </p>
                  )}
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile sticky buy bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t p-3 lg:hidden z-50">
        <div className="container mx-auto px-4 flex items-center gap-4">
          <div className="flex-1">
            <div className="text-sm text-gray-500 dark:text-gray-400">Price</div>
            <div className="font-semibold text-lg">{p.price}</div>
          </div>
          <button
            onClick={handleBuyNow}
            disabled={isOutOfStock}
            className={`px-6 py-3 rounded-xl font-semibold ${
              isOutOfStock
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-yellow-500 text-black"
            }`}
          >
            {isOutOfStock ? "Out of Stock" : "Buy Now"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Orders;