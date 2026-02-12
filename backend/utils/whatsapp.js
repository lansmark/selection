// backend/utils/whatsapp.js
const https = require('https');

/**
 * Send WhatsApp message using Twilio API (or WhatsApp Business API)
 * Note: This requires Twilio account or WhatsApp Business API setup
 * For now, we'll create a clickable WhatsApp link
 * 
 * @param {string} phone - Recipient phone number (with country code)
 * @param {string} message - Message text to send
 * @returns {Object} - WhatsApp link and status
 */
const sendWhatsAppMessage = async (phone, message) => {
  // Remove all non-numeric characters
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Encode message for URL
  const encodedMessage = encodeURIComponent(message);
  
  // Create WhatsApp link
  const whatsappLink = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
  
  console.log('📱 WhatsApp link generated:', whatsappLink);
  
  return {
    ok: true,
    link: whatsappLink,
    message: 'WhatsApp link generated successfully'
  };
};

/**
 * Generate WhatsApp click-to-chat link for admin
 * @param {string} message - Message content
 * @returns {string} - WhatsApp URL
 */
const getAdminWhatsAppLink = (message) => {
  const adminPhone = process.env.WHATSAPP_PHONE || '201005566757';
  const cleanPhone = adminPhone.replace(/\D/g, '');
  const encodedMessage = encodeURIComponent(message);
  
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
};

/**
 * Send notification to admin about stock request
 * This creates a WhatsApp message that the system can log
 * In production, you'd use Twilio or WhatsApp Business API
 * 
 * @param {Object} notifyRequest - Notification request data
 */
const sendStockNotificationToAdmin = async (notifyRequest) => {
  const message = `
🔔 NEW STOCK NOTIFICATION REQUEST

📦 PRODUCT DETAILS:
- Name: ${notifyRequest.product_name}
- Code: ${notifyRequest.product_code}
- Brand: ${notifyRequest.product_brand}
- Price: ${notifyRequest.product_price}
- Category: ${notifyRequest.product_category}
- Gender: ${notifyRequest.product_gender}

👤 CUSTOMER DETAILS:
- Name: ${notifyRequest.customer_name}
- Email: ${notifyRequest.customer_email}
- Phone: ${notifyRequest.customer_phone}

📅 Request ID: ${notifyRequest.id}
⏰ Requested at: ${new Date().toLocaleString()}

⚠️ ACTION REQUIRED: Contact this customer when product is back in stock!
  `.trim();

  const adminPhone = process.env.WHATSAPP_PHONE || '201005566757';
  const link = getAdminWhatsAppLink(message);
  
  console.log('📱 WhatsApp notification prepared for admin');
  console.log('📱 Admin Phone:', adminPhone);
  console.log('📱 Link:', link);
  
  return {
    ok: true,
    link: link,
    phone: adminPhone,
    message: message
  };
};

module.exports = {
  sendWhatsAppMessage,
  getAdminWhatsAppLink,
  sendStockNotificationToAdmin
};