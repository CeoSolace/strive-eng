const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('automod')
    .setDescription('Toggle AutoMod globally')
    .addBooleanOption(option => option.setName('enabled').setDescription('Enable AutoMod').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute(interaction) {
    const enabled = interaction.options.getBoolean('enabled');
    await interaction.client.db.Guild.updateOne(
      { guildId: interaction.guild.id },
      { $set: { 'automod.enabled': enabled } },
      { upsert: true }
    );
    await interaction.reply({ content: `✅ AutoMod ${enabled ? 'enabled' : 'disabled'}.`, ephemeral: true });
  },
};
