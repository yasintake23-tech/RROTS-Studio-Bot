module.exports = {
  name: 'avatar',
  description: 'Bir kullanıcının avatarını gösterir.',
  async execute(message) {
    const user = message.mentions.users.first() || message.author;
    const avatar = user.displayAvatarURL({ size: 4096, extension: 'png', forceStatic: false });
    await message.reply(`🖼️ **${user.tag}**\n${avatar}`);
  },
};
