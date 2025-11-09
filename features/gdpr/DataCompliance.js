// features/gdpr/DataCompliance.js

class DataCompliance {
  constructor(client) {
    this.client = client;
  }

  async exportUserData(userId) {
    const data = await this.client.db.User.find({ userId });
    return JSON.stringify(data, null, 2);
  }

  async deleteUserData(userId) {
    await this.client.db.User.deleteMany({ userId });
    await this.client.db.Warning.deleteMany({ userId });
    // ... other collections
  }
}

module.exports = DataCompliance;
