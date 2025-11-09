// features/security/NukePrevention.js
const { Collection } = require('discord.js');

class NukePrevention {
  constructor(client) {
    this.client = client;
    this.actionLogs = new Collection(); // guildId -> { userId: [actions] }
    this.threshold = 5;
    this.window = 15000;
  }

  async logAction(guildId, userId, action) {
    if (!this.actionLogs.has(guildId)) this.actionLogs.set(guildId, new Collection());
    const userActions = this.actionLogs.get(guildId);
    if (!userActions.has(userId)) userActions.set(userId, []);
    const actions = userActions.get(userId);
    const now = Date.now();
    actions.push({ action, timestamp: now });
    // Cleanup
    userActions.set(userId, actions.filter(a => now - a.timestamp < this.window));
    // Check for nuke
    if (actions.length >= this.threshold) {
      await this.freezeUser(guildId, userId);
      userActions.delete(userId);
    }
  }

  async freezeUser(guildId, userId) {
    const guild = this.client.guilds.cache.get(guildId);
    if (!guild) return;
    const member = await guild.members.fetch(userId).catch(() => null);
    if (!member) return;
    const jailRole = await this.getOrCreateJailRole(guild);
    if (jailRole) {
      await member.roles.set([jailRole]);
      const logChannelId = (await this.client.db.Guild.findOne({ guildId })).security?.logChannel;
      if (logChannelId) {
        const channel = guild.channels.cache.get(logChannelId);
        if (channel) channel.send(`🔒 **Nuke attempt by ${member.user.tag}** — user jailed.`);
      }
    }
  }

  async getOrCreateJailRole(guild) {
    let role = guild.roles.cache.find(r => r.name === 'Strive-Jailed');
    if (!role) {
      role = await guild.roles.create({
        name: 'Strive-Jailed',
        color: 0x000000,
        reason: 'Nuke prevention jail role'
      });
      for (const channel of guild.channels.cache.values()) {
        await channel.permissionOverwrites.create(role, {
          ViewChannel: false,
          SendMessages: false,
          Connect: false
        });
      }
    }
    return role;
  }
}

module.exports = NukePrevention;
