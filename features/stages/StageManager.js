// features/stages/StageManager.js

class StageManager {
  constructor(client) {
    this.client = client;
  }

  async autoApprove(stageInstance, member) {
    await stageInstance.channel.permissionOverwrites.create(member, { Speak: true });
  }
}

module.exports = StageManager;
