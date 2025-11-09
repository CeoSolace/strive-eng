const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
   new SlashCommandBuilder()
    .setName('roleprotect')
    .setDescription('Protect a role from being deleted/modified')
    .addRoleOption(option =>
      option.setName('role')
        .setDescription('Role to protect')
        .setRequired(true))
    .addBooleanOption(option =>
      option.setName('protect')
        .setDescription('Enable or disable protection')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'security')) {
      return interaction.reply({ content: '❌ Security module is disabled.', ephemeral: true });
    }

    const role = interaction.options.getRole('role');
    const protect = interaction.options.getBoolean('protect');

    if (protect) {
      await interaction.client.security.protectRole(interaction.guild.id, role.id);
    } else {
      // Unprotect logic in SecurityKernel
    }

    await interaction.reply({ content: `🛡️ Role ${role.name} ${protect ? 'protected' : 'unprotected'}.`, ephemeral: true });
  },
};
