const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('archive')
    .setDescription('Archive a forum post')
    .addChannelOption(option =>
      option.setName('post')
        .setDescription('Forum post')
        .addChannelTypes(ChannelType.GuildForum)
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageThreads),
  async execute(interaction) {
    const post = interaction.options.getChannel('post');
    await post.setArchived(true);
    await interaction.reply({ content: '✅ Forum post archived.', ephemeral: true });
  },
};
