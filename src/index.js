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

if (!token || !token.trim()) {
  console.error('❌ DISCORD_TOKEN bulunamadı. Railway > Variables bölümüne eklenmelidir.');
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
  allowedMentions: {
    repliedUser: false,
  },
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith('.js'))
  .sort();

for (const file of commandFiles) {
  try {
    const command = require(path.join(commandsPath, file));

    if (!command?.name || typeof command.execute !== 'function') {
      console.warn(`⚠️ ${file} geçerli bir komut değil, atlandı.`);
      continue;
    }

    const name = String(command.name).trim().toLowerCase();
    client.commands.set(name, command);
  } catch (error) {
    console.error(`❌ ${file} yüklenemedi:`, error);
  }
}

client.once(Events.ClientReady, (readyClient) => {
  console.log(`✅ ${readyClient.user.tag} olarak giriş yapıldı.`);
  console.log(`📡 ${readyClient.guilds.cache.size} sunucuda aktif.`);
  console.log(`🧩 ${client.commands.size} prefix komutu hazır.`);
  console.log(`⌨️ Prefix: ${PREFIX}`);
  console.log('👂 MessageCreate dinleyicisi aktif.');
});

client.on(Events.MessageCreate, async (message) => {
  try {
    if (message.author?.bot) return;
    if (!message.guild) return;

    const content = typeof message.content === 'string' ? message.content.trim() : '';
    if (!content) return;

    if (!content.toLowerCase().startsWith(PREFIX)) return;

    const withoutPrefix = content.slice(PREFIX.length).trim();

    if (!withoutPrefix) {
      const help = client.commands.get('help');
      if (help) await help.execute(message, []);
      return;
    }

    const parts = withoutPrefix.split(/\s+/);
    const commandName = String(parts.shift() || '').toLowerCase();
    const args = parts;
    const command = client.commands.get(commandName);

    console.log(
      `📨 Komut algılandı: ${PREFIX}${commandName} | kullanıcı=${message.author.tag} | kanal=${message.channel.id}`
    );

    if (!command) {
      await message.reply(
        `❓ \`${PREFIX}${commandName}\` diye bir komut yok. \`${PREFIX}help\` yazarak komutları görebilirsin.`
      );
      return;
    }

    await command.execute(message, args);
  } catch (error) {
    console.error('❌ MessageCreate/komut hatası:', error);

    try {
      if (message?.channel?.isSendable?.()) {
        await message.reply('❌ Komut çalıştırılırken bir hata oluştu.');
      }
    } catch (replyError) {
      console.error('❌ Hata mesajı gönderilemedi:', replyError);
    }
  }
});

process.on('unhandledRejection', (error) => {
  console.error('❌ Yakalanmamış Promise hatası:', error);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Yakalanmamış hata:', error);
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    console.log(`🛑 ${signal} alındı, bot kapatılıyor...`);
    client.destroy();
    process.exit(0);
  });
}

client.login(token).catch((error) => {
  console.error('❌ Discord giriş hatası:', error);
  process.exit(1);
});
