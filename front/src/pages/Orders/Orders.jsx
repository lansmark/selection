// src/pages/Orders/Orders.jsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { IoIosStar } from "react-icons/io";

const Orders = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  // accept multiple possible property names in state (watch/product/perfume/bag)
  const product = state?.product ?? state?.watch ?? state?.bag ?? state?.perfume ?? state?.item;

  // fallback to a safe demo product if nothing provided (prevents crash on direct load)
  const demoProduct = {
    title: "Sample Product",
    price: "EGP 0",
    rating: 90,
    stars: 4.5,
    size: "One Size",
    color: "Black",
    images: [
      "/assets/placeholder/placeholder-1.png",
      "/assets/placeholder/placeholder-2.png",
    ],
    stock: 10,
    features: [
      "Premium quality",
      "Secure packaging",
      "30-day returns",
    ],
    description: "This is a demo product because no product was passed to Orders page. Navigate from a product card to see real data.",
  };

  const p = product || demoProduct;

  // Normalize images: support imageFront/imageBack or images array or image key names
  const images = (() => {
    if (Array.isArray(p.images) && p.images.length) return p.images;
    const arr = [];
    if (p.imageFront) arr.push(p.imageFront);
    if (p.imageBack) arr.push(p.imageBack);
    if (p.images?.length) return p.images;
    if (arr.length) return arr;
    // fallback placeholders
    return ["/assets/placeholder/placeholder-1.png"];
  })();

  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState(p.size ?? "One Size");
  const [color, setColor] = useState(p.color ?? (p.colors ? p.colors[0] : "Default"));

  const increaseQty = () => setQty((q) => q + 1);
  const decreaseQty = () => setQty((q) => (q > 1 ? q - 1 : 1));

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: IMAGES (col-span 7) */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border overflow-hidden bg-white dark:bg-gray-800 shadow">
              <div className="flex items-center justify-center h-[520px] bg-gray-50 dark:bg-gray-900">
                <img src={selectedImage} alt={p.title} className="max-h-full object-contain" />
              </div>
            </div>
            {/* Thumbnails */}
            <div className="flex gap-3 mt-4 overflow-x-auto">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`border rounded-xl h-20 w-20 shrink-0 overflow-hidden ${
                    selectedImage === img ? "ring-2 ring-yellow-400" : "border-gray-200"
                  }`}
                >
                  <img src={img} alt={`${p.title} ${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            {/* Product description & details */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold">Product description</h3>
              <p className="mt-2 text-gray-700 dark:text-gray-300">{p.description ?? p.about}</p>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold">Features</h4>
                  <ul className="list-disc pl-5 mt-2 text-gray-700 dark:text-gray-300">
                    {(p.features || []).map((f, idx) => (
                      <li key={idx}>{f}</li>
                    ))}
                    {!p.features && <li>{p.about ?? "High quality and durable."}</li>}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold">Shipping & Returns</h4>
                  <p className="mt-2 text-gray-700 dark:text-gray-300">
                    Ships from: <span className="font-semibold">UFree Warehouse</span>
                  </p>
                  <p className="mt-1 text-gray-700 dark:text-gray-300">Return policy: 30 days</p>
                </div>
              </div>
            </div>
          </div>
          {/* RIGHT: DETAILS (col-span 5) */}
          <aside className="lg:col-span-5">
            <div className="sticky top-20 space-y-6">
              {/* Title & rating */}
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold">{p.title}</h1>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-1">
                    <IoIosStar className="text-yellow-400" />
                    <span className="font-medium">{p.stars ?? (Math.round((p.rating ?? 90) / 20) * 1) ?? 4.5}</span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">{p.rating ?? 90}% recommend</div>
                  <div className="text-sm text-gray-500">| SKU: {p.sku ?? `#${p.id ?? "000"}`}</div>
                </div>
              </div>
              {/* Price & availability */}
              <div>
                <div className="text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white">{p.price}</div>
                <div className="mt-2 text-sm">
                  <span className={`font-medium ${p.stock > 0 ? "text-green-600" : "text-red-600"}`}>
                    {p.stock > 0 ? "In stock" : "Out of stock"}
                  </span>
                  <span className="ml-3 text-gray-500">| Sold by <strong>UStore</strong></span>
                </div>
              </div>
              {/* Options: size / color */}
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-semibold mb-2">Size</div>
                  <div className="flex gap-2">
                    {/* if sizes array exists, map it, else show the single size */}
                    {(p.sizes || [p.size]).map((s, i) => (
                      <button
                        key={i}
                        onClick={() => setSize(s)}
                        className={`px-4 py-2 rounded-xl border ${
                          size === s ? "border-black bg-black text-white" : "border-gray-200"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-semibold mb-2">Color</div>
                  <div className="flex gap-2 items-center">
                    {(p.colors || [p.color]).map((c, i) => (
                      <button
                        key={i}
                        onClick={() => setColor(c)}
                        className={`px-4 py-2 rounded-xl border ${
                          color === c ? "border-black bg-black text-white" : "border-gray-200"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              {/* Quantity and add / buy */}
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-xl">
                  <button onClick={decreaseQty} className="px-3 py-2">
                    <FaMinus />
                  </button>
                  <div className="px-4 font-semibold">{qty}</div>
                  <button onClick={increaseQty} className="px-3 py-2">
                    <FaPlus />
                  </button>
                </div>
                <div className="flex-1 grid grid-cols-1 gap-3">
                  <button
                    onClick={() => {
                      // add to cart: you can implement your add-to-cart logic here
                      alert("Added to cart (demo)");
                    }}
                    className="w-full bg-white border border-gray-300 rounded-xl py-3 font-semibold"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => {
                      // go to checkout or payment
                      navigate("/checkout", { state: { product: p, qty, size, color } });
                    }}
                    className="w-full bg-yellow-500 text-black py-3 rounded-xl font-semibold hover:opacity-95"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
              {/* Stock notice */}
              <div className="text-sm text-gray-600">
                Only <strong>{p.stock ?? 10}</strong> left in stock — order soon.
              </div>
              {/* Payment & shipping icons */}
              <div className="flex gap-4 items-center">
                <img src="/assets/ui/visa.png" alt="visa" className="h-8" />
                <img src="/assets/ui/mastercard.png" alt="mc" className="h-8" />
                <img src="/assets/ui/paypal.png" alt="pp" className="h-8" />
                <div className="ml-auto text-sm text-gray-500">Secure transaction</div>
              </div>
              {/* Seller & Delivery */}
              <div className="border-t pt-4">
                <div className="text-sm">
                  <div className="font-semibold">Delivery</div>
                  <div className="text-gray-600 mt-1">Standard: 3-7 business days</div>
                </div>
              </div>
              {/* Reviews preview */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-600">Customer Reviews</div>
                    <div className="font-semibold text-lg">{p.rating ?? 90}% positive</div>
                  </div>
                  <div>
                    <button className="text-sm underline">See all</button>
                  </div>
                </div>
                <div className="mt-3 space-y-3">
                  <div className="bg-gray-50 p-3 rounded">
                    <div className="text-sm font-semibold">Ahmed K.</div>
                    <div className="text-sm text-gray-600">"Great quality, fast delivery."</div>
                  </div>
                </div>
              </div>
              {/* Recommended */}
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">You may also like</h4>
                <div className="flex gap-3 overflow-x-auto py-2">
                  {/* small recommended cards - demo placeholders */}
                  <div className="w-40 bg-white rounded-xl border p-3">
                    <img src="/assets/placeholder/placeholder-1.png" className="w-full h-28 object-cover rounded" />
                    <div className="mt-2 text-sm font-medium">Related item</div>
                    <div className="text-sm text-gray-600">$99</div>
                  </div>
                  <div className="w-40 bg-white rounded-xl border p-3">
                    <img src="/assets/placeholder/placeholder-2.png" className="w-full h-28 object-cover rounded" />
                    <div className="mt-2 text-sm font-medium">Related item</div>
                    <div className="text-sm text-gray-600">$129</div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
      {/* Mobile sticky buy bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-3 lg:hidden z-50">
        <div className="container mx-auto px-4 flex items-center gap-4">
          <div className="flex-1">
            <div className="text-sm text-gray-500">Price</div>
            <div className="font-semibold text-lg">{p.price}</div>
          </div>
          <button
            onClick={() => navigate("/checkout", { state: { product: p, qty, size, color } })}
            className="bg-yellow-500 text-black px-6 py-3 rounded-xl font-semibold"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Orders;