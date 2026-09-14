const {
  SlashCommandBuilder,
  EmbedBuilder,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Bir kullanıcı hakkında bilgi verir.')
    .addUserOption((option) =>
      option
        .setName('kullanici')
        .setDescription('Bilgilerini görmek istediğin kullanıcı.')
        .setRequired(false)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser('kullanici') ?? interaction.user;
    const member = interaction.guild?.members.cache.get(user.id);

    const embed = new EmbedBuilder()
      .setTitle(`👤 ${user.tag}`)
      .setThumbnail(user.displayAvatarURL({ size: 256 }))
      .addFields(
        { name: '🆔 Kullanıcı ID', value: user.id, inline: true },
        {
          name: '🤖 Bot',
          value: user.bot ? 'Evet' : 'Hayır',
          inline: true,
        },
        {
          name: '📅 Hesap',
          value: `<t:${Math.floor(user.createdTimestamp / 1000)}:F>`,
          inline: false,
        },
      )
      .setTimestamp();

    if (member?.joinedTimestamp) {
      embed.addFields({
        name: '📥 Sunucuya katılım',
        value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>`,
        inline: false,
      });
    }

    await interaction.reply({ embeds: [embed] });
  },
};
