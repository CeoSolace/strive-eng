// features/premium/EntitlementChecker.js

class EntitlementChecker {
  constructor(client) {
    this.client = client;
  }

  async isPremium(guildId) {
    const sub = await this.client.db.Subscription.findOne({ guildId, active: true });
    return !!sub;
  }

  async getPlan(guildId) {
    const sub = await this.client.db.Subscription.findOne({ guildId, active: true });
    return sub ? sub.planId : null;
  }
}

module.exports = EntitlementChecker;
