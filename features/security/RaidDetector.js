// features/security/RaidDetector.js
const { Collection } = require('discord.js');

class RaidDetector {
  constructor(client) {
    this.client = client;
    this.joinLogs = new Collection(); // guildId -> { userId: timestamp }
    this.threshold = 10; // joins in 10s
    this.window = 10000;
  }

  async handleGuildMemberAdd(member) {
    const guildId = member.guild.id;
    if (!this.joinLogs.has(guildId)) this.joinLogs.set(guildId, new Collection());
    const log = this.joinLogs.get(guildId);
    const now = Date.now();
    log.set(member.user.id, now);
    // Cleanup old entries
    for (const [id, time] of log) {
      if (now - time > this.window) log.delete(id);
    }
    // Check for raid
    if (log.size >= this.threshold) {
      await this.triggerRaidLock(member.guild);
      log.clear();
    }
  }

  async triggerRaidLock(guild) {
    await guild.setVerificationLevel(3); // High
    const logChannelId = (await this.client.db.Guild.findOne({ guildId: guild.id }))?.security?.logChannel;
    if (logChannelId) {
      const channel = guild.channels.cache.get(logChannelId);
      if (channel) channel.send('🚨 **Raid detected!** Verification level raised.');
    }
    this.client.emit('securityRaid', guild);
  }
}

module.exports = RaidDetector;
