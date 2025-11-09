const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
   new SlashCommandBuilder()
    .setName('lockdown')
    .setDescription('Lock the current channel')
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for lockdown')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'moderation')) {
      return interaction.reply({ content: '❌ Moderation module is disabled.', ephemeral: true });
    }

    if (![ChannelType.GuildText, ChannelType.GuildAnnouncement].includes(interaction.channel.type)) {
      return interaction.reply({ content: '❌ This command only works in text channels.', ephemeral: true });
    }

    const reason = interaction.options.getString('reason') || 'No reason provided';

    try {
      await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
        SendMessages: false
      }, { reason: `${interaction.user.tag}: ${reason}` });

      await interaction.reply({ content: `🔒 Channel locked | ${reason}` });
    } catch (err) {
      await interaction.reply({ content: `❌ Failed to lock channel: ${err.message}`, ephemeral: true });
    }
  },
};
