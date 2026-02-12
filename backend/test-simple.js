const { whatsappService } = require('./utils/whatsapp');

console.log('Testing WhatsApp...');

setTimeout(async () => {
  try {
    console.log('Sending test message...');
    await whatsappService.sendMessage('201005566757', 'TEST from backend! ✅');
    console.log('Done! Check WhatsApp.');
  } catch (err) {
    console.error('Error:', err.message);
  }
  process.exit(0);
}, 10000);