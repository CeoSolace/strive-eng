// features/slowmode/DynamicSlowmode.js

class DynamicSlowmode {
  constructor(client) {
    this.client = client;
    this.messageCounts = new Map(); // channelId-userId -> count
  }

  async handleMessage(message) {
    if (message.author.bot || !message.guild) return;

    const key = `${message.channel.id}-${message.author.id}`;
    const now = Date.now();
    if (!this.messageCounts.has(key)) this.messageCounts.set(key, []);
    const stamps = this.messageCounts.get(key);
    stamps.push(now);
    stamps.splice(0, Math.max(0, stamps.length - 5)); // last 5 messages

    if (stamps.length >= 5 && now - stamps[0] < 10000) {
      const current = message.channel.rateLimitPerUser || 0;
      if (current < 30) {
        await message.channel.setRateLimitPerUser(30, 'Dynamic slowmode: spam detected');
      }
    }
  }
}

module.exports = DynamicSlowmode;
