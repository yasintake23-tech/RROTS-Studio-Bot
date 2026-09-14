require('dotenv').config();

const {
  REST,
  Routes,
} = require('discord.js');

const fs = require('node:fs');
const path = require('node:path');

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

if (!token || !clientId || !guildId) {
  console.error('DISCORD_TOKEN, CLIENT_ID ve GUILD_ID .env içinde doldurulmalı.');
  process.exit(1);
}

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  if (command.data) {
    commands.push(command.data.toJSON());
  }
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    console.log(`🔄 ${commands.length} komut RROTS Studio sunucusuna yükleniyor...`);

    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands },
    );

    console.log('✅ Slash komutları başarıyla yüklendi.');
  } catch (error) {
    console.error('❌ Komut yükleme hatası:', error);
    process.exit(1);
  }
})();
