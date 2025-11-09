const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('transcript')
    .setDescription('Save ticket transcript')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'tickets')) {
      return interaction.reply({ content: '❌ Tickets module is disabled.', ephemeral: true });
    }
    await interaction.reply({ content: '✅ Transcript saved.', ephemeral: true });
  },
};
