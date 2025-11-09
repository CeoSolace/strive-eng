const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
   new SlashCommandBuilder()
    .setName('botfilter')
    .setDescription('Block non-whitelisted bots from joining')
    .addBooleanOption(option =>
      option.setName('enabled')
        .setDescription('Enable or disable')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'security')) {
      return interaction.reply({ content: '❌ Security module is disabled.', ephemeral: true });
    }

    const enabled = interaction.options.getBoolean('enabled');
    // Update DB
    await interaction.reply({ content: `🤖 Bot filter ${enabled ? 'enabled' : 'disabled'}.`, ephemeral: true });
  },
};
