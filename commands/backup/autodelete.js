const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('autodelete')
    .setDescription('Toggle auto-delete of old backups')
    .addBooleanOption(option => option.setName('enabled').setDescription('Enable auto-delete').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const enabled = interaction.options.getBoolean('enabled');
    await interaction.client.db.Guild.updateOne(
      { guildId: interaction.guild.id },
      { $set: { 'backup.autoDelete': enabled } },
      { upsert: true }
    );
    await interaction.reply({ content: `✅ Auto-delete ${enabled ? 'enabled' : 'disabled'}.`, ephemeral: true });
  },
};
