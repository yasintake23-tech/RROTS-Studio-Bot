const {
  SlashCommandBuilder,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Bir kullanıcının avatarını gösterir.')
    .addUserOption((option) =>
      option
        .setName('kullanıcı')
        .setDescription('Avatarını görmek istediğin kullanıcı.')
        .setRequired(false)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser('kullanıcı') ?? interaction.user;
    const avatar = user.displayAvatarURL({ size: 4096, extension: 'png', forceStatic: false });

    await interaction.reply({
      content: `🖼️ **${user.tag}**\n${avatar}`,
    });
  },
};
