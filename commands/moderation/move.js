const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
   new SlashCommandBuilder()
    .setName('move')
    .setDescription('Move a user to another voice channel')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to move')
        .setRequired(true))
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('Target voice channel')
        .addChannelTypes(ChannelType.GuildVoice, ChannelType.GuildStageVoice)
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.MoveMembers),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'moderation')) {
      return interaction.reply({ content: '❌ Moderation module is disabled.', ephemeral: true });
    }

    const user = interaction.options.getUser('user');
    const channel = interaction.options.getChannel('channel');
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);

    if (!member || !member.voice.channel) {
      return interaction.reply({ content: '❌ User is not in a voice channel.', ephemeral: true });
    }

    if (!channel.permissionsFor(interaction.guild.members.me).has('Connect')) {
      return interaction.reply({ content: '❌ I cannot connect to that channel.', ephemeral: true });
    }

    try {
      await member.voice.setChannel(channel, `Moved by ${interaction.user.tag}`);
      await interaction.reply({ content: `✅ Moved ${user.tag} to ${channel.name}` });
    } catch (err) {
      await interaction.reply({ content: `❌ Failed to move user: ${err.message}`, ephemeral: true });
    }
  },
};
