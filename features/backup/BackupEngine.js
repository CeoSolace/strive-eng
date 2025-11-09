// features/backup/BackupEngine.js

class BackupEngine {
  constructor(client) {
    this.client = client;
  }

  async createBackup(guild) {
    const backup = {
      guildId: guild.id,
      name: guild.name,
      roles: Array.from(guild.roles.cache.values()).map(r => ({
        id: r.id,
        name: r.name,
        color: r.color,
        position: r.position,
        permissions: r.permissions.bitfield
      })),
      createdAt: new Date()
    };

    await this.client.db.Backup.create(backup);
    return backup;
  }
}

module.exports = BackupEngine;
