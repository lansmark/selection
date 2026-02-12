import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaCheckCircle, FaBox, FaMapMarkerAlt, FaCreditCard, FaEnvelope, FaShoppingBag, FaTelegram } from "react-icons/fa";

const ConfirmationPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [telegramSent, setTelegramSent] = useState(false);
  const hasSentNotifications = useRef(false);

  // Add print styles
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @media print {
        nav, header, footer, .navbar, .header, .footer {
          display: none !important;
        }
        .print-hide {
          display: none !important;
        }
        body, .bg-gradient-to-br {
          background: white !important;
        }
        .print\\:block {
          display: block !important;
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Redirect if no order data
  useEffect(() => {
    if (!state || !state.address) {
      navigate("/");
    }
  }, [state, navigate]);

  // Send email, Telegram, and WhatsApp on component mount (only once)
  useEffect(() => {
    if (hasSentNotifications.current) {
      return;
    }

    if (state && state.address) {
      hasSentNotifications.current = true;
      sendOrderEmail();
      sendTelegramMessage();
      sendWhatsAppMessage();
    }
  }, []);

  const sendWhatsAppMessage = async () => {
    try {
      const orderNumber = `ORD-${Date.now()}`;
      const orderDate = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      const cleanPrice = (priceStr) => {
        if (!priceStr) return 0;
        const cleaned = String(priceStr).replace(/[$EGP\s,]/g, '');
        return parseFloat(cleaned) || 0;
      };

      const itemsList = state.cart.map((item, index) => {
        let price = cleanPrice(item.price) || 
                   cleanPrice(item.newPrice) || 
                   cleanPrice(item.salePrice) || 
                   cleanPrice(item.originalPrice);
        
        if (price === 0 && state.subtotal) {
          const totalQuantity = state.cart.reduce((sum, cartItem) => 
            sum + (parseInt(cartItem.quantity) || 1), 0
          );
          price = parseFloat(state.subtotal) / totalQuantity;
        }
        
        const quantity = parseInt(item.quantity) || 1;
        return `${index + 1}. ${item.name} x ${quantity} - EGP ${(price * quantity).toFixed(2)}`;
      }).join('%0A');

      const whatsappMessage = `🛍️ *NEW ORDER RECEIVED!*%0A%0A` +
        `📋 *Order Number:* ${orderNumber}%0A` +
        `📅 *Date:* ${orderDate}%0A%0A` +
        `👤 *CUSTOMER INFORMATION*%0A` +
        `Name: ${state.address.fullName}%0A` +
        `Email: ${state.address.email || "N/A"}%0A` +
        `Phone: ${state.address.phone}%0A%0A` +
        `📍 *SHIPPING ADDRESS*%0A` +
        `Street: ${state.address.street}%0A` +
        `${state.address.building ? `Building: ${state.address.building}%0A` : ''}` +
        `${state.address.floor ? `Floor: ${state.address.floor}%0A` : ''}` +
        `${state.address.apartment ? `Apartment: ${state.address.apartment}%0A` : ''}` +
        `City: ${state.address.city}%0A` +
        `${state.address.governorate ? `Governorate: ${state.address.governorate}%0A` : ''}%0A` +
        `🛒 *ORDER ITEMS*%0A` +
        `${itemsList}%0A%0A` +
        `💳 *PAYMENT INFORMATION*%0A` +
        `Payment Method: ${getPaymentMethodName(state.paymentMethod)}%0A` +
        `Subtotal: EGP ${parseFloat(state.subtotal || 0).toFixed(2)}%0A` +
        `Shipping: ${state.shippingFee === 0 ? 'FREE' : `EGP ${parseFloat(state.shippingFee || 0).toFixed(2)}`}%0A` +
        `*TOTAL: EGP ${parseFloat(state.total || 0).toFixed(2)}*`;

      const whatsappNumber = "201005566757";
      const whatsappURL = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
      window.open(whatsappURL, '_blank');

    } catch (error) {
      console.error("❌ Error preparing WhatsApp message:", error);
    }
  };

  const sendTelegramMessage = async () => {
    try {
      const orderNumber = `ORD-${Date.now()}`;
      const orderDate = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      const cleanPrice = (priceStr) => {
        if (!priceStr) return 0;
        const cleaned = String(priceStr).replace(/[$EGP\s,]/g, '');
        return parseFloat(cleaned) || 0;
      };

      const itemsList = state.cart.map((item, index) => {
        let price = cleanPrice(item.price) || 
                   cleanPrice(item.newPrice) || 
                   cleanPrice(item.salePrice) || 
                   cleanPrice(item.originalPrice);
        
        if (price === 0 && state.subtotal) {
          const totalQuantity = state.cart.reduce((sum, cartItem) => 
            sum + (parseInt(cartItem.quantity) || 1), 0
          );
          price = parseFloat(state.subtotal) / totalQuantity;
        }
        
        const quantity = parseInt(item.quantity) || 1;
        
        return `${index + 1}. ${item.name} x ${quantity} - EGP ${(price * quantity).toFixed(2)}`;
      }).join('\n');

      let paymentStatusEmoji = "";
      let paymentStatusText = "";
      let actionRequired = "";
      
      if (state.paymentMethod === "cash_on_delivery") {
        paymentStatusEmoji = "💵";
        paymentStatusText = "CASH ON DELIVERY";
        actionRequired = "⚠️ Payment will be collected upon delivery";
      } else if (state.paymentMethod === "instapay") {
        paymentStatusEmoji = "💳";
        paymentStatusText = "INSTAPAY PAYMENT";
        actionRequired = "⚠️ ACTION REQUIRED: Verify payment in your InstaPay account (miira1981@instapay)";
      } else if (state.paymentMethod === "credit_card") {
        paymentStatusEmoji = "💳";
        paymentStatusText = "CREDIT CARD PAYMENT";
        actionRequired = "⚠️ ACTION REQUIRED: Verify payment in your payment gateway";
      }

      const message = `${paymentStatusEmoji} *NEW ORDER RECEIVED!*\n\n` +
        `🔔 *${paymentStatusText}*\n` +
        `${actionRequired}\n\n` +
        `📋 *Order Number:* ${orderNumber}\n` +
        `📅 *Date:* ${orderDate}\n\n` +
        `👤 *CUSTOMER INFORMATION*\n` +
        `Name: ${state.address.fullName}\n` +
        `Phone: ${state.address.phone}\n` +
        `Email: ${state.address.email || "N/A"}\n\n` +
        `📍 *SHIPPING ADDRESS*\n` +
        `Street: ${state.address.street}\n` +
        `${state.address.building ? `Building: ${state.address.building}\n` : ''}` +
        `${state.address.floor ? `Floor: ${state.address.floor}\n` : ''}` +
        `${state.address.apartment ? `Apartment: ${state.address.apartment}\n` : ''}` +
        `City: ${state.address.city}\n` +
        `${state.address.governorate ? `Governorate: ${state.address.governorate}\n` : ''}\n` +
        `🛒 *ORDER ITEMS*\n${itemsList}\n\n` +
        `💰 *PAYMENT SUMMARY*\n` +
        `Subtotal: EGP ${parseFloat(state.subtotal || 0).toFixed(2)}\n` +
        `Shipping: ${state.shippingFee === 0 ? 'FREE' : `EGP ${parseFloat(state.shippingFee || 0).toFixed(2)}`}\n` +
        `*TOTAL: EGP ${parseFloat(state.total || 0).toFixed(2)}*\n\n` +
        `📌 Next Step: ${state.paymentMethod === "cash_on_delivery" ? "Prepare order for delivery" : "Verify payment before processing"}`;

      const botToken = "8569799627:AAGefB4FsdxBBzyiH_K8BH2ESIpYYk0swqQ";
      const chatId = "8397935689";
      
      const response = await fetch(
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

      if (response.ok) {
        setTelegramSent(true);
      }

    } catch (error) {
      console.error("❌ Error sending Telegram:", error);
    }
  };

  const sendOrderEmail = async () => {
    try {
      const orderNumber = `ORD-${Date.now()}`;
      const orderDate = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      const cleanPrice = (priceStr) => {
        if (!priceStr) return 0;
        const cleaned = String(priceStr).replace(/[$EGP\s,]/g, '');
        return parseFloat(cleaned) || 0;
      };

      const itemsList = state.cart.map((item, index) => {
        let price = cleanPrice(item.price) || 
                   cleanPrice(item.newPrice) || 
                   cleanPrice(item.salePrice) || 
                   cleanPrice(item.originalPrice);
        
        if (price === 0 && state.subtotal) {
          const totalQuantity = state.cart.reduce((sum, cartItem) => 
            sum + (parseInt(cartItem.quantity) || 1), 0
          );
          price = parseFloat(state.subtotal) / totalQuantity;
        }
        
        const quantity = parseInt(item.quantity) || 1;
        return `${index + 1}. ${item.name} x ${quantity} - EGP ${(price * quantity).toFixed(2)}`;
      }).join('\n');

      const emailMessage = `
NEW ORDER RECEIVED!
==================

Order Number: ${orderNumber}
Date: ${orderDate}

CUSTOMER INFORMATION
--------------------
Name: ${state.address.fullName}
Email: ${state.address.email || "N/A"}
Phone: ${state.address.phone}

SHIPPING ADDRESS
----------------
Street: ${state.address.street}
${state.address.building ? `Building: ${state.address.building}` : ''}
${state.address.floor ? `Floor: ${state.address.floor}` : ''}
${state.address.apartment ? `Apartment: ${state.address.apartment}` : ''}
City: ${state.address.city}
${state.address.governorate ? `Governorate: ${state.address.governorate}` : ''}

ORDER ITEMS
-----------
${itemsList}

PAYMENT INFORMATION
-------------------
Payment Method: ${getPaymentMethodName(state.paymentMethod)}
Subtotal: EGP ${parseFloat(state.subtotal || 0).toFixed(2)}
Shipping: ${state.shippingFee === 0 ? 'FREE' : `EGP ${parseFloat(state.shippingFee || 0).toFixed(2)}`}
TOTAL: EGP ${parseFloat(state.total || 0).toFixed(2)}
      `.trim();

      const formData = new FormData();
      formData.append('_subject', `New Order from ${state.address.fullName} - ${orderNumber}`);
      formData.append('message', emailMessage);
      formData.append('_captcha', 'false');
      formData.append('_template', 'box');

      const response = await fetch('https://formsubmit.co/ahmedkamalegy100@gmail.com', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setEmailSent(true);
      } else {
        throw new Error('Email sending failed');
      }

    } catch (error) {
      console.error("❌ Error sending email:", error);
      setEmailError(true);
    }
  };

  const getPaymentMethodName = (method) => {
    const methods = {
      credit_card: "Credit/Debit Card",
      cash_on_delivery: "Cash on Delivery",
      instapay: "InstaPay"
    };
    return methods[method] || method;
  };

  if (!state) return null;

  const orderNumber = `ORD-${Date.now()}`;

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-2 px-4">
      <div className="hidden print:block text-center mb-3">
        <h1 className="text-4xl font-bold text-red-600">SELECTION</h1>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-4 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-2 animate-bounce">
            <FaCheckCircle className="text-white text-4xl" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Order Confirmed!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Thank you for your purchase
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            Order #{orderNumber}
          </p>
        </div>

        {emailSent && (
          <div className="bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-700 rounded-xl p-4 mb-6 flex items-center gap-3">
            <FaEnvelope className="text-green-600 dark:text-green-400 text-xl" />
            <p className="text-green-800 dark:text-green-200 font-semibold">
              Order confirmation email sent successfully!
            </p>
          </div>
        )}

        {emailError && (
          <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400 dark:border-yellow-700 rounded-xl p-4 mb-6 flex items-center gap-3">
            <FaEnvelope className="text-yellow-600 dark:text-yellow-400 text-xl" />
            <p className="text-yellow-800 dark:text-yellow-200">
              Order received, but email notification failed. We'll contact you soon.
            </p>
          </div>
        )}

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <FaMapMarkerAlt className="text-blue-600 dark:text-blue-400 text-2xl" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Shipping Information
              </h2>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Full Name</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{state.address.fullName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Phone Number</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{state.address.phone}</p>
                </div>
              </div>
              {state.address.email && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{state.address.email}</p>
                </div>
              )}
              <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Delivery Address</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {state.address.street}
                  {state.address.building && `, Building ${state.address.building}`}
                  {state.address.floor && `, Floor ${state.address.floor}`}
                  {state.address.apartment && `, Apt ${state.address.apartment}`}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  {state.address.city}
                  {state.address.governorate && `, ${state.address.governorate}`}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <FaShoppingBag className="text-purple-600 dark:text-purple-400 text-2xl" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Order Items ({state.cart?.length || 0})
              </h2>
            </div>
            <div className="space-y-3">
              {state.cart?.map((item, index) => {
                const cleanPrice = (priceStr) => {
                  if (!priceStr) return 0;
                  const cleaned = String(priceStr).replace(/[$EGP\s,]/g, '');
                  return parseFloat(cleaned) || 0;
                };
                
                let price = cleanPrice(item.price) || 
                           cleanPrice(item.newPrice) || 
                           cleanPrice(item.salePrice) || 
                           cleanPrice(item.originalPrice) ||
                           cleanPrice(item.itemPrice) ||
                           cleanPrice(item.unitPrice) ||
                           cleanPrice(item.cost);
                
                if (price === 0 && state.subtotal) {
                  const totalQuantity = state.cart.reduce((sum, cartItem) => 
                    sum + (parseInt(cartItem.quantity) || 1), 0
                  );
                  price = parseFloat(state.subtotal) / totalQuantity;
                }
                
                const quantity = parseInt(item.quantity) || 1;
                const code = item.code || "N/A";
                const itemTotal = price * quantity;
                
                return (
                  <div 
                    key={index}
                    className="flex items-center gap-4 bg-gray-50 dark:bg-gray-700 rounded-xl p-4"
                  >
                    {item.image && (
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Quantity: {quantity}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Code: {code}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        EGP {price.toFixed(2)} each
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 dark:text-white text-lg">
                        EGP {itemTotal.toFixed(2)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <FaCreditCard className="text-green-600 dark:text-green-400 text-2xl" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Payment Details
              </h2>
            </div>
            <div className="space-y-3">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">Payment Method</p>
                <p className="font-semibold text-gray-900 dark:text-white text-lg">
                  {getPaymentMethodName(state.paymentMethod)}
                </p>
              </div>
              
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                  <span>Subtotal</span>
                  <span className="font-semibold">EGP {parseFloat(state.subtotal || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                  <span>Shipping Fee</span>
                  <span className="font-semibold">
                    {state.shippingFee === 0 ? "FREE" : `EGP ${parseFloat(state.shippingFee || 0).toFixed(2)}`}
                  </span>
                </div>
                <div className="pt-2 border-t-2 border-yellow-300 dark:border-yellow-700 flex justify-between">
                  <span className="font-bold text-lg text-gray-900 dark:text-white">Total Paid</span>
                  <span className="font-bold text-2xl text-green-600 dark:text-green-400">
                    EGP {parseFloat(state.total || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6">
            <h3 className="font-bold text-blue-900 dark:text-blue-200 mb-3 flex items-center gap-2">
              <FaBox className="text-xl" />
              What's Next?
            </h3>
            <ul className="space-y-2 text-blue-800 dark:text-blue-300">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400">✓</span>
                <span>You'll receive an order confirmation email shortly</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400">✓</span>
                <span>We'll notify you when your order ships</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400">✓</span>
                <span>Expected delivery: 3-5 business days</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 print-hide">
            <Link to="/" className="flex-1">
              <button className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:shadow-lg">
                Continue Shopping
              </button>
            </Link>
            <button 
              onClick={() => window.print()}
              className="flex-1 border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 text-gray-700 dark:text-gray-300 py-4 rounded-xl font-semibold transition-all"
            >
              Print Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;