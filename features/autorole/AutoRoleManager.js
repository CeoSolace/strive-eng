// features/autorole/AutoRoleManager.js

class AutoRoleManager {
  constructor(client) {
    this.client = client;
  }

  /**
   * Assign configured autoroles to a member on join
   * @param {import('discord.js').GuildMember} member
   */
  async assignRoles(member) {
    // Skip bots unless explicitly allowed (not typical for autorole)
    if (member.user.bot) return;

    const guildId = member.guild.id;
    const guildData = await this.client.db.Guild.findOne({ guildId });

    // Check if autorole is enabled
    if (!guildData?.autorole?.enabled) return;

    const rolesToAssign = [];

    // Add primary role
    if (guildData.autorole.roleId) {
      const role = member.guild.roles.cache.get(guildData.autorole.roleId);
      if (role && this.isAssignable(role, member.guild)) {
        rolesToAssign.push(role);
      }
    }

    // Add extra roles
    if (Array.isArray(guildData.autorole.extraRoles)) {
      for (const roleId of guildData.autorole.extraRoles) {
        const role = member.guild.roles.cache.get(roleId);
        if (role && this.isAssignable(role, member.guild)) {
          rolesToAssign.push(role);
        }
      }
    }

    if (rolesToAssign.length === 0) return;

    try {
      await member.roles.add(rolesToAssign, 'Strive-Endgame Autorole');
    } catch (error) {
      console.error(`[AutoRoleManager] Failed to assign roles in guild ${guildId}:`, error.message);
      // Optionally log to mod log channel
      const logChannelId = guildData?.config?.logChannel;
      if (logChannelId) {
        const logChannel = member.guild.channels.cache.get(logChannelId);
        if (logChannel && logChannel.isTextBased()) {
          logChannel.send(
            `⚠️ **AutoRole Warning**: Failed to assign roles to ${member.user.tag} (${member.id}).\n` +
            `Reason: \`${error.message}\``
          ).catch(() => {});
        }
      }
    }
  }

  /**
   * Check if a role can be safely assigned by the bot
   * @param {import('discord.js').Role} role
   * @param {import('discord.js').Guild} guild
   * @returns {boolean}
   */
  isAssignable(role, guild) {
    const botMember = guild.members.me;
    if (!botMember) return false;
    return (
      !role.managed &&               // Not a bot-integrated role
      role.editable &&               // Bot has permission to manage this role
      role.position < botMember.roles.highest.position // Not higher than bot's top role
    );
  }

  /**
   * Re-evaluate and apply autoroles for all members (e.g., after config change)
   * @param {import('discord.js').Guild} guild
   */
  async refreshAllRoles(guild) {
    const guildData = await this.client.db.Guild.findOne({ guildId: guild.id });
    if (!guildData?.autorole?.enabled) return;

    const members = await guild.members.fetch();
    for (const member of members.values()) {
      if (member.user.bot) continue;
      await this.assignRoles(member);
      // Avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
}

module.exports = AutoRoleManager;
