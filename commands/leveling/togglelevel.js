const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('togglelevel')
    .setDescription('Enable or disable leveling')
    .addBooleanOption(option => option.setName('enabled').setDescription('Enable leveling').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'leveling')) {
      return interaction.reply({ content: '❌ Leveling module is disabled.', ephemeral: true });
    }

    const enabled = interaction.options.getBoolean('enabled');
    await interaction.client.db.Guild.updateOne(
      { guildId: interaction.guild.id },
      { $set: { 'leveling.enabled': enabled } },
      { upsert: true }
    );
    await interaction.reply({ content: `✅ Leveling ${enabled ? 'enabled' : 'disabled'}.`, ephemeral: true });
  },
};
