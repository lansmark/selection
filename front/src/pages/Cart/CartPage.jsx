import React from "react"; 
import { useCart } from "../../context/CartContext";
import { Link } from "react-router-dom";

const CartPage = () => {
  const { cart, removeFromCart } = useCart();

  const subtotal = cart.reduce(
    (sum, item) => sum + parseFloat(item.price.replace("$", "")),
    0
  );

  return (
    <div className="min-h-screen bg-gray-100 pb-28">
      {/* ---------------- TOP PROGRESS BAR ---------------- */}
      <div className="w-full bg-white p-4 border-b sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-semibold">My Cart</h1>

          <div className="flex items-center gap-4 text-sm">
            <span className="font-semibold text-blue-600">Cart</span>
            <span>›</span>
            <span>Address</span>
            <span>›</span>
            <span>Payment</span>
          </div>
        </div>
      </div>

      {/* ---------------- MAIN LAYOUT ---------------- */}
      <div className="max-w-6xl mx-auto mt-5 grid grid-cols-1 md:grid-cols-3 gap-6 px-3 md:px-0">

        {/* ---------------- LEFT: CART ITEMS ---------------- */}
        <div className="md:col-span-2 space-y-4">
          {cart.length === 0 ? (
            <div className="bg-white p-6 rounded-xl shadow text-center">
              <p className="text-gray-500 text-lg">Your cart is empty.</p>
              <Link to="/">
                <button className="mt-4 bg-black text-white px-6 py-3 rounded-xl">
                  Continue Shopping
                </button>
              </Link>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow p-4 flex items-center gap-4"
              >
                <img
                  src={item.imageFront}
                  alt={item.name}
                  className="w-28 h-28 object-contain rounded-lg"
                />

                <div className="flex-1">
                  <h2 className="font-semibold text-lg">{item.name}</h2>
                  <p className="text-gray-500">{item.brand}</p>
                  <p className="text-xl font-bold mt-2">{item.price}</p>

                  <button
                    className="mt-3 text-red-600 font-semibold hover:underline"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ---------------- RIGHT: ORDER SUMMARY ---------------- */}
        <div className="bg-white rounded-xl shadow p-5 h-fit sticky top-20">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

          <div className="flex justify-between text-gray-700 mb-2">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-gray-700 mb-2">
            <span>Shipping</span>
            <span className="text-green-600">FREE</span>
          </div>

          <hr className="my-3" />

          <div className="flex justify-between text-lg font-bold mb-4">
            <span>Total</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          {/* Checkout Button */}
          <button className="w-full bg-red-600 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:animate-selectBrandLift active:scale-95">
            Proceed to Checkout
          </button>
        </div>
      </div>

      {/* ---------------- MOBILE BOTTOM BUY BAR ---------------- */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 w-full bg-white shadow-xl p-4 flex items-center justify-between md:hidden z-50">
          <div>
            <p className="text-gray-500 text-sm">Total</p>
            <p className="text-xl font-bold">${subtotal.toFixed(2)}</p>
          </div>

          <button className="bg-red-600 text-white px-6 py-3 rounded-xl font-semibold text-lg">
            Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default CartPage;
