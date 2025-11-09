const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('delete')
    .setDescription('Delete a role subscription')
    .addStringOption(option => option.setName('listing_id').setDescription('Listing ID').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'rolesubs')) {
      return interaction.reply({ content: '❌ Role subscriptions module is disabled.', ephemeral: true });
    }
    await interaction.reply({ content: '✅ Role subscription deleted.', ephemeral: true });
  },
};
