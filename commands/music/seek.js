const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
   new SlashCommandBuilder()
    .setName('seek')
    .setDescription('Seek the music queue')
    .setDefaultMemberPermissions(PermissionFlagsBits.Speak),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'music')) {
      return interaction.reply({ content: '❌ Music module is disabled.', ephemeral: true });
    }
    await interaction.reply({ content: '✅ Music command executed.', ephemeral: true });
  },
};
