const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
   new SlashCommandBuilder()
    .setName('antiraid')
    .setDescription('Toggle anti-raid protection')
    .addBooleanOption(option =>
      option.setName('enabled')
        .setDescription('Enable or disable')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'security')) {
      return interaction.reply({ content: '❌ Security module is disabled.', ephemeral: true });
    }

    const enabled = interaction.options.getBoolean('enabled');
    // In real app: update DB Guild.security.antiraid = enabled
    await interaction.reply({ content: `🛡️ Anti-raid ${enabled ? 'enabled' : 'disabled'}.`, ephemeral: true });
  },
};
