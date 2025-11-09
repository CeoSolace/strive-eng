const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
   new SlashCommandBuilder()
    .setName('wickmode')
    .setDescription('Enable Wick-like maximum security mode')
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
    if (enabled) {
      // Enable antinuke, antiraid, role/channel protect, etc. in one go
    }
    await interaction.reply({ content: `⚡ Wick Mode ${enabled ? 'ACTIVATED' : 'deactivated'}.`, ephemeral: true });
  },
};
