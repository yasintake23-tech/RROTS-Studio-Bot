const {
  SlashCommandBuilder,
  PermissionFlagsBits,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Bir üyeyi sunucudan atar.')
    .addUserOption((option) =>
      option
        .setName('kullanici')
        .setDescription('Atılacak üye.')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('sebep')
        .setDescription('Atma sebebi.')
        .setRequired(false)
        .setMaxLength(512)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  async execute(interaction) {
    if (!interaction.memberPermissions?.has(PermissionFlagsBits.KickMembers)) {
      return interaction.reply({
        content: '❌ Bu komut için **Üyeleri At** yetkisi gerekiyor.',
        ephemeral: true,
      });
    }

    const user = interaction.options.getUser('kullanici', true);
    const reason = interaction.options.getString('sebep') ?? 'Sebep belirtilmedi.';

    if (user.id === interaction.user.id) {
      return interaction.reply({
        content: '❌ Kendini atamazsın.',
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

    if (!member.kickable) {
      return interaction.reply({
        content: '❌ Bu üyeyi atamıyorum. Botun rol sırasını ve yetkilerini kontrol et.',
        ephemeral: true,
      });
    }

    await member.kick(reason);

    await interaction.reply(
      `👢 **${user.tag}** sunucudan atıldı.\n> Sebep: ${reason}`
    );
  },
};
