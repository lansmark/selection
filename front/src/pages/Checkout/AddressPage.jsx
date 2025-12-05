import React, { useState } from "react"; 
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const AddressPage = () => {
  const navigate = useNavigate();
  const { cart } = useCart();

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    city: "",
    street: "",
  });

  const handleNext = () => {
    if (!address.fullName || !address.phone || !address.city || !address.street) {
      alert("Please fill out all fields");
      return;
    }
    navigate("/checkout/payment", { state: { address } });
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + parseFloat(item.price.replace("$", "")),
    0
  );

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      {/* Top Bar */}
      <div className="w-full bg-white p-4 border-b sticky top-0 z-40">
        <div className="max-w-5xl mx-auto flex items-center gap-4 text-sm">
          <Link to="/cart" className="text-gray-600 hover:text-black">Cart</Link>
          <span>›</span>
          <span className="font-semibold text-blue-600">Address</span>
          <span>›</span>
          <span>Payment</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 px-3 md:px-0">

        {/* LEFT — Address Form */}
        <div className="md:col-span-2 bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>

          <div className="space-y-4">
            <input className="w-full p-3 border rounded-xl"
              placeholder="Full Name"
              value={address.fullName}
              onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
            />

            <input className="w-full p-3 border rounded-xl"
              placeholder="Phone Number"
              value={address.phone}
              onChange={(e) => setAddress({ ...address, phone: e.target.value })}
            />

            <input className="w-full p-3 border rounded-xl"
              placeholder="City"
              value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
            />

            <input className="w-full p-3 border rounded-xl"
              placeholder="Street Address"
              value={address.street}
              onChange={(e) => setAddress({ ...address, street: e.target.value })}
            />
          </div>

          <button
            onClick={handleNext}
            className="w-full bg-red-600 text-white py-4 rounded-xl font-semibold text-lg mt-6 hover:animate-selectBrandLift"
          >
            Continue to Payment
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

export default AddressPage;
