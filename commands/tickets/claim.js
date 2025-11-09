const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('claim')
    .setDescription('Claim a ticket as yours')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'tickets')) {
      return interaction.reply({ content: '❌ Tickets module is disabled.', ephemeral: true });
    }
    await interaction.reply({ content: '✅ Ticket claimed.', ephemeral: true });
  },
};
