// features/security/AuditLogger.js

class AuditLogger {
  constructor(client) {
    this.client = client;
  }

  async log(guildId, action, details) {
    await this.client.db.SecurityLog.create({
      guildId,
      action,
      details,
      timestamp: new Date()
    });

    const guildData = await this.client.db.Guild.findOne({ guildId });
    const logChannelId = guildData?.security?.logChannel;
    if (logChannelId) {
      const guild = this.client.guilds.cache.get(guildId);
      if (guild) {
        const channel = guild.channels.cache.get(logChannelId);
        if (channel) {
          channel.send(`🛡️ **${action}**\n\`\`\`json\n${JSON.stringify(details, null, 2)}\n\`\`\``);
        }
      }
    }
  }
}

module.exports = AuditLogger;
