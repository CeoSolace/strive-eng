const { SlashCommandBuilder } = require('discord.js');

module.exports = {
   new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Show user avatar')
    .addUserOption(option => option.setName('user').setDescription('User').setRequired(false)),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'utility')) {
      return interaction.reply({ content: '❌ Utility module is disabled.', ephemeral: true });
    }

    const user = interaction.options.getUser('user') || interaction.user;
    const avatarURL = user.displayAvatarURL({ dynamic: true, size: 4096 });
    await interaction.reply({ content: avatarURL });
  },
};
