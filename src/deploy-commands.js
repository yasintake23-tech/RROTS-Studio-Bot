require('dotenv').config();

const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

async function deployCommands() {
  const token = process.env.DISCORD_TOKEN;
  const clientId = process.env.CLIENT_ID;
  const guildId = process.env.GUILD_ID;

  const missing = [];
  if (!token) missing.push('DISCORD_TOKEN');
  if (!clientId) missing.push('CLIENT_ID');
  if (!guildId) missing.push('GUILD_ID');

  if (missing.length) {
    throw new Error(`Eksik environment variable: ${missing.join(', ')}`);
  }

  const commands = [];
  const commandsPath = path.join(__dirname, 'commands');
  const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

  for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    if (command.data) commands.push(command.data.toJSON());
  }

  const rest = new REST({ version: '10' }).setToken(token);

  console.log(`🔄 ${commands.length} slash komutu RROTS Studio sunucusuna yükleniyor...`);

  await rest.put(
    Routes.applicationGuildCommands(clientId, guildId),
    { body: commands },
  );

  console.log('✅ Slash komutları başarıyla yüklendi.');
}

module.exports = { deployCommands };

if (require.main === module) {
  deployCommands().catch((error) => {
    console.error(`❌ Komut yükleme hatası: ${error.message}`);
    process.exit(1);
  });
}
