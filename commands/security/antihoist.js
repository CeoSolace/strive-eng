const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
   new SlashCommandBuilder()
    .setName('antihoist')
    .setDescription('Prevent role/member hoisting (e.g., !, 0)')
    .addBooleanOption(option =>
      option.setName('enabled')
        .setDescription('Enable or disable')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'security')) {
      return interaction.reply({ content: '❌ Security module is disabled.', ephemeral: true });
    }

    const enabled = interaction.options.getBoolean('enabled');
    // Update DB
    await interaction.reply({ content: `🏷️ Anti-hoist ${enabled ? 'enabled' : 'disabled'}.`, ephemeral: true });
  },
};
