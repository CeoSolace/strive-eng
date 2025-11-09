// data/schemas/Screening.js
const mongoose = require('mongoose');

const ScreeningSchema = new mongoose.Schema({
  guildId: { type: String, required: true, index: true },
  enabled: { type: Boolean, default: false },
  questions: [{ type: String }],
  verifiedRole: { type: String }
}, { timestamps: true });

ScreeningSchema.index({ guildId: 1 }, { unique: true });
module.exports = mongoose.model('Screening', ScreeningSchema);
