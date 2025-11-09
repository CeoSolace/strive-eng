// data/schemas/Warning.js
const mongoose = require('mongoose');

const WarningSchema = new mongoose.Schema({
  guildId: { type: String, required: true, index: true },
  userId: { type: String, required: true, index: true },
  moderator: { type: String, required: true },
  reason: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

WarningSchema.index({ guildId: 1, userId: 1 });
module.exports = mongoose.model('Warning', WarningSchema);
