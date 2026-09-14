const {
  SlashCommandBuilder,
  PermissionFlagsBits,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Belirtilen miktarda mesajı siler.')
    .addIntegerOption((option) =>
      option
        .setName('miktar')
        .setDescription('Silinecek mesaj sayısı (1-100).')
        .setMinValue(1)
        .setMaxValue(100)
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    if (!interaction.memberPermissions?.has(PermissionFlagsBits.ManageMessages)) {
      return interaction.reply({
        content: '❌ Bu komut için **Mesajları Yönet** yetkisi gerekiyor.',
        ephemeral: true,
      });
    }

    const amount = interaction.options.getInteger('miktar', true);

    try {
      const deleted = await interaction.channel.bulkDelete(amount, true);

      await interaction.reply({
        content: `🧹 **${deleted.size}** mesaj silindi.`,
      });
    } catch (error) {
      console.error('Clear hatası:', error);
      await interaction.reply({
        content: '❌ Mesajlar silinirken hata oluştu. Kanalın mesaj yönetimi yetkisini kontrol et.',
        ephemeral: true,
      });
    }
  },
};
