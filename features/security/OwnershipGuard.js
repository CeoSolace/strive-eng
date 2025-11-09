// features/security/OwnershipGuard.js

class OwnershipGuard {
  constructor(client) {
    this.client = client;
  }

  async isOwnerProtected(guild, userId) {
    const guildData = await this.client.db.Guild.findOne({ guildId: guild.id });
    return guildData?.security?.verifiedOwner === userId;
  }

  async transferOwnership(guild, newOwnerId) {
    await this.client.db.Guild.updateOne(
      { guildId: guild.id },
      { $set: { 'security.verifiedOwner': newOwnerId } },
      { upsert: true }
    );
  }
}

module.exports = OwnershipGuard;
