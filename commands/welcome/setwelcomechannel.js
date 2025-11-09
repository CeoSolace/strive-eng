const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
   new SlashCommandBuilder()
    .setName('setwelcomechannel')
    .setDescription('Set the welcome channel')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('Channel for welcome messages')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'welcome')) {
      return interaction.reply({ content: '❌ Welcome module is disabled.', ephemeral: true });
    }

    const channel = interaction.options.getChannel('channel');

    await interaction.client.db.Guild.updateOne(
      { guildId: interaction.guild.id },
      { $set: { 'welcome.channelId': channel.id } },
      { upsert: true }
    );

    await interaction.reply({ content: `✅ Welcome channel set to ${channel}.`, ephemeral: true });
  },
};
