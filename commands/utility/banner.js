const { SlashCommandBuilder } = require('discord.js');

module.exports = {
   new SlashCommandBuilder()
    .setName('banner')
    .setDescription('Show user banner')
    .addUserOption(option => option.setName('user').setDescription('User').setRequired(false)),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'utility')) {
      return interaction.reply({ content: '❌ Utility module is disabled.', ephemeral: true });
    }

    const user = interaction.options.getUser('user') || interaction.user;
    const fetched = await interaction.client.users.fetch(user.id, { force: true });
    const banner = fetched.bannerURL({ dynamic: true, size: 4096 });

    if (!banner) {
      return interaction.reply({ content: '🖼️ This user has no banner.', ephemeral: true });
    }

    await interaction.reply({ content: banner });
  },
};
