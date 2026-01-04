import React from "react"; 
import { useCart } from "../../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { FaHeart, FaShippingFast, FaLock } from "react-icons/fa";
import { IoMdArrowBack } from "react-icons/io";
import { MdDelete } from "react-icons/md";

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  const subtotal = cart.reduce((sum, item) => {
    const price = parseFloat(item.price.replace(/[^0-9.-]+/g, ""));
    const quantity = item.quantity || 1;
    return sum + (price * quantity);
  }, 0);

  const handleQuantityChange = (itemId, newQty) => {
    if (newQty > 0 && updateQuantity) {
      updateQuantity(itemId, newQty);
    }
  };

  return (
    <div className="min-h-screen section">
      {/* Elegant Header */}
      <div className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 shadow-sm">
        <div className="app-container -mt-10 py-4">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-brand-yellow dark:hover:text-brand-yellow transition-all duration-300 group"
          >
            <IoMdArrowBack className="text-xl group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-medium">Continue Shopping</span>
          </button>
        </div>
      </div>

      <div className="app-container py-8">
        {/* Luxury Title Section */}
        <div className="text-center mb-12 animate-selectBrandFade">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 text-gray-900 dark:text-white">
            Shopping Cart
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {cart.length} {cart.length === 1 ? 'item' : 'items'} in your luxury selection
          </p>
        </div>

        {cart.length === 0 ? (
          /* Premium Empty State */
          <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-12 text-center animate-selectBrandSlideUp border border-gray-100 dark:border-gray-700">
              <div className="w-40 h-40 mx-auto mb-8 bg-linear-to-br from-brand-yellow/20 to-brand-yellow/5 rounded-full flex items-center justify-center">
                <svg className="w-20 h-20 text-brand-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold mb-3 text-gray-900 dark:text-white">
                Your cart awaits
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
                Begin your luxury shopping experience
              </p>
              <Link to="/">
                <button className="bg-brand-yellow hover:bg-yellow-500 text-black font-bold px-10 py-4 rounded-full transition-all duration-300 hover:animate-selectBrandLift shadow-lg hover:shadow-xl">
                  Explore Collections
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Cart Items - 8 columns */}
            <div className="lg:col-span-8 space-y-6 animate-selectBrandSlideUp">
              {cart.map((item, index) => {
                const stock = item.stock ?? 10;
                const isOutOfStock = stock === 0;
                const isLowStock = stock > 0 && stock <= 5;
                const quantity = item.quantity || 1;
                const itemPrice = parseFloat(item.price.replace(/[^0-9.-]+/g, ""));
                const itemTotal = itemPrice * quantity;

                return (
                  <div 
                    key={`${item.id}-${item.size}-${item.color}`} 
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 dark:border-gray-700 group"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="p-6">
                      <div className="flex gap-6">
                        {/* Premium Product Image */}
                        <div className="w-40 h-40 shrink-0 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 group-hover:border-brand-yellow transition-all duration-500">
                          <img
                            src={item.imageFront || item.images?.[0]}
                            alt={item.name || item.title}
                            className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-700"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 flex flex-col">
                          <div className="flex justify-between gap-4 mb-3">
                            <div className="flex-1">
                              {/* Brand/Code */}
                              {(item.code || item.brand) && (
                                <p className="text-xs font-semibold text-brand-yellow mb-2 tracking-wider uppercase">
                                  {item.code || item.brand}
                                </p>
                              )}
                              
                              {/* Product Name */}
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 leading-tight group-hover:text-brand-yellow transition-colors duration-300">
                                {item.name || item.title}
                              </h3>
                              
                              {/* Size & Color */}
                              <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                                {item.size && (
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">Size:</span>
                                    <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-semibold">
                                      {item.size}
                                    </span>
                                  </div>
                                )}
                                {item.color && (
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">Color:</span>
                                    <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-semibold">
                                      {item.color}
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Stock Status */}
                              <div className="mb-4">
                                {isOutOfStock ? (
                                  <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-full">
                                    <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                                    Out of Stock
                                  </span>
                                ) : isLowStock ? (
                                  <span className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 bg-orange-50 dark:bg-orange-900/20 px-3 py-1.5 rounded-full">
                                    <span className="w-2 h-2 bg-orange-600 rounded-full animate-pulse"></span>
                                    Only {stock} Left
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-full">
                                    <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                                    In Stock
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Price */}
                            <div className="text-right">
                              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                                EGP {itemTotal.toFixed(2)}
                              </div>
                              {quantity > 1 && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                  {quantity} × EGP {itemPrice.toFixed(2)}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Actions Row */}
                          <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
                            {/* Quantity Selector */}
                            <div className="flex items-center gap-4">
                              <div className="flex items-center border-2 border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden hover:border-brand-yellow transition-colors duration-300">
                                <button
                                  onClick={() => handleQuantityChange(item.id, quantity - 1)}
                                  className="px-4 py-2 hover:bg-brand-yellow hover:text-black transition-colors duration-300 disabled:opacity-30 disabled:cursor-not-allowed font-bold text-lg"
                                  disabled={isOutOfStock || quantity <= 1}
                                >
                                  −
                                </button>
                                <span className="px-6 py-2 font-bold text-lg border-x-2 border-gray-200 dark:border-gray-600 min-w-16 text-center">
                                  {quantity}
                                </span>
                                <button
                                  onClick={() => handleQuantityChange(item.id, quantity + 1)}
                                  className="px-4 py-2 hover:bg-brand-yellow hover:text-black transition-colors duration-300 disabled:opacity-30 disabled:cursor-not-allowed font-bold text-lg"
                                  disabled={isOutOfStock || quantity >= stock}
                                >
                                  +
                                </button>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-3">
                              <button className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-300 px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
                                <FaHeart />
                                <span className="hidden sm:inline">Wishlist</span>
                              </button>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700 dark:hover:text-red-500 transition-colors duration-300 px-4 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                              >
                                <MdDelete className="text-lg" />
                                <span>Remove</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary Sidebar - 4 columns */}
            <div className="lg:col-span-4">
              <div className="sticky top-24 space-y-6 animate-selectBrandFade">
                {/* Summary Card */}
                <div className="bg-linear-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl p-8 text-white">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <FaLock className="text-brand-yellow" />
                    Order Summary
                  </h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-gray-300">
                      <span>Subtotal</span>
                      <span className="font-bold">EGP {subtotal.toFixed(2)}</span>
                    </div>
                    
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                      <p className="text-blue-300 text-sm flex items-center gap-2">
                        <FaShippingFast />
                        <span>Shipping to be added according to the distance</span>
                      </p>
                    </div>
                  </div>

                  <Link to="/checkout/address">
                    <button className="w-full bg-brand-yellow hover:bg-yellow-500 text-black font-bold py-4 rounded-xl transition-all duration-300 hover:animate-selectBrandLift shadow-lg hover:shadow-2xl flex items-center justify-center gap-2 text-lg">
                      <FaLock />
                      Proceed to Checkout
                    </button>
                  </Link>

                  <div className="mt-6 flex items-center justify-center gap-3 text-xs text-gray-400">
                    <img src="/assets/ui/visa.png" alt="Visa" className="h-6 opacity-70" />
                    <img src="/assets/ui/mastercard.png" alt="Mastercard" className="h-6 opacity-70" />
                    <img src="/assets/ui/paypal.png" alt="PayPal" className="h-6 opacity-70" />
                  </div>
                </div>

                {/* Benefits Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="font-bold mb-4 text-gray-900 dark:text-white">Why Shop With Us</h3>
                  <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-start gap-3">
                      <span className="text-green-500 text-lg">✓</span>
                      <span>Secure payments & data protection</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-green-500 text-lg">✓</span>
                      <span>Fast delivery within 3-7 business days</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-green-500 text-lg">✓</span>
                      <span>30-day hassle-free returns</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-green-500 text-lg">✓</span>
                      <span>24/7 customer support</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Floating Checkout Bar */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-2xl p-4 lg:hidden z-50 animate-selectBrandSlideUp">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Subtotal</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">EGP {subtotal.toFixed(2)}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 italic">+ shipping</p>
            </div>
            <Link to="/checkout/address" className="flex-1 max-w-[200px]">
              <button className="w-full bg-brand-yellow hover:bg-yellow-500 text-black font-bold py-4 rounded-xl transition-all duration-300 shadow-lg">
                Checkout
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;