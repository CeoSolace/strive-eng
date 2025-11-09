const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
   new SlashCommandBuilder()
    .setName('testwelcome')
    .setDescription('Preview the welcome message')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'welcome')) {
      return interaction.reply({ content: '❌ Welcome module is disabled.', ephemeral: true });
    }

    const guildData = await interaction.client.db.Guild.findOne({ guildId: interaction.guild.id });
    const welcome = guildData?.welcome || {};

    if (!welcome.enabled) {
      return interaction.reply({ content: '⚠️ Welcome messages are disabled.', ephemeral: true });
    }

    const channel = interaction.guild.channels.cache.get(welcome.channelId) || interaction.channel;
    const msg = (welcome.message || 'Welcome {user} to {server}!')
      .replace(/{user}/g, interaction.user.toString())
      .replace(/{server}/g, interaction.guild.name)
      .replace(/{member_count}/g, interaction.guild.memberCount.toLocaleString());

    try {
      if (welcome.embed) {
        const embed = new EmbedBuilder()
          .setDescription(msg)
          .setColor(0x5865F2)
          .setTimestamp();
        await channel.send({ embeds: [embed] });
      } else {
        await channel.send(msg);
      }
      await interaction.reply({ content: `✅ Test welcome sent to ${channel}.`, ephemeral: true });
    } catch (err) {
      await interaction.reply({ content: `❌ Failed to send test: ${err.message}`, ephemeral: true });
    }
  },
};
