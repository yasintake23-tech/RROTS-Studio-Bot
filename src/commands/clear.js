const { PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'clear',
  description: 'Belirtilen miktarda mesajı siler.',
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
      return message.reply('❌ Bu komut için **Mesajları Yönet** yetkisi gerekiyor.');
    }

    const amount = Number.parseInt(args[0], 10);
    if (!Number.isInteger(amount) || amount < 1 || amount > 100) {
      return message.reply('❌ Kullanım: `rn!clear <1-100>`');
    }

    try {
      const deleted = await message.channel.bulkDelete(amount + 1, true);
      const botCommandIncluded = deleted.has(message.id);
      const count = Math.max(0, deleted.size - (botCommandIncluded ? 1 : 0));
      const reply = await message.channel.send(`🧹 **${count}** mesaj silindi.`);
      setTimeout(() => reply.delete().catch(() => {}), 4000);
    } catch (error) {
      console.error('Clear hatası:', error);
      await message.reply('❌ Mesajlar silinirken hata oluştu. Botun **Mesajları Yönet** yetkisini kontrol et.');
    }
  },
};
