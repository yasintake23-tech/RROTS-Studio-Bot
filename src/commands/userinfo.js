const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'userinfo',
  description: 'Bir kullanıcı hakkında bilgi verir.',
  async execute(message) {
    const user = message.mentions.users.first() || message.author;
    const member = message.guild.members.cache.get(user.id);

    const embed = new EmbedBuilder()
      .setTitle(`👤 ${user.tag}`)
      .setThumbnail(user.displayAvatarURL({ size: 256 }))
      .addFields(
        { name: '🆔 Kullanıcı ID', value: user.id, inline: true },
        { name: '🤖 Bot', value: user.bot ? 'Evet' : 'Hayır', inline: true },
        { name: '📅 Hesap', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:F>`, inline: false },
      )
      .setTimestamp();

    if (member?.joinedTimestamp) {
      embed.addFields({
        name: '📥 Sunucuya katılım',
        value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>`,
        inline: false,
      });
    }

    await message.reply({ embeds: [embed] });
  },
};
