// data/schemas/Guild.js
const mongoose = require('mongoose');

const GuildSchema = new mongoose.Schema({
  guildId: { type: String, required: true, unique: true, index: true },
  
  // Modules
  modules: {
    welcome: { type: Boolean, default: true },
    autorole: { type: Boolean, default: true },
    leveling: { type: Boolean, default: true },
    automod: { type: Boolean, default: true },
    security: { type: Boolean, default: true },
    tickets: { type: Boolean, default: true },
    reactionroles: { type: Boolean, default: true },
    giveaways: { type: Boolean, default: true },
    stats: { type: Boolean, default: true },
    music: { type: Boolean, default: false },
    fun: { type: Boolean, default: true },
    premium: { type: Boolean, default: true }
  },

  // Welcome
  welcome: {
    enabled: { type: Boolean, default: false },
    channelId: { type: String },
    message: { type: String, default: 'Welcome {user} to {server}!' },
    embed: { type: Boolean, default: true },
    dmEnabled: { type: Boolean, default: false }
  },

  // Leave
  leave: {
    enabled: { type: Boolean, default: false },
    channelId: { type: String },
    message: { type: String, default: '{user} left {server}.' },
    embed: { type: Boolean, default: true }
  },

  // Autorole
  autorole: {
    enabled: { type: Boolean, default: false },
    roleId: { type: String },
    extraRoles: [{ type: String }]
  },

  // Leveling
  leveling: {
    enabled: { type: Boolean, default: true },
    cooldown: { type: Number, default: 30 },
    rewards: { type: mongoose.Schema.Types.Mixed, default: {} }
  },

  // AutoMod
  automod: {
    enabled: { type: Boolean, default: false },
    linkfilter: { enabled: Boolean, action: { type: String, enum: ['delete', 'warn', 'both'], default: 'delete' } },
    wordfilter: { enabled: Boolean, action: { type: String, enum: ['delete', 'warn', 'both'], default: 'delete' }, words: [String] },
    capsfilter: { enabled: Boolean, action: { type: String, enum: ['delete', 'warn', 'both'], default: 'delete' }, threshold: { type: Number, default: 75 } },
    emojiFilter: { enabled: Boolean, action: { type: String, enum: ['delete', 'warn', 'both'], default: 'delete' }, max: { type: Number, default: 10 } },
    invitefilter: { enabled: Boolean, action: { type: String, enum: ['delete', 'warn', 'both'], default: 'delete' }, allowPartner: Boolean },
    mentionfilter: { enabled: Boolean, action: { type: String, enum: ['delete', 'warn', 'both'], default: 'delete' }, max: { type: Number, default: 5 } },
    filefilter: { enabled: Boolean, action: { type: String, enum: ['delete', 'warn', 'both'], default: 'delete' }, extensions: [String] },
    ghostping: { enabled: Boolean, logChannel: String }
  },

  // Security
  security: {
    antiraid: { type: Boolean, default: false },
    antinuke: { type: Boolean, default: false },
    verifiedOwner: { type: String },
    protectedRoles: [String],
    protectedChannels: [String],
    logChannel: { type: String }
  },

  // Giveaways
  giveaways: {
    requirements: {
      role: String,
      boostersOnly: { type: Boolean, default: false },
      minAge: { type: Number, default: 0 }
    }
  },

  // Config
  config: {
    logChannel: { type: String },
    prefix: { type: String, default: '!' }
  },

  // Premium
  premium: {
    active: { type: Boolean, default: false },
    planId: { type: String },
    expiresAt: { type: Date }
  }
}, { timestamps: true });

GuildSchema.index({ guildId: 1 });
module.exports = mongoose.model('Guild', GuildSchema);
