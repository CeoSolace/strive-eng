const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
   new SlashCommandBuilder()
    .setName('capsfilter')
    .setDescription('Block messages with excessive caps')
    .addBooleanOption(option => option.setName('enabled').setDescription('Enable filter').setRequired(true))
    .addIntegerOption(option => option.setName('threshold').setDescription('Caps % threshold (default: 75)').setMinValue(50).setMaxValue(100))
    .addStringOption(option => option.setName('action').setDescription('Action on violation').addChoices(
      { name: 'Delete message', value: 'delete' },
      { name: 'Warn user', value: 'warn' },
      { name: 'Delete + Warn', value: 'both' }
    ))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'automod')) {
      return interaction.reply({ content: '❌ AutoMod module is disabled.', ephemeral: true });
    }

    const enabled = interaction.options.getBoolean('enabled');
    const threshold = interaction.options.getInteger('threshold') || 75;
    const action = interaction.options.getString('action') || 'delete';

    try {
      await interaction.client.db.Guild.updateOne(
        { guildId: interaction.guild.id },
        { $set: { 'automod.capsfilter.enabled': enabled, 'automod.capsfilter.threshold': threshold, 'automod.capsfilter.action': action } },
        { upsert: true }
      );

      await interaction.reply({
        content: `✅ Caps filter ${enabled ? 'enabled' : 'disabled'} (Threshold: ${threshold}%).`,
        ephemeral: true
      });
    } catch (err) {
      console.error('[AUTOMOD] Error in capsfilter:', err);
      await interaction.reply({ content: '❌ Failed to update settings.', ephemeral: true });
    }
  },
};
