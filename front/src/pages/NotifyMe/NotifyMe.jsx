// src/pages/NotifyMe/NotifyMe.jsx - FIXED WHATSAPP CACHING ISSUE
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaBell, FaWhatsapp, FaTelegram, FaGlobe } from "react-icons/fa";
import { createNotifyRequest } from "../../services/api";

// ✅ COUNTRY CODES - Add more as needed
const COUNTRY_CODES = [
  { code: '+20', name: 'Egypt', flag: '🇪🇬' },
  { code: '+1', name: 'USA/Canada', flag: '🇺🇸' },
  { code: '+44', name: 'UK', flag: '🇬🇧' },
  { code: '+971', name: 'UAE', flag: '🇦🇪' },
  { code: '+966', name: 'Saudi Arabia', flag: '🇸🇦' },
  { code: '+965', name: 'Kuwait', flag: '🇰🇼' },
  { code: '+973', name: 'Bahrain', flag: '🇧🇭' },
  { code: '+974', name: 'Qatar', flag: '🇶🇦' },
  { code: '+968', name: 'Oman', flag: '🇴🇲' },
  { code: '+962', name: 'Jordan', flag: '🇯🇴' },
  { code: '+961', name: 'Lebanon', flag: '🇱🇧' },
  { code: '+90', name: 'Turkey', flag: '🇹🇷' },
  { code: '+33', name: 'France', flag: '🇫🇷' },
  { code: '+49', name: 'Germany', flag: '🇩🇪' },
  { code: '+39', name: 'Italy', flag: '🇮🇹' },
  { code: '+34', name: 'Spain', flag: '🇪🇸' },
];

const NotifyMe = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const product = state?.product;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    countryCode: "+20", // Default to Egypt
    phone: "",
    method: "telegram",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!product) {
    setTimeout(() => navigate("/"), 2000);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No product selected</h2>
          <p>Redirecting to homepage...</p>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // If phone field, only allow digits
    if (name === 'phone') {
      const digitsOnly = value.replace(/[^0-9]/g, '');
      setFormData((prev) => ({
        ...prev,
        [name]: digitsOnly,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleCountryCodeChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      countryCode: e.target.value,
    }));
  };

  // ✅ FORMAT PHONE NUMBER FOR WHATSAPP
  const formatPhoneForWhatsApp = (countryCode, phone) => {
    // Remove leading zeros from phone number
    let cleanPhone = phone.replace(/^0+/, '');
    
    // Remove + from country code and combine
    const cleanCountryCode = countryCode.replace('+', '');
    
    return cleanCountryCode + cleanPhone;
  };

  const sendTelegramNotification = async (notifyData, requestId, fullPhone) => {
    try {
      const orderDate = new Date().toLocaleString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      const message = `🔔 *NEW STOCK NOTIFICATION REQUEST*

📦 *PRODUCT DETAILS:*
• Name: ${notifyData.product.name}
• Code: ${notifyData.product.code}
• Brand: ${notifyData.product.brand}
• Price: ${notifyData.product.price}
• Gender: ${notifyData.product.gender}

👤 *CUSTOMER DETAILS:*
• Name: ${notifyData.customer.name}
• Email: ${notifyData.customer.email}
• Phone: +${fullPhone}

📅 Request ID: #${requestId}
⏰ ${orderDate}

⚠️ *ACTION REQUIRED:* Contact customer when product is restocked!`;

      const botToken = "8569799627:AAGefB4FsdxBBzyiH_K8BH2ESIpYYk0swqQ";
      const chatId = "8397935689";
      
      await fetch(
        `https://api.telegram.org/bot${botToken}/sendMessage`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: 'Markdown'
          })
        }
      );

    } catch (error) {
      console.error("Error sending Telegram:", error);
    }
  };

  // ✅ FIXED: WhatsApp notification with anti-caching
  const sendWhatsAppNotification = async (notifyData, requestId, fullPhone) => {
    try {
      const orderDate = new Date().toLocaleString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });

      // ✅ Create message with proper line breaks (NOT pre-encoded)
      const message = `🔔 *NEW STOCK NOTIFICATION REQUEST*

📦 *PRODUCT DETAILS:*
Name: ${notifyData.product.name}
Code: ${notifyData.product.code}
Brand: ${notifyData.product.brand}
Price: ${notifyData.product.price}
Gender: ${notifyData.product.gender}

👤 *CUSTOMER DETAILS:*
Name: ${notifyData.customer.name}
Email: ${notifyData.customer.email}
Phone: +${fullPhone}

📋 Request ID: #${requestId}
⏰ ${orderDate}

⚠️ *ACTION REQUIRED:* Contact this customer when product is back in stock!`;

      // ✅ Properly encode the message
      const encodedMessage = encodeURIComponent(message);
      
      const adminPhone = "201005566757";
      
      // ✅ Add timestamp to prevent caching
      const timestamp = Date.now();
      const whatsappURL = `https://wa.me/${adminPhone}?text=${encodedMessage}`;
      
      console.log('📱 Opening WhatsApp...');
      console.log('   Admin Phone:', adminPhone);
      console.log('   Timestamp:', timestamp);
      console.log('   Message Preview:', message.substring(0, 100) + '...');
      
      // ✅ Open in new window with unique name to avoid cache
      window.open(whatsappURL, `whatsapp_${timestamp}`, 'noopener,noreferrer');

    } catch (error) {
      console.error("Error sending WhatsApp:", error);
    }
  };

  const sendEmailNotification = async (notifyData, requestId, fullPhone) => {
    try {
      const orderDate = new Date().toLocaleString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      const emailMessage = `
NEW STOCK NOTIFICATION REQUEST
==============================

Request ID: ${requestId}
Date: ${orderDate}

PRODUCT DETAILS
---------------
Name: ${notifyData.product.name}
Code: ${notifyData.product.code}
Brand: ${notifyData.product.brand}
Price: ${notifyData.product.price}
Gender: ${notifyData.product.gender}

CUSTOMER DETAILS
----------------
Name: ${notifyData.customer.name}
Email: ${notifyData.customer.email}
Phone: +${fullPhone}

ACTION REQUIRED
---------------
Contact this customer when the product is back in stock!
      `.trim();

      const formData = new FormData();
      formData.append('_subject', `Stock Notification Request #${requestId} - ${notifyData.product.name}`);
      formData.append('message', emailMessage);
      formData.append('_captcha', 'false');
      formData.append('_template', 'box');

      await fetch('https://formsubmit.co/ahmedkamalegy100@gmail.com', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.name || !formData.email || !formData.phone) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    if (formData.phone.length < 7) {
      setError("Please enter a valid phone number");
      setLoading(false);
      return;
    }

    try {
      // ✅ FORMAT PHONE: country code + phone (without leading zeros)
      const fullPhone = formatPhoneForWhatsApp(formData.countryCode, formData.phone);
      
      console.log('📞 Phone formatting:');
      console.log('  Country Code:', formData.countryCode);
      console.log('  Phone Number:', formData.phone);
      console.log('  Full Number:', fullPhone);

      const notifyData = {
        product: {
          id: product.id,
          code: product.code,
          name: product.name,
          brand: product.brand,
          price: product.price?.toString().startsWith('$') ? product.price : `$${product.price}`,
          gender: product.gender || 'unisex',
        },
        customer: {
          name: formData.name,
          email: formData.email,
          phone: fullPhone, // ✅ SEND FORMATTED PHONE (e.g., "201005566757")
        },
        location: {
          ip: null,
          country: null,
          city: null,
        },
        method: formData.method,
      };

      // Save to database
      const response = await createNotifyRequest(notifyData);

      // Send admin notifications
      await Promise.all([
        sendTelegramNotification(notifyData, response.requestId, fullPhone),
        sendWhatsAppNotification(notifyData, response.requestId, fullPhone),
        sendEmailNotification(notifyData, response.requestId, fullPhone)
      ]);

      setSuccess(true);
      setTimeout(() => navigate("/"), 3000);
    } catch (err) {
      setError(err.message || "Failed to submit notification request. Please try again.");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-8">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaBell className="text-white text-2xl" />
            </div>
            <h2 className="text-2xl font-bold text-green-800 dark:text-green-300 mb-2">
              Request Submitted!
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We'll notify you via {formData.method === 'telegram' ? 'Telegram' : 'WhatsApp'} when{" "}
              <strong>{product.name}</strong> is back in stock.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Redirecting to homepage...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaBell className="text-white text-2xl" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Get Notified When Available</h1>
          <p className="text-gray-600 dark:text-gray-400">
            This product is currently out of stock. Leave your details and we'll notify you when it's available again!
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-4">
            <img
              src={product.image_front || product.imageFront || "/assets/placeholder/placeholder-1.png"}
              alt={product.name}
              className="w-20 h-20 object-cover rounded-lg"
              onError={(e) => {
                e.target.src = "/assets/placeholder/placeholder-1.png";
              }}
            />
            <div className="flex-1">
              <h3 className="font-bold text-lg">{product.name}</h3>
              <p className="text-gray-600 dark:text-gray-400">{product.brand}</p>
              <p className="font-semibold text-yellow-600">
                {product.price?.toString().startsWith('$') ? product.price : `$${product.price}`}
              </p>
              <p className="text-sm text-gray-500">SKU: {product.code}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
              <p className="text-red-800 dark:text-red-300">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold mb-2">Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Email Address *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none"
              required
            />
          </div>

          {/* ✅ PHONE WITH COUNTRY CODE SELECTOR */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              <FaGlobe className="inline mr-2" />
              Phone Number * (with Country Code)
            </label>
            <div className="flex gap-2">
              <select
                name="countryCode"
                value={formData.countryCode}
                onChange={handleCountryCodeChange}
                className="px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none w-40"
              >
                {COUNTRY_CODES.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.flag} {country.code}
                  </option>
                ))}
              </select>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="1005566757"
                className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none"
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Example: For Egypt 01005566757, select +20 and enter 1005566757 (without leading 0)
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-3">Preferred Notification Method *</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, method: "telegram" })}
                className={`flex items-center justify-center gap-2 py-4 px-4 rounded-xl border-2 transition-all ${
                  formData.method === "telegram"
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-300 dark:border-gray-600 hover:border-blue-300"
                }`}
              >
                <FaTelegram className="text-2xl text-blue-500" />
                <span className="font-semibold">Telegram</span>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, method: "whatsapp" })}
                className={`flex items-center justify-center gap-2 py-4 px-4 rounded-xl border-2 transition-all ${
                  formData.method === "whatsapp"
                    ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                    : "border-gray-300 dark:border-gray-600 hover:border-green-300"
                }`}
              >
                <FaWhatsapp className="text-2xl text-green-500" />
                <span className="font-semibold">WhatsApp</span>
              </button>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-sm">
            <p className="text-gray-700 dark:text-gray-300">
              🔒 Your information will only be used to notify you about this product's availability.
              We respect your privacy and won't share your details with third parties.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 text-black font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                Submitting...
              </>
            ) : (
              <>
                <FaBell />
                Notify Me When Available
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default NotifyMe;