// features/voice/VoiceAnomalyDetector.js

class VoiceAnomalyDetector {
  constructor(client) {
    this.client = client;
    this.joinStamps = new Map(); // guildId -> [timestamps]
  }

  onVoiceStateUpdate(oldState, newState) {
    const guild = newState.guild || oldState.guild;
    if (!guild || !newState.channelId) return;

    const now = Date.now();
    if (!this.joinStamps.has(guild.id)) this.joinStamps.set(guild.id, []);
    const stamps = this.joinStamps.get(guild.id);
    stamps.push(now);
    stamps.splice(0, stamps.length - 20); // keep last 20

    if (stamps.length >= 10 && now - stamps[0] < 10000) {
      this.client.emit('voiceRaid', guild);
    }
  }
}

module.exports = VoiceAnomalyDetector;
