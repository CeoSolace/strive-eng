// features/reaction-roles/ReactionRoleManager.js

class ReactionRoleManager {
  constructor(client) {
    this.client = client;
  }

  async handleReaction(message, emoji, user, added) {
    if (user.bot) return;
    const guild = message.guild;
    const member = guild.members.cache.get(user.id);
    if (!member) return;

    const config = await this.client.db.ReactionRole.findOne({
      guildId: guild.id,
      messageId: message.id,
      emoji: emoji.toString()
    });

    if (!config) return;

    const role = guild.roles.cache.get(config.roleId);
    if (!role || !role.editable) return;

    try {
      if (added) {
        await member.roles.add(role);
      } else {
        await member.roles.remove(role);
      }
    } catch (err) {
      console.error(`[ReactionRole] Failed to toggle role:`, err.message);
    }
  }
}

module.exports = ReactionRoleManager;
