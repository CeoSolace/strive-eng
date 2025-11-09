// data/schemas/Level.js
const mongoose = require('mongoose');

const LevelSchema = new mongoose.Schema({
  guildId: { type: String, required: true, index: true },
  userId: { type: String, required: true, index: true },
  level: { type: Number, default: 0 },
  xp: { type: Number, default: 0 }
}, { timestamps: true });

LevelSchema.index({ guildId: 1, userId: 1 }, { unique: true });
module.exports = mongoose.model('Level', LevelSchema);
