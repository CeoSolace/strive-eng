const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
   new SlashCommandBuilder()
    .setName('verifiedroles')
    .setDescription('Set roles that bypass security filters')
    .addRoleOption(option =>
      option.setName('role')
        .setDescription('Role to trust')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'security')) {
      return interaction.reply({ content: '❌ Security module is disabled.', ephemeral: true });
    }

    const role = interaction.options.getRole('role');
    // Store in DB: Guild.security.verifiedRoles.push(role.id)
    await interaction.reply({ content: `✅ Role ${role.name} marked as verified.`, ephemeral: true });
  },
};
