// features/leveling/RewardHandler.js

class RewardHandler {
  constructor(client) {
    this.client = client;
  }

  async checkRewards(member, level) {
    const guildData = await this.client.db.Guild.findOne({ guildId: member.guild.id });
    const rewards = guildData?.leveling?.rewards || {};
    const roleId = rewards[level];
    if (!roleId) return;

    const role = member.guild.roles.cache.get(roleId);
    if (!role || !role.editable || member.roles.cache.has(role)) return;

    try {
      await member.roles.add(role, `Level ${level} reward`);
    } catch (err) {
      console.error(`[RewardHandler] Failed to award level ${level} role:`, err.message);
    }
  }
}

module.exports = RewardHandler;
