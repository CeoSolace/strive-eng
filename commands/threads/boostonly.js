const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('boostonly')
    .setDescription('Restrict thread to boosters')
    .addChannelOption(option =>
      option.setName('thread')
        .setDescription('Thread')
        .addChannelTypes(ChannelType.PublicThread, ChannelType.PrivateThread)
        .setRequired(true))
    .addBooleanOption(option => option.setName('enabled').setDescription('Enable restriction').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageThreads),
  async execute(interaction) {
    const thread = interaction.options.getChannel('thread');
    const enabled = interaction.options.getBoolean('enabled');
    await thread.setLocked(enabled); // Simplified
    await interaction.reply({ content: `✅ Booster restriction ${enabled ? 'enabled' : 'disabled'}.`, ephemeral: true });
  },
};
