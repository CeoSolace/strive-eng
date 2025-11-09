const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
   new SlashCommandBuilder()
    .setName('ghostping')
    .setDescription('Alert on ghost pings (deleted @here/@everyone)')
    .addBooleanOption(option => option.setName('enabled').setDescription('Enable detection').setRequired(true))
    .addChannelOption(option => option.setName('log_channel').setDescription('Channel for alerts'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'automod')) {
      return interaction.reply({ content: '❌ AutoMod module is disabled.', ephemeral: true });
    }

    const enabled = interaction.options.getBoolean('enabled');
    const logChannel = interaction.options.getChannel('log_channel');

    try {
      const update = { 'automod.ghostping.enabled': enabled };
      if (logChannel) {
        update['automod.ghostping.logChannel'] = logChannel.id;
      }

      await interaction.client.db.Guild.updateOne(
        { guildId: interaction.guild.id },
        { $set: update },
        { upsert: true }
      );

      await interaction.reply({
        content: `✅ Ghost ping detection ${enabled ? 'enabled' : 'disabled'}.`,
        ephemeral: true
      });
    } catch (err) {
      console.error('[AUTOMOD] Error in ghostping:', err);
      await interaction.reply({ content: '❌ Failed to update settings.', ephemeral: true });
    }
  },
};
