const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const ms = require('ms');

module.exports = {
   new SlashCommandBuilder()
    .setName('slowmode')
    .setDescription('Set slowmode in this channel')
    .addStringOption(option =>
      option.setName('duration')
        .setDescription('Duration (e.g. 5s, 1m, 0 to disable)')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'moderation')) {
      return interaction.reply({ content: '❌ Moderation module is disabled.', ephemeral: true });
    }

    if (![ChannelType.GuildText, ChannelType.GuildAnnouncement, ChannelType.PublicThread, ChannelType.PrivateThread].includes(interaction.channel.type)) {
      return interaction.reply({ content: '❌ This command only works in text or thread channels.', ephemeral: true });
    }

    const durationInput = interaction.options.getString('duration');
    let seconds;

    if (durationInput === '0') {
      seconds = 0;
    } else {
      const msDuration = ms(durationInput);
      if (!msDuration || msDuration < 0 || msDuration > 21600000) { // max 6h
        return interaction.reply({ content: '❌ Invalid duration (0s–6h, e.g. 30s, 5m).', ephemeral: true });
      }
      seconds = Math.floor(msDuration / 1000);
    }

    try {
      await interaction.channel.setRateLimitPerUser(seconds, `Set by ${interaction.user.tag}`);
      const display = seconds === 0 ? 'disabled' : `${seconds}s`;
      await interaction.reply({ content: `✅ Slowmode ${display} in this channel.` });
    } catch (err) {
      await interaction.reply({ content: `❌ Failed to set slowmode: ${err.message}`, ephemeral: true });
    }
  },
};
