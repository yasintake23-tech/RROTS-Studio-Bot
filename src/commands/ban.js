const {
  SlashCommandBuilder,
  PermissionFlagsBits,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bir üyeyi sunucudan yasaklar.')
    .addUserOption((option) =>
      option
        .setName('kullanıcı')
        .setDescription('Yasaklanacak üye.')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('sebep')
        .setDescription('Yasaklama sebebi.')
        .setRequired(false)
        .setMaxLength(512)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {
    if (!interaction.memberPermissions?.has(PermissionFlagsBits.BanMembers)) {
      return interaction.reply({
        content: '❌ Bu komut için **Üyeleri Yasakla** yetkisi gerekiyor.',
        ephemeral: true,
      });
    }

    const user = interaction.options.getUser('kullanıcı', true);
    const reason = interaction.options.getString('sebep') ?? 'Sebep belirtilmedi.';

    if (user.id === interaction.user.id) {
      return interaction.reply({
        content: '❌ Kendini yasaklayamazsın.',
        ephemeral: true,
      });
    }

    const member = await interaction.guild.members.fetch(user.id).catch(() => null);

    if (member && !member.bannable) {
      return interaction.reply({
        content: '❌ Bu üyeyi yasaklayamıyorum. Botun rol sırasını ve yetkilerini kontrol et.',
        ephemeral: true,
      });
    }

    await interaction.guild.members.ban(user.id, { reason });

    await interaction.reply(
      `🔨 **${user.tag}** sunucudan yasaklandı.\n> Sebep: ${reason}`
    );
  },
};
