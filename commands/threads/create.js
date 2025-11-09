const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('create')
    .setDescription('Create a public thread')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('Parent channel')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true))
    .addStringOption(option => option.setName('name').setDescription('Thread name').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.CreatePublicThreads),
  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');
    const name = interaction.options.getString('name');
    await channel.threads.create({ name });
    await interaction.reply({ content: `✅ Thread "${name}" created.`, ephemeral: true });
  },
};
