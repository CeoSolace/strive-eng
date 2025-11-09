// features/forums/ForumModerator.js

class ForumModerator {
  constructor(client) {
    this.client = client;
  }

  async autoPin(thread) {
    if (!thread.pinned) {
      await thread.setPinned(true);
    }
  }
}

module.exports = ForumModerator;
