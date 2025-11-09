class ModuleManager {
  constructor(client) {
    this.client = client;
    this.modules = new Set([
      'welcome', 'autorole', 'leveling', 'automod', 'security',
      'tickets', 'reactionroles', 'giveaways', 'stats', 'music'
    ]);
  }

  async initialize() {
    console.log('🧩 Initializing ModuleManager...');
  }

  isEnabled(guildId, module) {
    if (!this.modules.has(module)) return false;
    // In real app: check DB Guild.config.modules[module]
    return true;
  }
}

module.exports = ModuleManager;
