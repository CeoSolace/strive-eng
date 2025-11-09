// features/schedules/Scheduler.js

class Scheduler {
  constructor(client) {
    this.client = client;
  }

  async start() {
    setInterval(async () => {
      const now = new Date();
      const broadcasts = await this.client.db.ScheduledMessage.find({
        scheduledFor: { $lte: now },
        sent: false
      });

      for (const broadcast of broadcasts) {
        const guild = this.client.guilds.cache.get(broadcast.guildId);
        if (!guild) continue;
        const channel = guild.channels.cache.get(broadcast.channelId);
        if (channel) {
          channel.send(broadcast.content);
          await this.client.db.ScheduledMessage.updateOne(
            { _id: broadcast._id },
            { sent: true }
          );
        }
      }
    }, 60000);
  }
}

module.exports = Scheduler;
