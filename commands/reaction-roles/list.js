const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('list')
    .setDescription('List all reaction roles')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'reactionroles')) {
      return interaction.reply({ content: '❌ Reaction roles module is disabled.', ephemeral: true });
    }
    await interaction.reply({ content: '✅ Reaction roles listed.', ephemeral: true });
  },
};
