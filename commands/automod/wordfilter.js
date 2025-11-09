const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
   new SlashCommandBuilder()
    .setName('wordfilter')
    .setDescription('Block messages with blacklisted words')
    .addBooleanOption(option => option.setName('enabled').setDescription('Enable filter').setRequired(true))
    .addStringOption(option => option.setName('words').setDescription('Comma-separated words to block'))
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
    const words = interaction.options.getString('words');
    const action = interaction.options.getString('action') || 'delete';

    try {
      const update = { 'automod.wordfilter.enabled': enabled, 'automod.wordfilter.action': action };
      if (words) {
        const wordList = words.split(',').map(w => w.trim().toLowerCase()).filter(w => w.length > 0);
        if (wordList.length > 0) {
          update['automod.wordfilter.words'] = wordList;
        }
      }

      await interaction.client.db.Guild.updateOne(
        { guildId: interaction.guild.id },
        { $set: update },
        { upsert: true }
      );

      await interaction.reply({
        content: `✅ Word filter ${enabled ? 'enabled' : 'disabled'}${words ? ` with ${update['automod.wordfilter.words'].length} words` : ''}.`,
        ephemeral: true
      });
    } catch (err) {
      console.error('[AUTOMOD] Error in wordfilter:', err);
      await interaction.reply({ content: '❌ Failed to update settings.', ephemeral: true });
    }
  },
};
