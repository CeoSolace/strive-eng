const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('list')
    .setDescription('List all server emojis')
    .setDefaultMemberPermissions(PermissionFlagsBits.ViewGuildInsights),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'emojis')) {
      return interaction.reply({ content: '❌ Emoji module is disabled.', ephemeral: true });
    }
    await interaction.reply({ content: '✅ Emoji list sent.', ephemeral: true });
  },
};
