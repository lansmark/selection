// backend/test-whatsapp.js
// Run this file to test WhatsApp connection: node test-whatsapp.js

const { whatsappService } = require('./utils/whatsapp');

console.log('🧪 Testing WhatsApp Service...\n');

// Wait 5 seconds for service to initialize
setTimeout(async () => {
  try {
    console.log('📊 Checking WhatsApp Status...');
    const status = whatsappService.getStatus();
    console.log('Status:', status);
    
    if (!status.isReady) {
      console.log('\n⚠️ WhatsApp is NOT ready yet!');
      console.log('Waiting 30 more seconds...\n');
      
      // Wait another 30 seconds
      setTimeout(async () => {
        const status2 = whatsappService.getStatus();
        console.log('Status after waiting:', status2);
        
        if (status2.isReady) {
          console.log('\n✅ WhatsApp is now ready!');
          await testSend();
        } else {
          console.log('\n❌ WhatsApp failed to initialize.');
          console.log('💡 Solutions:');
          console.log('1. Make sure you scanned the QR code with WhatsApp');
          console.log('2. Check if your main server is running (npm run dev)');
          console.log('3. Try deleting whatsapp-session folder and restart');
          process.exit(1);
        }
      }, 30000);
    } else {
      console.log('\n✅ WhatsApp is ready!');
      await testSend();
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Make sure your main server is running first (npm run dev)');
    process.exit(1);
  }
}, 5000);

async function testSend() {
  try {
    console.log('\n📤 Sending test message to 201005566757...');
    
    const result = await whatsappService.sendMessage(
      '201005566757',
      '🧪 TEST MESSAGE from Backend\n\n' +
      'This is a test from your e-commerce backend!\n\n' +
      'If you receive this message, WhatsApp notifications are working perfectly! ✅\n\n' +
      'Timestamp: ' + new Date().toLocaleString()
    );
    
    if (result) {
      console.log('\n🎉 SUCCESS! Test message sent!');
      console.log('📱 Check WhatsApp on phone number: 201005566757');
      console.log('\n✅ WhatsApp notifications are working correctly!');
    } else {
      console.log('\n❌ Failed to send test message');
      console.log('💡 Check if WhatsApp session is still active');
    }
    
    setTimeout(() => {
      console.log('\n✅ Test complete. Press Ctrl+C to exit.');
    }, 2000);
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('1. Make sure WhatsApp is connected (check server logs)');
    console.log('2. Verify phone number format: 201005566757 (no + or spaces)');
    console.log('3. Check if whatsapp-session folder exists');
    console.log('4. Try restarting your server');
  }
}

// Keep process alive
setInterval(() => {}, 1000);