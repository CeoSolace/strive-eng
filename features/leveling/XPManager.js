// features/leveling/XPManager.js

class XPManager {
  constructor(client) {
    this.client = client;
    this.cooldowns = new Map(); // userId-guildId -> timestamp
  }

  async addXP(message) {
    if (message.author.bot) return;
    if (!message.guild) return;

    const guildId = message.guild.id;
    const userId = message.author.id;
    const key = `${userId}-${guildId}`;

    const guildData = await this.client.db.Guild.findOne({ guildId });
    if (!guildData?.leveling?.enabled) return;

    const cooldown = guildData.leveling.cooldown || 30;
    const now = Date.now();
    if (this.cooldowns.has(key) && now - this.cooldowns.get(key) < cooldown * 1000) return;
    this.cooldowns.set(key, now);

    const xp = Math.floor(Math.random() * 15) + 10; // 10-25 XP
    await this.client.db.User.updateOne(
      { guildId, userId },
      { 
        $inc: { xp },
        $set: { lastActive: new Date() },
        $setOnInsert: { joinDate: new Date() }
      },
      { upsert: true }
    );

    const userData = await this.client.db.User.findOne({ guildId, userId });
    const oldLevel = Math.floor(0.1 * Math.sqrt(userData.xp - xp));
    const newLevel = Math.floor(0.1 * Math.sqrt(userData.xp));

    if (newLevel > oldLevel) {
      this.client.emit('levelUp', message.member, newLevel);
    }
  }
}

module.exports = XPManager;
