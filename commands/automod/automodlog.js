const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('automodlog')
    .setDescription('Set AutoMod log channel')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('Log channel')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'automod')) {
      return interaction.reply({ content: '❌ AutoMod module is disabled.', ephemeral: true });
    }

    const channel = interaction.options.getChannel('channel');
    await interaction.client.db.Guild.updateOne(
      { guildId: interaction.guild.id },
      { $set: { 'automod.logChannel': channel.id } },
      { upsert: true }
    );
    await interaction.reply({ content: `✅ AutoMod logs will be sent to ${channel}.`, ephemeral: true });
  },
};
