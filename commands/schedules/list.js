const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('list')
    .setDescription('List all scheduled broadcasts')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'schedules')) {
      return interaction.reply({ content: '❌ Schedules module is disabled.', ephemeral: true });
    }
    await interaction.reply({ content: '✅ Upcoming broadcasts listed.', ephemeral: true });
  },
};
