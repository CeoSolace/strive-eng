const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
   new SlashCommandBuilder()
    .setName('invitefilter')
    .setDescription('Block Discord server invites')
    .addBooleanOption(option => option.setName('enabled').setDescription('Enable filter').setRequired(true))
    .addBooleanOption(option => option.setName('allow_partner').setDescription('Allow partner/server invites'))
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
    const allowPartner = interaction.options.getBoolean('allow_partner') || false;
    const action = interaction.options.getString('action') || 'delete';

    try {
      await interaction.client.db.Guild.updateOne(
        { guildId: interaction.guild.id },
        { $set: { 'automod.invitefilter.enabled': enabled, 'automod.invitefilter.allowPartner': allowPartner, 'automod.invitefilter.action': action } },
        { upsert: true }
      );

      await interaction.reply({
        content: `✅ Invite filter ${enabled ? 'enabled' : 'disabled'}${allowPartner ? ' (partner invites allowed)' : ''}.`,
        ephemeral: true
      });
    } catch (err) {
      console.error('[AUTOMOD] Error in invitefilter:', err);
      await interaction.reply({ content: '❌ Failed to update settings.', ephemeral: true });
    }
  },
};
