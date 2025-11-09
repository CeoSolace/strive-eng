const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
   new SlashCommandBuilder()
    .setName('toggleleave')
    .setDescription('Enable or disable leave messages')
    .addBooleanOption(option =>
      option.setName('enabled')
        .setDescription('Enable leave messages')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'welcome')) {
      return interaction.reply({ content: '❌ Welcome module is disabled.', ephemeral: true });
    }

    const enabled = interaction.options.getBoolean('enabled');

    await interaction.client.db.Guild.updateOne(
      { guildId: interaction.guild.id },
      { $set: { 'leave.enabled': enabled } },
      { upsert: true }
    );

    await interaction.reply({ content: `✅ Leave messages ${enabled ? 'enabled' : 'disabled'}.`, ephemeral: true });
  },
};
