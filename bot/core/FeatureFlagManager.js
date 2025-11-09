class FeatureFlagManager {
  constructor(client) {
    this.client = client;
    this.flags = new Map();
  }

  initialize() {
    // Load from env or DB
    this.flags.set('dynamic_slowmode', true);
    this.flags.set('ai_responses', false);
    console.log('🚩 Feature flags loaded.');
  }

  isEnabled(flag) {
    return this.flags.get(flag) === true;
  }
}

module.exports = FeatureFlagManager;
