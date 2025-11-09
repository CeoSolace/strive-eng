// features/security/RoleScrubber.js

class RoleScrubber {
  constructor(client) {
    this.client = client;
  }

  async restoreRoles(guild, snapshot) {
    for (const roleId of snapshot.rolesToDelete || []) {
      if (guild.roles.cache.has(roleId)) continue; // already restored
      const roleData = snapshot.roleData[roleId];
      if (!roleData) continue;
      try {
        await guild.roles.create({
          name: roleData.name,
          color: roleData.color,
          hoist: roleData.hoist,
          position: roleData.position,
          permissions: roleData.permissions,
          mentionable: roleData.mentionable,
          reason: 'Strive-Endgame Recovery'
        });
      } catch (err) {
        console.error(`[RoleScrubber] Failed to restore role ${roleId}:`, err.message);
      }
    }
  }

  async takeSnapshot(guild) {
    const roles = {};
    for (const [id, role] of guild.roles.cache) {
      if (id === guild.id) continue; // @everyone
      roles[id] = {
        name: role.name,
        color: role.color,
        hoist: role.hoist,
        position: role.position,
        permissions: role.permissions.bitfield,
        mentionable: role.mentionable
      };
    }
    return {
      timestamp: Date.now(),
      rolesToDelete: Object.keys(roles),
      roleData: roles
    };
  }
}

module.exports = RoleScrubber;
