import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCreditCard, FaMoneyBillWave, FaMobileAlt, FaLock, FaCheckCircle } from "react-icons/fa";
import { SiVisa, SiMastercard } from "react-icons/si";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { address, cart = [], subtotal = 0, shippingFee = 0, total = 0 } = location.state || {};

  const [selectedMethod, setSelectedMethod] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  
  // Payment form state
  const [paymentData, setPaymentData] = useState({
    cardholderName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const [errors, setErrors] = useState({});

  const paymentMethods = [
    {
      id: "credit_card",
      name: "Credit / Debit Card",
      icon: <FaCreditCard className="text-3xl" />,
      description: "Pay securely with your card",
      subtext: "Visa, Mastercard, Amex",
    },
    {
      id: "cash_on_delivery",
      name: "Cash on Delivery",
      icon: <FaMoneyBillWave className="text-3xl" />,
      description: "Pay when you receive your order",
      subtext: "Pay in cash to the courier",
    },
    {
      id: "instapay",
      name: "InstaPay",
      icon: <FaMobileAlt className="text-3xl" />,
      description: "Instant payment via mobile",
      subtext: "Fast & secure mobile payment",
    },
  ];

  const handleMethodSelect = (methodId) => {
    setSelectedMethod(methodId);
    
    // If credit card is selected, show the payment form
    if (methodId === "credit_card") {
      setShowPaymentForm(true);
    } else {
      setShowPaymentForm(false);
    }
  };

  const handleContinue = () => {
    if (!selectedMethod) {
      alert("Please select a payment method");
      return;
    }

    // If credit card and form is shown, validate the form
    if (selectedMethod === "credit_card" && showPaymentForm) {
      if (validateForm()) {
        proceedToConfirmation();
      }
    } else {
      // For COD or InstaPay, go directly to confirmation
      proceedToConfirmation();
    }
  };

  const proceedToConfirmation = () => {
    navigate("/checkout/confirmation", {
      state: {
        address,
        cart,
        subtotal,
        shippingFee,
        total,
        paymentMethod: selectedMethod,
        paymentData: selectedMethod === "credit_card" ? paymentData : null,
      },
    });
  };

  // Form handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "cardNumber") {
      formattedValue = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim()
        .substring(0, 19);
    }

    if (name === "expiryDate") {
      formattedValue = value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d)/, "$1/$2")
        .substring(0, 5);
    }

    if (name === "cvv") {
      formattedValue = value.replace(/\D/g, "").substring(0, 4);
    }

    setPaymentData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));

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

  const getCardType = () => {
    const firstDigit = paymentData.cardNumber.charAt(0);
    if (firstDigit === "4") return "visa";
    if (firstDigit === "5") return "mastercard";
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6">
          <div className="flex items-center justify-center gap-3 text-sm">
            <span className="text-gray-400">Cart</span>
            <span className="text-gray-300">•</span>
            <span className="text-gray-400">Address</span>
            <span className="text-gray-300">•</span>
            <span className="font-bold text-blue-600 dark:text-blue-400">Payment</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Payment Methods */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Method Selection */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Select Payment Method
              </h2>

              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    onClick={() => handleMethodSelect(method.id)}
                    className={`cursor-pointer p-5 rounded-xl border-2 transition-all duration-300 ${
                      selectedMethod === method.id
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`${
                          selectedMethod === method.id
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-gray-400"
                        }`}
                      >
                        {method.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                          {method.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {method.description}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          {method.subtext}
                        </p>
                      </div>
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          selectedMethod === method.id
                            ? "border-blue-500 bg-blue-500"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                      >
                        {selectedMethod === method.id && (
                          <FaCheckCircle className="text-white text-sm" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* InstaPay Details (Only shows when InstaPay is selected) */}
            {selectedMethod === "instapay" && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FaMobileAlt className="text-blue-600 dark:text-blue-400" />
                  InstaPay Payment
                </h3>
                
                <div className="bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border-2 border-blue-200 dark:border-blue-800">
                  {/* Payment Link */}
                  <div className="text-center mb-6">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Click the link to send money to
                    </p>
                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-4">
                      miira1981@instapay
                    </p>
                    
                    <a
                      href="https://ipn.eg/S/miira1981/instapay/3SofBv"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      <FaMobileAlt className="text-xl" />
                      Pay with InstaPay
                    </a>
                    
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 flex items-center justify-center gap-1">
                      <span>Powered by</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">InstaPay</span>
                    </p>
                  </div>

                  {/* Payment Link Display */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Payment Link:</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 text-sm text-blue-600 dark:text-blue-400 bg-gray-50 dark:bg-gray-900 px-3 py-2 rounded overflow-x-auto">
                        https://ipn.eg/S/miira1981/instapay/3SofBv
                      </code>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText("https://ipn.eg/S/miira1981/instapay/3SofBv");
                          alert("Payment link copied to clipboard!");
                        }}
                        className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-3 py-2 rounded text-sm font-semibold transition"
                      >
                        Copy
                      </button>
                    </div>
                  </div>

                  {/* Amount to Pay */}
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Amount to Pay</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      EGP {total.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Instructions */}
                <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200 font-semibold mb-2 flex items-center gap-2">
                    <span className="text-lg">📝</span>
                    Payment Instructions:
                  </p>
                  <ol className="text-sm text-yellow-800 dark:text-yellow-200 space-y-1 list-decimal list-inside">
                    <li>Click the "Pay with InstaPay" button above</li>
                    <li>Complete the payment on the InstaPay page</li>
                    <li>Return here and click "Complete Order" below</li>
                  </ol>
                </div>
              </div>
            )}

            {/* Credit Card Form (Only shows when credit card is selected) */}
            {showPaymentForm && selectedMethod === "credit_card" && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border-t-4 border-yellow-400">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Card Details
                </h3>

                {/* Cardholder's Name */}
                <div className="mb-5">
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
                <div className="mb-5">
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
                      {getCardType() === "mastercard" && (
                        <SiMastercard className="text-2xl text-red-600" />
                      )}
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

                {/* Security Badges */}
                <div className="flex items-center justify-center gap-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <div className="bg-green-600 text-white px-3 py-1 rounded text-xs font-bold">
                      PCI
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">DSS Compliant</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-bold">
                      ISO
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">27001:2022</span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleContinue}
                disabled={!selectedMethod}
                className={`w-full font-bold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                  selectedMethod
                    ? "bg-red-600 hover:bg-red-700 text-white hover:shadow-lg"
                    : "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                }`}
              >
                <FaLock />
                {selectedMethod === "credit_card"
                  ? `Pay EGP ${total.toFixed(2)}`
                  : "Complete Order"}
              </button>

              <button
                onClick={() => navigate("/checkout/address")}
                className="w-full border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 text-gray-700 dark:text-gray-300 font-semibold py-4 rounded-xl transition-all"
              >
                ← Back to Address
              </button>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 sticky top-24">
              <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
                Order Summary
              </h2>

              <div className="space-y-3">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
                  <div className="flex justify-between">
                    <span className="text-yellow-800 dark:text-yellow-200 font-semibold">
                      Subtotal
                    </span>
                    <span className="text-yellow-800 dark:text-yellow-200 font-bold">
                      EGP {subtotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
                  <div className="flex justify-between">
                    <span className="text-yellow-800 dark:text-yellow-200 font-semibold">
                      Shipping
                    </span>
                    <span className="text-yellow-800 dark:text-yellow-200 font-bold">
                      {shippingFee === 0 ? "FREE" : `EGP ${shippingFee.toFixed(2)}`}
                    </span>
                  </div>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
                  <div className="flex justify-between">
                    <span className="text-yellow-800 dark:text-yellow-200 font-bold text-lg">
                      Total
                    </span>
                    <span className="text-yellow-800 dark:text-yellow-200 font-bold text-xl">
                      EGP {total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <FaCheckCircle className="text-green-500" />
                  <span>Secure & encrypted</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;