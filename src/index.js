require('dotenv').config();

const {
  Client,
  Collection,
  GatewayIntentBits,
  Events,
} = require('discord.js');

const fs = require('node:fs');
const path = require('node:path');

const token = process.env.DISCORD_TOKEN;

if (!token) {
  console.error('DISCORD_TOKEN bulunamadı. .env dosyanı kontrol et.');
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
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);

  if (!command.data || !command.execute) {
    console.warn(`${file} geçerli bir komut değil.`);
    continue;
  }

  client.commands.set(command.data.name, command);
}

client.once(Events.ClientReady, (readyClient) => {
  console.log(`✅ ${readyClient.user.tag} olarak giriş yapıldı.`);
  console.log(`📡 ${readyClient.guilds.cache.size} sunucuda aktif.`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(`/${interaction.commandName} komutunda hata:`, error);

    const payload = {
      content: '❌ Komut çalıştırılırken bir hata oluştu.',
      ephemeral: true,
    };

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(payload).catch(() => {});
    } else {
      await interaction.reply(payload).catch(() => {});
    }
  }
});

process.on('unhandledRejection', (error) => {
  console.error('Yakalanmamış Promise hatası:', error);
});

process.on('uncaughtException', (error) => {
  console.error('Yakalanmamış hata:', error);
});

client.login(token);
