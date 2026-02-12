// backend/utils/telegram.js
const https = require('https');

/**
 * Send message to Telegram bot
 * @param {string} text - Message text to send
 * @returns {Promise} - Resolves with Telegram API response
 */
const sendTelegramMessage = async (text) => {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  // Check if credentials are configured
  if (!botToken || !chatId) {
    console.warn('⚠️ Telegram credentials not configured in .env');
    return { ok: false, error: 'Credentials not configured' };
  }

  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      chat_id: chatId,
      text: text,
      parse_mode: 'HTML'
    });

    const options = {
      hostname: 'api.telegram.org',
      port: 443,
      path: `/bot${botToken}/sendMessage`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          
          if (parsed.ok) {
            console.log('✅ Telegram message sent successfully');
            resolve(parsed);
          } else {
            console.error('❌ Telegram API error:', parsed.description);
            reject(new Error(`Telegram API error: ${parsed.description}`));
          }
        } catch (error) {
          console.error('❌ Failed to parse Telegram response:', error);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ Telegram request error:', error.message);
      reject(error);
    });

    req.write(data);
    req.end();
  });
};

/**
 * Send notification about low stock product
 * @param {Object} product - Product object
 */
const sendLowStockAlert = async (product) => {
  const message = `
⚠️ LOW STOCK ALERT

📦 Product: ${product.name}
🔢 Code: ${product.code}
📊 Current Stock: ${product.stock}
💰 Price: ${product.price}

Action Required: Restock this product soon!
  `;

  return sendTelegramMessage(message);
};

/**
 * Send notification about new order
 * @param {Object} order - Order object
 */
const sendNewOrderAlert = async (order) => {
  const message = `
🛍️ NEW ORDER RECEIVED!

📋 Order Number: ${order.order_number}
💰 Total Amount: EGP ${order.total_amount}
📦 Items: ${order.items?.length || 0}

👤 Customer: ${order.shipping_name}
📞 Phone: ${order.shipping_phone}
📍 Location: ${order.shipping_city}

Status: ${order.status}
Payment: ${order.payment_status}
  `;

  return sendTelegramMessage(message);
};

module.exports = {
  sendTelegramMessage,
  sendLowStockAlert,
  sendNewOrderAlert
};