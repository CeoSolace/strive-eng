// features/threads/ThreadModerator.js

class ThreadModerator {
  constructor(client) {
    this.client = client;
  }

  async autoArchive(thread) {
    if (thread.autoArchiveDuration !== 1440) {
      await thread.setAutoArchiveDuration(1440); // 24h
    }
  }
}

module.exports = ThreadModerator;
