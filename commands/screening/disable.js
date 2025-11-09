const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('disable')
    .setDescription('Disable member screening')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute(interaction) {
    await interaction.client.db.Guild.updateOne(
      { guildId: interaction.guild.id },
      { $set: { 'screening.enabled': false } }
    );
    await interaction.reply({ content: '✅ Member screening disabled.', ephemeral: true });
  },
};
