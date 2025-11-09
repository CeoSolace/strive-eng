const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
   new SlashCommandBuilder()
    .setName('togglewelcome')
    .setDescription('Enable or disable welcome messages')
    .addBooleanOption(option =>
      option.setName('enabled')
        .setDescription('Enable welcome messages')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'welcome')) {
      return interaction.reply({ content: '❌ Welcome module is disabled.', ephemeral: true });
    }

    const enabled = interaction.options.getBoolean('enabled');

    await interaction.client.db.Guild.updateOne(
      { guildId: interaction.guild.id },
      { $set: { 'welcome.enabled': enabled } },
      { upsert: true }
    );

    await interaction.reply({ content: `✅ Welcome messages ${enabled ? 'enabled' : 'disabled'}.`, ephemeral: true });
  },
};
