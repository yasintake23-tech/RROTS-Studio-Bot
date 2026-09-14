const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Botun gecikmesini gösterir.'),

  async execute(interaction) {
    const sent = await interaction.reply({
      content: '🏓 Hesaplanıyor...',
      fetchReply: true,
    });

    const apiLatency = Math.max(0, sent.createdTimestamp - interaction.createdTimestamp);
    const wsLatency = interaction.client.ws.ping;

    await interaction.editReply(
      `🏓 **Pong!**\n` +
      `> Yanıt: **${apiLatency}ms**\n` +
      `> WebSocket: **${wsLatency}ms**`
    );
  },
};
