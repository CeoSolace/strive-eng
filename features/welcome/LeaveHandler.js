// features/welcome/LeaveHandler.js
const { EmbedBuilder } = require('discord.js');
const EmbedBuilderModule = require('./EmbedBuilder');

class LeaveHandler {
  constructor(client) {
    this.client = client;
    this.embedBuilder = new EmbedBuilderModule(client);
  }

  async handleLeave(member) {
    const guildId = member.guild.id;
    const guildData = await this.client.db.Guild.findOne({ guildId });
    if (!guildData?.leave?.enabled) return;

    const message = (guildData.leave.message || '{user} left {server}.')
      .replace(/{user}/g, member.user.tag)
      .replace(/{server}/g, member.guild.name);

    const channel = member.guild.channels.cache.get(guildData.leave.channelId);
    if (!channel || !channel.isTextBased()) return;

    try {
      if (guildData.leave.embed) {
        const embed = this.embedBuilder.buildLeaveEmbed(member, message);
        await channel.send({ embeds: [embed] });
      } else {
        await channel.send(message);
      }
    } catch (err) {
      console.error(`[LeaveHandler] Failed to send leave message in ${guildId}:`, err.message);
    }
  }
}

module.exports = LeaveHandler;
