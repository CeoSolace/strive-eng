// features/security/ChannelLock.js

class ChannelLock {
  constructor(client) {
    this.client = client;
  }

  async lockAllChannels(guild) {
    const textChannels = guild.channels.cache.filter(c => [0, 5].includes(c.type));
    for (const channel of textChannels.values()) {
      try {
        await channel.permissionOverwrites.edit(guild.roles.everyone, {
          SendMessages: false
        }, { reason: 'Strive-Endgame Emergency Lock' });
      } catch (err) {
        console.warn(`[ChannelLock] Failed to lock ${channel.name}:`, err.message);
      }
    }
  }

  async unlockAllChannels(guild) {
    const textChannels = guild.channels.cache.filter(c => [0, 5].includes(c.type));
    for (const channel of textChannels.values()) {
      try {
        await channel.permissionOverwrites.edit(guild.roles.everyone, {
          SendMessages: null
        }, { reason: 'Strive-Endgame Lock Released' });
      } catch (err) {
        console.warn(`[ChannelLock] Failed to unlock ${channel.name}:`, err.message);
      }
    }
  }
}

module.exports = ChannelLock;
