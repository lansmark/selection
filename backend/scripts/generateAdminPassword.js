// backend/scripts/generateAdminPassword.js
const bcrypt = require('bcryptjs');

async function generatePasswordHash() {
  const password = process.argv[2] || 'admin123';
  
  console.log('\n🔐 Generating secure password hash...\n');
  
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    
    console.log('Password:', password);
    console.log('Hash:', hash);
    console.log('\n📋 Copy this line to your .env file:');
    console.log(`ADMIN_PASSWORD_HASH=${hash}`);
    console.log('\n✅ Done!\n');
  } catch (error) {
    console.error('Error:', error);
  }
}

generatePasswordHash();