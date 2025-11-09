// features/stats/VoiceTracker.js

class VoiceTracker {
  constructor(client) {
    this.client = client;
    this.sessions = new Map(); // userId-guildId -> { joinTimestamp }
  }

  onVoiceStateUpdate(oldState, newState) {
    const guild = newState.guild || oldState.guild;
    if (!guild) return;

    const userId = (newState.member || oldState.member)?.id;
    if (!userId) return;

    const key = `${userId}-${guild.id}`;

    // Left voice
    if (oldState.channelId && !newState.channelId) {
      this.endSession(key);
    }
    // Joined voice
    else if (!oldState.channelId && newState.channelId) {
      this.startSession(key);
    }
    // Switched channels
    else if (oldState.channelId !== newState.channelId) {
      this.endSession(key);
      this.startSession(key);
    }
  }

  startSession(key) {
    this.sessions.set(key, { joinTimestamp: Date.now() });
  }

  endSession(key) {
    const session = this.sessions.get(key);
    if (!session) return;
    const duration = Date.now() - session.joinTimestamp;
    if (duration > 1000) {
      const [userId, guildId] = key.split('-');
      this.client.db.User.updateOne(
        { guildId, userId },
        { $inc: { voiceSeconds: Math.floor(duration / 1000) } },
        { upsert: true }
      ).catch(console.error);
    }
    this.sessions.delete(key);
  }
}

module.exports = VoiceTracker;
