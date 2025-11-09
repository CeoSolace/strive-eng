const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
   new SlashCommandBuilder()
    .setName('mentionfilter')
    .setDescription('Limit user mentions per message')
    .addBooleanOption(option => option.setName('enabled').setDescription('Enable filter').setRequired(true))
    .addIntegerOption(option => option.setName('max').setDescription('Max mentions (default: 5)').setMinValue(1).setMaxValue(20))
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
    const max = interaction.options.getInteger('max') || 5;
    const action = interaction.options.getString('action') || 'delete';

    try {
      await interaction.client.db.Guild.updateOne(
        { guildId: interaction.guild.id },
        { $set: { 'automod.mentionfilter.enabled': enabled, 'automod.mentionfilter.max': max, 'automod.mentionfilter.action': action } },
        { upsert: true }
      );

      await interaction.reply({
        content: `✅ Mention filter ${enabled ? 'enabled' : 'disabled'} (Max: ${max}).`,
        ephemeral: true
      });
    } catch (err) {
      console.error('[AUTOMOD] Error in mentionfilter:', err);
      await interaction.reply({ content: '❌ Failed to update settings.', ephemeral: true });
    }
  },
};
