require('dotenv').config();

const { deployCommands } = require('./deploy-commands');

async function start() {
  try {
    // Railway yeniden başlattığında slash komutları da otomatik güncellenir.
    await deployCommands();
    require('./index');
  } catch (error) {
    console.error('❌ Bot başlatılamadı:', error.message);
    process.exit(1);
  }
}

start();
