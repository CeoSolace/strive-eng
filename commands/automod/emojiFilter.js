const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
   new SlashCommandBuilder()
    .setName('emojiFilter')
    .setDescription('Limit number of emojis per message')
    .addBooleanOption(option => option.setName('enabled').setDescription('Enable filter').setRequired(true))
    .addIntegerOption(option => option.setName('max').setDescription('Max emojis (default: 10)').setMinValue(1).setMaxValue(50))
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
    const max = interaction.options.getInteger('max') || 10;
    const action = interaction.options.getString('action') || 'delete';

    try {
      await interaction.client.db.Guild.updateOne(
        { guildId: interaction.guild.id },
        { $set: { 'automod.emojiFilter.enabled': enabled, 'automod.emojiFilter.max': max, 'automod.emojiFilter.action': action } },
        { upsert: true }
      );

      await interaction.reply({
        content: `✅ Emoji filter ${enabled ? 'enabled' : 'disabled'} (Max: ${max}).`,
        ephemeral: true
      });
    } catch (err) {
      console.error('[AUTOMOD] Error in emojiFilter:', err);
      await interaction.reply({ content: '❌ Failed to update settings.', ephemeral: true });
    }
  },
};
