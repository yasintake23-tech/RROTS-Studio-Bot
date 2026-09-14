const { PermissionFlagsBits } = require('discord.js');

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
  name: 'timeout',
  description: 'Bir üyeye zaman aşımı uygular.',
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
      return message.reply('❌ Bu komut için **Üyeleri Denetle** yetkisi gerekiyor.');
    }

    const user = message.mentions.users.first();
    const durationKey = args.find((arg) => Object.hasOwn(DURATIONS, arg.toLowerCase()))?.toLowerCase();

    if (!user || !durationKey) {
      return message.reply('❌ Kullanım: `rn!timeout @üye <1m|5m|10m|30m|1h|1d|7d> [sebep]`');
    }

    if (user.id === message.author.id) return message.reply('❌ Kendine timeout veremezsin.');

    const member = await message.guild.members.fetch(user.id).catch(() => null);
    if (!member) return message.reply('❌ Bu kullanıcı sunucuda bulunamadı.');
    if (!member.moderatable) return message.reply('❌ Bu üyeye timeout uygulayamıyorum. Botun rol sırasını ve yetkilerini kontrol et.');

    const durationIndex = args.findIndex((arg) => arg.toLowerCase() === durationKey);
    const reason = args.slice(durationIndex + 1).join(' ') || 'Sebep belirtilmedi.';
    await member.timeout(DURATIONS[durationKey], reason);
    await message.reply(`⏱️ **${user.tag}** için **${durationKey}** zaman aşımı uygulandı.\n> Sebep: ${reason}`);
  },
};
