// data/schemas/AuditTrail.js
const mongoose = require('mongoose');

const AuditTrailSchema = new mongoose.Schema({
  guildId: { type: String, required: true, index: true },
  userId: { type: String, required: true },
  action: { type: String, required: true },
  targetId: { type: String },
  reason: { type: String },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

AuditTrailSchema.index({ guildId: 1, userId: 1 });
module.exports = mongoose.model('AuditTrail', AuditTrailSchema);
