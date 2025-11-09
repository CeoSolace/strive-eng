const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
   new SlashCommandBuilder()
    .setName('antispam')
    .setDescription('Prevent message spamming')
    .addBooleanOption(option =>
      option.setName('enabled')
        .setDescription('Enable or disable')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('max_messages')
        .setDescription('Max messages in 10s (default: 5)')
        .setMinValue(2)
        .setMaxValue(20))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'security')) {
      return interaction.reply({ content: '❌ Security module is disabled.', ephemeral: true });
    }

    const enabled = interaction.options.getBoolean('enabled');
    const max = interaction.options.getInteger('max_messages') || 5;
    // Update DB
    await interaction.reply({ content: `⏱️ Anti-spam ${enabled ? `enabled (${max} msgs/10s)` : 'disabled'}.`, ephemeral: true });
  },
};
