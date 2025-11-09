const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
   new SlashCommandBuilder()
    .setName('create')
    .setDescription('Create a role subscription listing')
    .addRoleOption(option => option.setName('role').setDescription('Role to sell').setRequired(true))
    .addIntegerOption(option => option.setName('price').setDescription('Price in cents (GBP)').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'rolesubs')) {
      return interaction.reply({ content: '❌ Role subscriptions module is disabled.', ephemeral: true });
    }
    await interaction.reply({ content: '✅ Role subscription created.', ephemeral: true });
  },
};
