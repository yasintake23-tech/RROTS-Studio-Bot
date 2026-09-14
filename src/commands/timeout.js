const {
  SlashCommandBuilder,
  PermissionFlagsBits,
} = require('discord.js');

const DURATIONS = {
  '1m': 60_000,
  '5m': 5 * 60_000,
  '10m': 10 * 60_000,
  '30m': 30 * 60_000,
  '1h': 60 * 60_000,
  '1d': 24 * 60 * 60_000,
  '7d': 7 * 24 * 60 * 60_000,
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Bir üyeye zaman aşımı uygular.')
    .addUserOption((option) =>
      option
        .setName('kullanıcı')
        .setDescription('Zaman aşımı uygulanacak üye.')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('süre')
        .setDescription('Süre: 1m, 5m, 10m, 30m, 1h, 1d veya 7d')
        .setRequired(true)
        .addChoices(
          { name: '1 dakika', value: '1m' },
          { name: '5 dakika', value: '5m' },
          { name: '10 dakika', value: '10m' },
          { name: '30 dakika', value: '30m' },
          { name: '1 saat', value: '1h' },
          { name: '1 gün', value: '1d' },
          { name: '7 gün', value: '7d' },
        )
    )
    .addStringOption((option) =>
      option
        .setName('sebep')
        .setDescription('Zaman aşımı sebebi.')
        .setRequired(false)
        .setMaxLength(512)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    if (!interaction.memberPermissions?.has(PermissionFlagsBits.ModerateMembers)) {
      return interaction.reply({
        content: '❌ Bu komut için **Üyeleri Denetle** yetkisi gerekiyor.',
        ephemeral: true,
      });
    }

    const user = interaction.options.getUser('kullanıcı', true);
    const durationKey = interaction.options.getString('süre', true);
    const reason = interaction.options.getString('sebep') ?? 'Sebep belirtilmedi.';

    if (user.id === interaction.user.id) {
      return interaction.reply({
        content: '❌ Kendine timeout veremezsin.',
        ephemeral: true,
      });
    }

    const member = await interaction.guild.members.fetch(user.id).catch(() => null);

    if (!member) {
      return interaction.reply({
        content: '❌ Bu kullanıcı sunucuda bulunamadı.',
        ephemeral: true,
      });
    }

    if (!member.moderatable) {
      return interaction.reply({
        content: '❌ Bu üyeye timeout uygulayamıyorum. Botun rol sırasını ve yetkilerini kontrol et.',
        ephemeral: true,
      });
    }

    await member.timeout(DURATIONS[durationKey], reason);

    await interaction.reply(
      `⏱️ **${user.tag}** için **${durationKey}** zaman aşımı uygulandı.\n> Sebep: ${reason}`
    );
  },
};
