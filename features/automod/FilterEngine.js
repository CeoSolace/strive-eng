// features/automod/FilterEngine.js
const { Collection } = require('discord.js');

class FilterEngine {
  constructor(client) {
    this.client = client;
    this.mentionSpam = new Collection(); // userId-guildId -> count
  }

  async processMessage(message) {
    if (message.author.bot || !message.guild) return;

    const guildData = await this.client.db.Guild.findOne({ guildId: message.guild.id });
    if (!guildData?.automod?.enabled) return;

    const filters = guildData.automod;

    // Invite filter
    if (filters.invitefilter?.enabled && this.containsInvite(message.content)) {
      return this.handleViolation(message, 'invitefilter', filters.invitefilter.action);
    }

    // Link filter
    if (filters.linkfilter?.enabled && /https?:\/\//.test(message.content)) {
      return this.handleViolation(message, 'linkfilter', filters.linkfilter.action);
    }

    // Word filter
    if (filters.wordfilter?.enabled && filters.wordfilter.words) {
      const lower = message.content.toLowerCase();
      if (filters.wordfilter.words.some(w => lower.includes(w))) {
        return this.handleViolation(message, 'wordfilter', filters.wordfilter.action);
      }
    }

    // Caps filter
    if (filters.capsfilter?.enabled) {
      const caps = (message.content.match(/[A-Z]/g) || []).length;
      const total = (message.content.match(/[A-Za-z]/g) || []).length;
      if (total > 5 && caps / total > (filters.capsfilter.threshold || 75) / 100) {
        return this.handleViolation(message, 'capsfilter', filters.capsfilter.action);
      }
    }

    // Emoji filter
    if (filters.emojiFilter?.enabled) {
      const emojiCount = (message.content.match(/<a?:\w+:\d+>|[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu) || []).length;
      if (emojiCount > (filters.emojiFilter.max || 10)) {
        return this.handleViolation(message, 'emojiFilter', filters.emojiFilter.action);
      }
    }

    // Mention spam
    if (filters.mentionfilter?.enabled) {
      const mentions = message.mentions.users.size + message.mentions.roles.size + (message.mentions.everyone ? 1 : 0);
      if (mentions > (filters.mentionfilter.max || 5)) {
        return this.handleViolation(message, 'mentionfilter', filters.mentionfilter.action);
      }
    }
  }

  containsInvite(content) {
    return /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/[a-zA-Z0-9]+/gi.test(content);
  }

  async handleViolation(message, filter, action) {
    if (action === 'delete' || action === 'both') {
      await message.delete().catch(() => {});
    }
    if (action === 'warn' || action === 'both') {
      await this.client.db.Warning.create({
        guildId: message.guild.id,
        userId: message.author.id,
        moderator: this.client.user.id,
        reason: `AutoMod: ${filter}`,
        timestamp: new Date()
      });
    }

    const logChannelId = (await this.client.db.Guild.findOne({ guildId: message.guild.id }))?.automod?.logChannel;
    if (logChannelId) {
      const channel = message.guild.channels.cache.get(logChannelId);
      if (channel) {
        channel.send(`🛡️ **AutoMod** — ${filter} triggered by ${message.author.tag} in ${message.channel}`);
      }
    }
  }
}

module.exports = FilterEngine;
