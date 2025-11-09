// utils/Config.js
require('dotenv').config();
const fs = require('fs');
const path = require('path');

class Config {
  constructor() {
    this.bot = this.loadJSON('config/bot.json');
    this.dashboard = this.loadJSON('config/dashboard.json');
    this.plans = this.loadJSON('config/plans.json');
    this.env = {
      TOKEN: process.env.DISCORD_TOKEN,
      CLIENT_ID: process.env.CLIENT_ID,
      MONGODB_URI: process.env.MONGODB_URI,
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
      OWNER_ID: process.env.OWNER_ID,
      PORT: process.env.PORT || 3000
    };
  }

  loadJSON(filePath) {
    try {
      const fullPath = path.join(__dirname, '..', '..', filePath);
      if (fs.existsSync(fullPath)) {
        return JSON.parse(fs.readFileSync(fullPath, 'utf8'));
      }
    } catch (err) {
      console.warn(`[Config] Failed to load ${filePath}:`, err.message);
    }
    return {};
  }

  get(key, defaultValue = null) {
    return this.env[key] || defaultValue;
  }
}

module.exports = new Config();
