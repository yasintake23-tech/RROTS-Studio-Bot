const {
  SlashCommandBuilder,
  EmbedBuilder,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Botun komutlarını gösterir.'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('🤖 RROTS Studio Bot')
      .setDescription('Temel komutlar ve kullanım alanları:')
      .addFields(
        {
          name: '🔧 Genel',
          value:
            '`/ping` — Gecikmeyi gösterir.\n' +
            '`/serverinfo` — Sunucu bilgilerini gösterir.\n' +
            '`/userinfo` — Kullanıcı bilgilerini gösterir.\n' +
            '`/avatar` — Avatarı gösterir.',
        },
        {
          name: '🛡️ Moderasyon',
          value:
            '`/clear` — Mesajları siler.\n' +
            '`/kick` — Üyeyi atar.\n' +
            '`/ban` — Üyeyi yasaklar.\n' +
            '`/timeout` — Zaman aşımı verir.',
        },
      )
      .setFooter({ text: 'RROTS Studio • V1' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
