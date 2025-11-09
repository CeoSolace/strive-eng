const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
   new SlashCommandBuilder()
    .setName('antizalgo')
    .setDescription('Block Zalgo text (e.g., t̴e̸x̴t̸)')
    .addBooleanOption(option =>
      option.setName('enabled')
        .setDescription('Enable or disable')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'security')) {
      return interaction.reply({ content: '❌ Security module is disabled.', ephemeral: true });
    }

    const enabled = interaction.options.getBoolean('enabled');
    // Update DB
    await interaction.reply({ content: `🌀 Anti-Zalgo ${enabled ? 'enabled' : 'disabled'}.`, ephemeral: true });
  },
};
