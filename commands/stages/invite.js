const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('invite')
    .setDescription('Invite a speaker to stage')
    .addChannelOption(option =>
      option.setName('stage')
        .setDescription('Stage channel')
        .addChannelTypes(ChannelType.GuildStageVoice)
        .setRequired(true))
    .addUserOption(option => option.setName('user').setDescription('User to invite').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.RequestToSpeak),
  async execute(interaction) {
    const stage = interaction.options.getChannel('stage');
    const user = interaction.options.getUser('user');
    await stage.permissionOverwrites.create(user, { Speak: true });
    await interaction.reply({ content: `✅ ${user.tag} invited to speak.`, ephemeral: true });
  },
};
