const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('end')
    .setDescription('End a stage instance')
    .addChannelOption(option =>
      option.setName('stage')
        .setDescription('Stage channel')
        .addChannelTypes(ChannelType.GuildStageVoice)
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  async execute(interaction) {
    const stage = interaction.options.getChannel('stage');
    await stage.delete();
    await interaction.reply({ content: '✅ Stage ended.', ephemeral: true });
  },
};
