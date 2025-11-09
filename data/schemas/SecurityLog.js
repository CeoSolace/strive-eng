// data/schemas/SecurityLog.js
const mongoose = require('mongoose');

const SecurityLogSchema = new mongoose.Schema({
  guildId: { type: String, required: true, index: true },
  action: { type: String, required: true },
  details: { type: mongoose.Schema.Types.Mixed, required: true },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

SecurityLogSchema.index({ guildId: 1, action: 1 });
module.exports = mongoose.model('SecurityLog', SecurityLogSchema);
