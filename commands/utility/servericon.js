const { SlashCommandBuilder } = require('discord.js');

module.exports = {
   new SlashCommandBuilder()
    .setName('servericon')
    .setDescription('Show server icon'),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'utility')) {
      return interaction.reply({ content: '❌ Utility module is disabled.', ephemeral: true });
    }

    const icon = interaction.guild.iconURL({ dynamic: true, size: 4096 });
    if (!icon) {
      return interaction.reply({ content: '🖼️ This server has no icon.', ephemeral: true });
    }

    await interaction.reply({ content: icon });
  },
};
