const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
   new SlashCommandBuilder()
    .setName('toggleautorole')
    .setDescription('Enable or disable the autorole system')
    .addBooleanOption(option =>
      option.setName('enabled')
        .setDescription('Enable autorole?')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'autorole')) {
      return interaction.reply({ content: '❌ Autorole module is disabled.', ephemeral: true });
    }

    const enabled = interaction.options.getBoolean('enabled');

    try {
      await interaction.client.db.Guild.updateOne(
        { guildId: interaction.guild.id },
        { $set: { 'autorole.enabled': enabled } },
        { upsert: true }
      );

      await interaction.reply({
        content: `✅ Autorole system ${enabled ? 'enabled' : 'disabled'}.`,
        ephemeral: true
      });
    } catch (err) {
      console.error('[AUTOROLE] Toggle error:', err);
      await interaction.reply({ content: '❌ Failed to update setting.', ephemeral: true });
    }
  },
};
