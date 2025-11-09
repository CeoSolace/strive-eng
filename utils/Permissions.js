// utils/Permissions.js
const { PermissionFlagsBits } = require('discord.js');

class Permissions {
  static MODERATOR_PERMS = [
    PermissionFlagsBits.KickMembers,
    PermissionFlagsBits.BanMembers,
    PermissionFlagsBits.ModerateMembers,
    PermissionFlagsBits.ManageMessages
  ];

  static ADMIN_PERMS = [
    PermissionFlagsBits.Administrator,
    PermissionFlagsBits.ManageGuild,
    PermissionFlagsBits.ManageRoles,
    PermissionFlagsBits.ManageChannels
  ];

  static hasModerator(member) {
    return this.hasAnyPermission(member, this.MODERATOR_PERMS);
  }

  static hasAdmin(member) {
    return this.hasAnyPermission(member, this.ADMIN_PERMS);
  }

  static hasAnyPermission(member, permissions) {
    if (!member || !member.permissions) return false;
    return permissions.some(perm => member.permissions.has(perm));
  }

  static hasRole(member, roleId) {
    return member && member.roles.cache.has(roleId);
  }
}

module.exports = Permissions;
