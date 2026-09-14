const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'serverinfo',
  description: 'Bulunduğun sunucu hakkında bilgi verir.',
  async execute(message) {
    const guild = message.guild;
    const owner = await guild.fetchOwner();

    const embed = new EmbedBuilder()
      .setTitle(`📊 ${guild.name}`)
      .setThumbnail(guild.iconURL({ size: 256 }) || null)
      .addFields(
        { name: '👑 Sahip', value: owner.user.tag, inline: true },
        { name: '👥 Üye', value: `${guild.memberCount}`, inline: true },
        { name: '💬 Kanal', value: `${guild.channels.cache.size}`, inline: true },
        { name: '🎭 Rol', value: `${guild.roles.cache.size}`, inline: true },
        { name: '🚀 Boost', value: `${guild.premiumSubscriptionCount ?? 0}`, inline: true },
        { name: '🆔 Sunucu ID', value: guild.id, inline: true },
      )
      .setFooter({ text: 'RROTS Studio • Server Info' })
      .setTimestamp();

    await message.reply({ embeds: [embed] });
  },
};
