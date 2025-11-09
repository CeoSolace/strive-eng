// features/stats/MessageTracker.js

class MessageTracker {
  constructor(client) {
    this.client = client;
  }

  async track(message) {
    if (message.author.bot || !message.guild) return;
    await this.client.db.User.updateOne(
      { guildId: message.guild.id, userId: message.author.id },
      { 
        $inc: { messageCount: 1 },
        $set: { lastActive: new Date() }
      },
      { upsert: true }
    );
  }
}

module.exports = MessageTracker;
