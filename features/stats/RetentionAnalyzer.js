// features/stats/RetentionAnalyzer.js

class RetentionAnalyzer {
  constructor(client) {
    this.client = client;
  }

  async getWeeklyRetention(guildId) {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

    const activeLastWeek = await this.client.db.User.countDocuments({
      guildId,
      lastActive: { $gte: twoWeeksAgo, $lt: weekAgo }
    });

    const stillActive = await this.client.db.User.countDocuments({
      guildId,
      lastActive: { $gte: weekAgo }
    });

    return activeLastWeek ? Math.round((stillActive / activeLastWeek) * 100) : 0;
  }
}

module.exports = RetentionAnalyzer;
