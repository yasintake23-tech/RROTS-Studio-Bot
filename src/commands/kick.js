const { PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'kick',
  description: 'Bir üyeyi sunucudan atar.',
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionFlagsBits.KickMembers)) {
      return message.reply('❌ Bu komut için **Üyeleri At** yetkisi gerekiyor.');
    }

    const user = message.mentions.users.first();
    if (!user) return message.reply('❌ Kullanım: `rn!kick @üye [sebep]`');
    if (user.id === message.author.id) return message.reply('❌ Kendini atamazsın.');

    const member = await message.guild.members.fetch(user.id).catch(() => null);
    if (!member) return message.reply('❌ Bu kullanıcı sunucuda bulunamadı.');
    if (!member.kickable) return message.reply('❌ Bu üyeyi atamıyorum. Botun rol sırasını ve yetkilerini kontrol et.');

    const reason = args.slice(1).join(' ') || 'Sebep belirtilmedi.';
    await member.kick(reason);
    await message.reply(`👢 **${user.tag}** sunucudan atıldı.\n> Sebep: ${reason}`);
  },
};
