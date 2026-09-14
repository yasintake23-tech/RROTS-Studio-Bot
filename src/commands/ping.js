module.exports = {
  name: 'ping',
  description: 'Botun gecikmesini gösterir.',
  async execute(message) {
    const sent = await message.reply('🏓 Hesaplanıyor...');
    const apiLatency = Math.max(0, sent.createdTimestamp - message.createdTimestamp);
    const wsLatency = message.client.ws.ping;
    await sent.edit(
      `🏓 **Pong!**\n> Yanıt: **${apiLatency}ms**\n> WebSocket: **${wsLatency}ms**`
    );
  },
};
