const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
   new SlashCommandBuilder()
    .setName('linkfilter')
    .setDescription('Block external links')
    .addBooleanOption(option => option.setName('enabled').setDescription('Enable filter').setRequired(true))
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
    const action = interaction.options.getString('action') || 'delete';

    try {
      await interaction.client.db.Guild.updateOne(
        { guildId: interaction.guild.id },
        { $set: { 'automod.linkfilter.enabled': enabled, 'automod.linkfilter.action': action } },
        { upsert: true }
      );

      await interaction.reply({
        content: `✅ Link filter ${enabled ? 'enabled' : 'disabled'} (Action: ${action}).`,
        ephemeral: true
      });
    } catch (err) {
      console.error('[AUTOMOD] Error in linkfilter:', err);
      await interaction.reply({ content: '❌ Failed to update settings.', ephemeral: true });
    }
  },
};
