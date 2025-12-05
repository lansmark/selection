import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const PaymentPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { cart } = useCart();

  const subtotal = cart.reduce(
    (sum, item) => sum + parseFloat(item.price.replace("$", "")),
    0
  );

  const handlePlaceOrder = () => {
    navigate("/checkout/confirmation", {
      state: { address: state.address, total: subtotal },
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      {/* Top Bar */}
      <div className="w-full bg-white p-4 border-b sticky top-0 z-40">
        <div className="max-w-5xl mx-auto flex items-center gap-4 text-sm">
          <Link to="/cart" className="text-gray-600">Cart</Link>
          <span>›</span>
          <Link to="/checkout/address" className="text-gray-600">Address</Link>
          <span>›</span>
          <span className="font-semibold text-blue-600">Payment</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 px-3 md:px-0">

        {/* LEFT — Payment Options */}
        <div className="md:col-span-2 bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Payment Method</h2>

          <div className="space-y-4">
            <label className="flex items-center gap-3 p-4 border rounded-xl cursor-pointer">
              <input type="radio" name="pay" defaultChecked />
              <span className="font-semibold">Cash on Delivery (COD)</span>
            </label>

            <label className="flex items-center gap-3 p-4 border rounded-xl cursor-pointer">
              <input type="radio" name="pay" disabled />
              <span className="text-gray-400">(Soon) Credit/Debit Card</span>
            </label>
          </div>

          <button
            onClick={handlePlaceOrder}
            className="w-full bg-red-600 text-white py-4 rounded-xl font-semibold text-lg mt-6 hover:animate-selectBrandLift"
          >
            Place Order
          </button>
        </div>

        {/* RIGHT — Summary */}
        <div className="bg-white rounded-xl shadow p-5 h-fit sticky top-20">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between mb-2">
            <span>Shipping</span>
            <span className="text-green-600">FREE</span>
          </div>

          <hr className="my-3" />

          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
