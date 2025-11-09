// features/welcome/WelcomeHandler.js
const { EmbedBuilder } = require('discord.js');
const EmbedBuilderModule = require('./EmbedBuilder');

class WelcomeHandler {
  constructor(client) {
    this.client = client;
    this.embedBuilder = new EmbedBuilderModule(client);
  }

  async handleWelcome(member) {
    const guildId = member.guild.id;
    const guildData = await this.client.db.Guild.findOne({ guildId });
    if (!guildData?.welcome?.enabled) return;

    const message = (guildData.welcome.message || 'Welcome {user} to {server}!')
      .replace(/{user}/g, member.user.toString())
      .replace(/{server}/g, member.guild.name)
      .replace(/{member_count}/g, member.guild.memberCount.toLocaleString());

    const channel = member.guild.channels.cache.get(guildData.welcome.channelId);
    if (!channel || !channel.isTextBased()) return;

    try {
      if (guildData.welcome.embed) {
        const embed = this.embedBuilder.buildWelcomeEmbed(member, message);
        await channel.send({ embeds: [embed] });
      } else {
        await channel.send(message);
      }
    } catch (err) {
      console.error(`[WelcomeHandler] Failed to send welcome in ${guildId}:`, err.message);
    }

    // Handle DM welcome
    if (guildData.welcome.dmEnabled) {
      try {
        const dmMessage = message.replace(/<#[0-9]+>/g, '#general');
        if (guildData.welcome.embed) {
          const dmEmbed = this.embedBuilder.buildWelcomeEmbed(member, dmMessage);
          await member.send({ embeds: [dmEmbed] });
        } else {
          await member.send(dmMessage);
        }
      } catch (err) {
        // User may have DMs disabled — safe to ignore
      }
    }

    // Handle autorole
    if (guildData.autorole?.enabled) {
      await this.applyAutorole(member, guildData);
    }
  }

  async applyAutorole(member, guildData) {
    const roles = [];
    if (guildData.autorole.roleId) roles.push(guildData.autorole.roleId);
    if (guildData.autorole.extraRoles) roles.push(...guildData.autorole.extraRoles);

    const validRoles = roles
      .map(id => member.guild.roles.cache.get(id))
      .filter(role => role && role.editable && !role.managed);

    if (validRoles.length > 0) {
      try {
        await member.roles.add(validRoles, 'Strive-Endgame Autorole');
      } catch (err) {
        console.error(`[WelcomeHandler] Failed to assign autorole in ${member.guild.id}:`, err.message);
      }
    }
  }
}

module.exports = WelcomeHandler;
