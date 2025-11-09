const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('logs')
    .setDescription('Set moderation log channel')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('Log channel')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');
    await interaction.client.db.Guild.updateOne(
      { guildId: interaction.guild.id },
      { $set: { 'config.logChannel': channel.id } },
      { upsert: true }
    );
    await interaction.reply({ content: `✅ Log channel set to ${channel}.`, ephemeral: true });
  },
};
