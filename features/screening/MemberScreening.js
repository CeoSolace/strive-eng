// features/screening/MemberScreening.js

class MemberScreening {
  constructor(client) {
    this.client = client;
  }

  async verifyMember(member) {
    const guildData = await this.client.db.Guild.findOne({ guildId: member.guild.id });
    if (!guildData?.screening?.enabled) return;

    // In real app: DM user, collect responses, validate
    await member.setCommunicationDisabled(300000, 'Verification pending');
  }
}

module.exports = MemberScreening;
