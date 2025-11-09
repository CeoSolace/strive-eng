// utils/RateLimiter.js
const { Collection } = require('discord.js');

class RateLimiter {
  constructor(windowMs = 60000, max = 5) {
    this.window = windowMs;
    this.max = max;
    this.limits = new Collection();
  }

  isLimited(userId) {
    const now = Date.now();
    const timestamps = this.limits.get(userId) || [];
    const filtered = timestamps.filter(time => now - time < this.window);
    this.limits.set(userId, filtered);

    if (filtered.length >= this.max) {
      return true;
    }

    this.limits.set(userId, [...filtered, now]);
    return false;
  }

  reset(userId) {
    this.limits.delete(userId);
  }
}

module.exports = RateLimiter;
