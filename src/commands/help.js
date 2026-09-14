const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'help',
  description: 'Botun komutlarını gösterir.',
  async execute(message) {
    const embed = new EmbedBuilder()
      .setTitle('🤖 RROTS Studio Bot')
      .setDescription('Komutları **rn!** prefixi ile kullanabilirsin.')
      .addFields(
        {
          name: '🔧 Genel',
          value:
            '`rn!ping` — Gecikmeyi gösterir.\n' +
            '`rn!serverinfo` — Sunucu bilgilerini gösterir.\n' +
            '`rn!userinfo [@üye]` — Kullanıcı bilgilerini gösterir.\n' +
            '`rn!avatar [@üye]` — Avatarı gösterir.',
        },
        {
          name: '🛡️ Moderasyon',
          value:
            '`rn!clear <1-100>` — Mesajları siler.\n' +
            '`rn!kick @üye [sebep]` — Üyeyi atar.\n' +
            '`rn!ban @üye [sebep]` — Üyeyi yasaklar.\n' +
            '`rn!timeout @üye <1m|5m|10m|30m|1h|1d|7d> [sebep]` — Timeout verir.',
        },
      )
      .setFooter({ text: 'RROTS Studio • V1.2' })
      .setTimestamp();

    await message.reply({ embeds: [embed] });
  },
};
