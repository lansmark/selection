// src/pages/Contact/Contact.jsx
import React, { useState, useEffect } from "react";
import {
  FaTelegram,
  FaWhatsapp,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [sendMethod, setSendMethod] = useState("telegram");
  const [status, setStatus] = useState({ type: "", message: "" });

  // Client IP & location
  const [clientInfo, setClientInfo] = useState(null);

  // Telegram Bot Configuration
  const TELEGRAM_BOT_TOKEN = "8569799627:AAGefB4FsdxBBzyiH_K8BH2ESIpYYk0swqQ";
  const TELEGRAM_CHAT_ID = "8397935689";

  // Get IP + location once
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
          isp: data.org,
        });
      } catch (err) {
        console.error("IP fetch failed:", err);
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
🆕 New Contact Message

👤 Name: ${formData.name}
📧 Email: ${formData.email}
📱 Phone: ${formData.phone}

🌍 Visitor Info:
IP: ${clientInfo?.ip || "Unknown"}
Country: ${clientInfo?.country || "Unknown"}
City: ${clientInfo?.city || "Unknown"}
Region: ${clientInfo?.region || "Unknown"}
ISP: ${clientInfo?.isp || "Unknown"}

💬 Message:
${formData.message}
    `;

    try {
      const response = await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text,
          }),
        }
      );

      const data = await response.json();

      if (data.ok) {
        setStatus({
          type: "success",
          message: "Message sent successfully via Telegram! ✅",
        });
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        setStatus({
          type: "error",
          message: "Failed to send message. Please try again.",
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
    // Replace with your REAL WhatsApp number (no +, no spaces)
    const whatsappNumber = "201005566757";

    const text = `Hi! I'm ${formData.name}

Email: ${formData.email}
Phone: ${formData.phone}
IP: ${clientInfo?.ip || "Unknown"}
Region: ${clientInfo?.region || "Unknown"}
ISP: ${clientInfo?.isp || "Unknown"}

Message:
${formData.message}`;

    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      text
    )}`;

    window.open(whatsappURL, "_blank", "noopener,noreferrer");

    setStatus({
      type: "success",
      message: "Opening WhatsApp... ✅",
    });

    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    if (!formData.name || !formData.email || !formData.message) {
      setStatus({
        type: "error",
        message: "Please fill in all required fields.",
      });
      return;
    }

    sendMethod === "telegram" ? sendToTelegram() : sendToWhatsApp();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 pt-32 pb-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12" data-aos="fade-down">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Have a question or want to work together? We'd love to hear from you!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <div
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8
             w-full max-w-xl mx-auto
             lg:col-span-2"
              data-aos="fade-right"
            >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Send us a Message
            </h2>

            {/* Status */}
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

            {/* Send Method */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Choose how to send:
              </label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setSendMethod("telegram")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition-all ${
                    sendMethod === "telegram"
                      ? "bg-blue-500 text-white shadow-lg scale-105"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
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
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  <FaWhatsapp className="text-xl" />
                  WhatsApp
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              />

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+20 123 456 7890"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              />

              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="5"
                required
                placeholder="Tell us about your inquiry..."
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 resize-none"
              />

              <button
                type="submit"
                className={`w-full py-4 rounded-lg font-bold text-white transition-all ${
                  sendMethod === "telegram"
                    ? "bg-gradient-to-r from-blue-500 to-blue-600"
                    : "bg-gradient-to-r from-green-500 to-green-600"
                }`}
              >
                {sendMethod === "telegram" ? "Send via Telegram" : "Send via WhatsApp"}
              </button>
            </form>
          </div>

          {/* Contact Info (UNCHANGED) */}
          <div className="space-y-8" data-aos="fade-left">
            {/* your original info cards remain unchanged */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
