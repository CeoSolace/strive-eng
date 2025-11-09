const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
   new SlashCommandBuilder()
    .setName('filefilter')
    .setDescription('Block file uploads')
    .addBooleanOption(option => option.setName('enabled').setDescription('Enable filter').setRequired(true))
    .addStringOption(option => option.setName('extensions').setDescription('Blocked extensions (e.g. exe,scr)'))
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
    const extensions = interaction.options.getString('extensions');
    const action = interaction.options.getString('action') || 'delete';

    try {
      const update = { 'automod.filefilter.enabled': enabled, 'automod.filefilter.action': action };
      if (extensions) {
        const extList = extensions.split(',').map(e => e.trim().toLowerCase()).filter(e => e.length > 0);
        if (extList.length > 0) {
          update['automod.filefilter.extensions'] = extList;
        }
      }

      await interaction.client.db.Guild.updateOne(
        { guildId: interaction.guild.id },
        { $set: update },
        { upsert: true }
      );

      await interaction.reply({
        content: `✅ File filter ${enabled ? 'enabled' : 'disabled'}${extensions ? ` for ${update['automod.filefilter.extensions'].length} extensions` : ''}.`,
        ephemeral: true
      });
    } catch (err) {
      console.error('[AUTOMOD] Error in filefilter:', err);
      await interaction.reply({ content: '❌ Failed to update settings.', ephemeral: true });
    }
  },
};
