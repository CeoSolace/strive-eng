const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('disable')
    .setDescription('Disable onboarding flow')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute(interaction) {
    await interaction.client.db.Guild.updateOne(
      { guildId: interaction.guild.id },
      { $set: { 'onboarding.enabled': false } }
    );
    await interaction.reply({ content: '✅ Onboarding disabled.', ephemeral: true });
  },
};
