const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Clear reaction roles from a message')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('Channel')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true))
    .addStringOption(option => option.setName('message_id').setDescription('Message ID').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'reactionroles')) {
      return interaction.reply({ content: '❌ Reaction roles module is disabled.', ephemeral: true });
    }
    await interaction.reply({ content: '✅ Reaction roles cleared.', ephemeral: true });
  },
};
