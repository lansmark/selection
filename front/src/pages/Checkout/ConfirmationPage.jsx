import React from "react";
import { Link, useLocation } from "react-router-dom";

const ConfirmationPage = () => {
  const { state } = useLocation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 text-center">
      <div className="bg-white p-10 rounded-3xl shadow-xl max-w-md w-full">
        <h1 className="text-3xl font-bold text-green-600 mb-4">Order Placed!</h1>

        <p className="text-gray-600">
          Your order has been successfully placed and will be delivered soon.
        </p>

        <div className="mt-6 bg-gray-50 p-4 rounded-xl text-left">
          <h2 className="font-semibold mb-2">Shipping To:</h2>
          <p><strong>Name:</strong> {state?.address.fullName}</p>
          <p><strong>Phone:</strong> {state?.address.phone}</p>
          <p><strong>City:</strong> {state?.address.city}</p>
          <p><strong>Street:</strong> {state?.address.street}</p>
        </div>

        <p className="mt-4 font-bold text-lg">
          Total Paid: ${state?.total.toFixed(2)}
        </p>

        <Link to="/">
          <button className="w-full mt-6 bg-black text-white py-4 rounded-xl font-semibold">
            Continue Shopping
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ConfirmationPage;
