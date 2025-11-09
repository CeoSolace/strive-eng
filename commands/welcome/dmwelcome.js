const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
   new SlashCommandBuilder()
    .setName('dmwelcome')
    .setDescription('Toggle welcome DMs')
    .addBooleanOption(option =>
      option.setName('enabled')
        .setDescription('Enable DM welcomes')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'welcome')) {
      return interaction.reply({ content: '❌ Welcome module is disabled.', ephemeral: true });
    }

    const enabled = interaction.options.getBoolean('enabled');

    await interaction.client.db.Guild.updateOne(
      { guildId: interaction.guild.id },
      { $set: { 'welcome.dmEnabled': enabled } },
      { upsert: true }
    );

    await interaction.reply({ content: `✅ Welcome DMs ${enabled ? 'enabled' : 'disabled'}.`, ephemeral: true });
  },
};
