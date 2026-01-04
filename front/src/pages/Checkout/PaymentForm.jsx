import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCreditCard, FaLock, FaCheckCircle } from "react-icons/fa";
import { SiVisa, SiMastercard } from "react-icons/si";

const PaymentForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { address, cart = [], subtotal = 0, shippingFee = 0, total = 0 } = location.state || {};

  const [paymentData, setPaymentData] = useState({
    cardholderName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format card number with spaces every 4 digits
    if (name === "cardNumber") {
      formattedValue = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim()
        .substring(0, 19); // 16 digits + 3 spaces
    }

    // Format expiry date as MM/YY
    if (name === "expiryDate") {
      formattedValue = value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d)/, "$1/$2")
        .substring(0, 5);
    }

    // Limit CVV to 3-4 digits
    if (name === "cvv") {
      formattedValue = value.replace(/\D/g, "").substring(0, 4);
    }

    setPaymentData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!paymentData.cardholderName.trim()) {
      newErrors.cardholderName = "Cardholder name is required";
    }

    const cardNumberDigits = paymentData.cardNumber.replace(/\s/g, "");
    if (!cardNumberDigits) {
      newErrors.cardNumber = "Card number is required";
    } else if (cardNumberDigits.length < 16) {
      newErrors.cardNumber = "Card number must be 16 digits";
    }

    if (!paymentData.expiryDate) {
      newErrors.expiryDate = "Expiry date is required";
    } else if (!/^\d{2}\/\d{2}$/.test(paymentData.expiryDate)) {
      newErrors.expiryDate = "Invalid format (MM/YY)";
    }

    if (!paymentData.cvv) {
      newErrors.cvv = "CVV is required";
    } else if (paymentData.cvv.length < 3) {
      newErrors.cvv = "CVV must be 3-4 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!address) {
      alert("Shipping address is missing. Please go back and fill in your address.");
      navigate("/checkout/address");
      return;
    }

    if (validateForm()) {
      // Navigate to confirmation page
      navigate("/checkout/confirmation", {
        state: {
          address,
          cart,
          subtotal,
          shippingFee,
          total,
          paymentData,
        },
      });
    }
  };

  // Detect card type
  const getCardType = () => {
    const firstDigit = paymentData.cardNumber.charAt(0);
    if (firstDigit === "4") return "visa";
    if (firstDigit === "5") return "mastercard";
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-t-2xl p-6 border-b-4 border-yellow-400">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payment Form</h1>
            <button
              onClick={() => navigate("/checkout/address")}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-b-2xl shadow-2xl p-6">
          {/* Cardholder's Name */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
              * Cardholder's name
            </label>
            <input
              type="text"
              name="cardholderName"
              value={paymentData.cardholderName}
              onChange={handleChange}
              placeholder="Full name on card"
              className={`w-full px-4 py-3 rounded-lg border-2 ${
                errors.cardholderName
                  ? "border-red-500"
                  : "border-gray-200 dark:border-gray-600"
              } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-yellow-400 transition-all`}
            />
            {errors.cardholderName && (
              <p className="text-red-500 text-xs mt-1">{errors.cardholderName}</p>
            )}
          </div>

          {/* Card Information */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
              * Card Information
            </label>
            
            {/* Card Number */}
            <div className="relative mb-3">
              <input
                type="text"
                name="cardNumber"
                value={paymentData.cardNumber}
                onChange={handleChange}
                placeholder="Card Number"
                className={`w-full px-4 py-3 rounded-lg border-2 ${
                  errors.cardNumber
                    ? "border-red-500"
                    : "border-gray-200 dark:border-gray-600"
                } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-yellow-400 transition-all`}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {getCardType() === "visa" && <SiVisa className="text-2xl text-blue-600" />}
                {getCardType() === "mastercard" && <SiMastercard className="text-2xl text-red-600" />}
                {!getCardType() && <FaCreditCard className="text-xl text-gray-400" />}
              </div>
            </div>
            {errors.cardNumber && (
              <p className="text-red-500 text-xs mb-3">{errors.cardNumber}</p>
            )}

            {/* Expiry and CVV */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <input
                  type="text"
                  name="expiryDate"
                  value={paymentData.expiryDate}
                  onChange={handleChange}
                  placeholder="MM / YY"
                  className={`w-full px-4 py-3 rounded-lg border-2 ${
                    errors.expiryDate
                      ? "border-red-500"
                      : "border-gray-200 dark:border-gray-600"
                  } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-yellow-400 transition-all`}
                />
                {errors.expiryDate && (
                  <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>
                )}
              </div>
              <div className="relative">
                <input
                  type="text"
                  name="cvv"
                  value={paymentData.cvv}
                  onChange={handleChange}
                  placeholder="CVV/CVN"
                  className={`w-full px-4 py-3 rounded-lg border-2 ${
                    errors.cvv
                      ? "border-red-500"
                      : "border-gray-200 dark:border-gray-600"
                  } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-yellow-400 transition-all`}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <FaCreditCard className="text-gray-400" />
                </div>
                {errors.cvv && (
                  <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>
                )}
              </div>
            </div>
          </div>

          {/* Pay Button */}
          <button
            type="submit"
            className="w-full bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white font-bold py-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 mb-6"
          >
            <FaLock />
            Pay EGP {total.toFixed(2)}
          </button>

          {/* Security Badges */}
          <div className="flex items-center justify-center gap-6">
            {/* PCI DSS Badge */}
            <div className="flex items-center gap-2">
              <div className="bg-green-600 text-white px-3 py-1 rounded text-xs font-bold">
                PCI
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400">DSS Compliant</span>
            </div>

            {/* ISO Badge */}
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-bold">
                ISO
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400">27001:2022</span>
            </div>
          </div>

          {/* Secure Notice */}
          <div className="mt-6 text-center">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <FaCheckCircle className="text-green-500" />
              <span>Your payment is secure and encrypted</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;