require('dotenv').config();

const {
  Client,
  Collection,
  GatewayIntentBits,
  Events,
} = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

const PREFIX = 'rn!';
const token = process.env.DISCORD_TOKEN;

if (!token) {
  console.error('❌ DISCORD_TOKEN bulunamadı. Railway Variables bölümüne bot tokenini ekle.');
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildPresences,
  ],
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  if (!command.name || typeof command.execute !== 'function') {
    console.warn(`⚠️ ${file} geçerli bir prefix komutu değil, atlandı.`);
    continue;
  }
  client.commands.set(command.name, command);
}

client.once(Events.ClientReady, (readyClient) => {
  console.log(`✅ ${readyClient.user.tag} olarak giriş yapıldı.`);
  console.log(`📡 ${readyClient.guilds.cache.size} sunucuda aktif.`);
  console.log(`🧩 ${client.commands.size} prefix komutu hazır.`);
  console.log(`⌨️ Prefix: ${PREFIX}`);
});

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot || !message.guild) return;

  const content = message.content.trim();
  if (!content.toLowerCase().startsWith(PREFIX)) return;

  const withoutPrefix = content.slice(PREFIX.length).trim();
  if (!withoutPrefix) return;

  const parts = withoutPrefix.split(/\s+/);
  const commandName = parts.shift().toLowerCase();
  const args = parts;
  const command = client.commands.get(commandName);

  if (!command) return;

  try {
    await command.execute(message, args);
  } catch (error) {
    console.error(`${PREFIX}${commandName} komutunda hata:`, error);
    await message.reply('❌ Komut çalıştırılırken bir hata oluştu.').catch(() => {});
  }
});

process.on('unhandledRejection', (error) => console.error('❌ Yakalanmamış Promise hatası:', error));
process.on('uncaughtException', (error) => console.error('❌ Yakalanmamış hata:', error));

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    console.log(`🛑 ${signal} alındı, bot kapatılıyor...`);
    client.destroy();
    process.exit(0);
  });
}

client.login(token).catch((error) => {
  console.error('❌ Discord giriş hatası:', error.message);
  process.exit(1);
});
