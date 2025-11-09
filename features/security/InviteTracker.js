// features/security/InviteTracker.js

class InviteTracker {
  constructor(client) {
    this.client = client;
    this.guildInvites = new Map(); // guildId -> Collection<inviteCode, invite>
  }

  async cacheInvites(guild) {
    try {
      const invites = await guild.invites.fetch();
      this.guildInvites.set(guild.id, invites);
    } catch (err) {
      console.warn(`[InviteTracker] Cannot fetch invites for ${guild.name}:`, err.message);
    }
  }

  async getInviteUsed(guild, newUser) {
    if (!this.guildInvites.has(guild.id)) return null;
    const cached = this.guildInvites.get(guild.id);
    const fresh = await guild.invites.fetch();
    for (const invite of fresh.values()) {
      const cachedInvite = cached.get(invite.code);
      if (!cachedInvite || cachedInvite.uses < invite.uses) {
        this.guildInvites.set(guild.id, fresh);
        return invite;
      }
    }
    this.guildInvites.set(guild.id, fresh);
    return null;
  }
}

module.exports = InviteTracker;
