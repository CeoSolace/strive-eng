// features/music/MusicPlayer.js

class MusicPlayer {
  constructor(client) {
    this.client = client;
    this.queues = new Map(); // guildId -> []
  }

  async play(guild, song) {
    if (!guild.me.voice.channel) return;
    // In real app: use ytdl-core, prism-media, etc.
    console.log(`[MusicPlayer] Playing ${song} in ${guild.name}`);
    this.queues.set(guild.id, [song]);
  }

  skip(guild) {
    this.queues.delete(guild.id);
  }
}

module.exports = MusicPlayer;
