const { PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'ban',
  description: 'Bir üyeyi sunucudan yasaklar.',
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) {
      return message.reply('❌ Bu komut için **Üyeleri Yasakla** yetkisi gerekiyor.');
    }

    const user = message.mentions.users.first();
    if (!user) return message.reply('❌ Kullanım: `rn!ban @üye [sebep]`');
    if (user.id === message.author.id) return message.reply('❌ Kendini yasaklayamazsın.');

    const member = await message.guild.members.fetch(user.id).catch(() => null);
    if (member && !member.bannable) return message.reply('❌ Bu üyeyi yasaklayamıyorum. Botun rol sırasını ve yetkilerini kontrol et.');

    const reason = args.slice(1).join(' ') || 'Sebep belirtilmedi.';
    await message.guild.members.ban(user.id, { reason });
    await message.reply(`🔨 **${user.tag}** sunucudan yasaklandı.\n> Sebep: ${reason}`);
  },
};
