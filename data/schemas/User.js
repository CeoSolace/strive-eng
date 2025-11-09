// data/schemas/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  guildId: { type: String, required: true, index: true },
  userId: { type: String, required: true, index: true },
  xp: { type: Number, default: 0 },
  messageCount: { type: Number, default: 0 },
  voiceSeconds: { type: Number, default: 0 },
  lastActive: { type: Date },
  joinDate: { type: Date },
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 }
}, { timestamps: true });

UserSchema.index({ guildId: 1, userId: 1 }, { unique: true });
UserSchema.index({ guildId: 1, xp: -1 });
module.exports = mongoose.model('User', UserSchema);
