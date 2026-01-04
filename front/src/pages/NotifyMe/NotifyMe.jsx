// src/pages/NotifyMe/NotifyMe.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaTelegram, FaWhatsapp, FaBell, FaArrowLeft } from "react-icons/fa";

const NotifyMe = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [sendMethod, setSendMethod] = useState("telegram");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [clientInfo, setClientInfo] = useState(null);

  // Telegram Bot Configuration
  const TELEGRAM_BOT_TOKEN = "8569799627:AAGefB4FsdxBBzyiH_K8BH2ESIpYYk0swqQ";
  const TELEGRAM_CHAT_ID = "8397935689";

  // Redirect if no product
  useEffect(() => {
    if (!product) {
      navigate("/");
    }
  }, [product, navigate]);

  // Fetch client info
  useEffect(() => {
    const fetchClientInfo = async () => {
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        setClientInfo({
          ip: data.ip,
          country: data.country_name,
          city: data.city,
          region: data.region,
        });
      } catch (error) {
        console.error("Failed to fetch IP info", error);
      }
    };
    fetchClientInfo();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const sendToTelegram = async () => {
    const text = `
🔔 NEW STOCK NOTIFICATION REQUEST

📦 Product Details:
• Name: ${product.name}
• Code: ${product.code}
• Brand: ${product.brand}
• Price: ${product.price}
• Category: ${product.category || "N/A"}
• Gender: ${product.gender || "N/A"}

👤 Customer Details:
• Name: ${formData.name}
• Email: ${formData.email}
• Phone: ${formData.phone}

🌍 Location Info:
• IP: ${clientInfo?.ip || "Unknown"}
• Country: ${clientInfo?.country || "Unknown"}
• City: ${clientInfo?.city || "Unknown"}
• Region: ${clientInfo?.region || "Unknown"}

⚠️ Action Required: Notify this customer when product is back in stock!
    `;

    try {
      const response = await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: text,
            parse_mode: "HTML",
          }),
        }
      );

      const data = await response.json();

      if (data.ok) {
        setStatus({
          type: "success",
          message: "✅ Notification request sent! We'll contact you when the product is available.",
        });
        setTimeout(() => navigate("/"), 3000);
      } else {
        setStatus({
          type: "error",
          message: "Failed to send request. Please try again.",
        });
      }
    } catch (error) {
      console.error("Telegram error:", error);
      setStatus({
        type: "error",
        message: "Network error. Please check your connection.",
      });
    }
  };

  const sendToWhatsApp = () => {
    const whatsappNumber = "201005566757";
    
    const text = `🔔 STOCK NOTIFICATION REQUEST

Hi! I would like to be notified when this product is available:

📦 Product:
• Name: ${product.name}
• Code: ${product.code}
• Brand: ${product.brand}
• Price: ${product.price}

👤 My Details:
• Name: ${formData.name}
• Email: ${formData.email}
• Phone: ${formData.phone}

📍 Location: ${clientInfo?.city || "Unknown"}, ${clientInfo?.country || "Unknown"}

Please notify me when it's back in stock!`;

    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(whatsappURL, "_blank");
    
    setStatus({
      type: "success",
      message: "✅ Opening WhatsApp... We'll contact you when available!",
    });
    
    setTimeout(() => navigate("/"), 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    if (!formData.name || !formData.email) {
      setStatus({
        type: "error",
        message: "Please fill in all required fields.",
      });
      return;
    }

    if (sendMethod === "telegram") {
      sendToTelegram();
    } else {
      sendToWhatsApp();
    }
  };

  if (!product) return null;

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-8 transition-colors"
        >
          <FaArrowLeft />
          Back
        </button>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full mb-4">
            <FaBell className="text-3xl text-yellow-600 dark:text-yellow-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Notify Me When Available
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            We'll contact you as soon as this product is back in stock!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Product Info */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Product Details
            </h2>
            
            <div className="space-y-6">
              {/* Product Image */}
              <div className="relative rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700">
                <img
                  src={product.imageFront}
                  alt={product.name}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm">
                  Out of Stock
                </div>
              </div>

              {/* Product Details */}
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Product Name</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{product.name}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Product Code</p>
                  <p className="text-lg font-mono font-semibold text-gray-900 dark:text-white">{product.code}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Brand</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">{product.brand}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Price</p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">{product.price}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Notification Form */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Get Notified
            </h2>

            {/* Status Message */}
            {status.message && (
              <div
                className={`mb-6 p-4 rounded-lg ${
                  status.type === "success"
                    ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                    : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                }`}
              >
                {status.message}
              </div>
            )}

            {/* Send Method Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Choose notification method:
              </label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setSendMethod("telegram")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition-all ${
                    sendMethod === "telegram"
                      ? "bg-blue-500 text-white shadow-lg scale-105"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  <FaTelegram className="text-xl" />
                  Telegram
                </button>
                <button
                  type="button"
                  onClick={() => setSendMethod("whatsapp")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition-all ${
                    sendMethod === "whatsapp"
                      ? "bg-green-500 text-white shadow-lg scale-105"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  <FaWhatsapp className="text-xl" />
                  WhatsApp
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >
                  Your Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                  placeholder="John Doe"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                  placeholder="john@example.com"
                />
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                  placeholder="+20 123 456 7890"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={`w-full py-4 rounded-lg font-bold text-white transition-all transform hover:scale-105 shadow-lg ${
                  sendMethod === "telegram"
                    ? "bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                    : "bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                }`}
              >
                {sendMethod === "telegram" ? (
                  <span className="flex items-center justify-center gap-2">
                    <FaBell />
                    Notify Me via Telegram
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <FaBell />
                    Notify Me via WhatsApp
                  </span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotifyMe;