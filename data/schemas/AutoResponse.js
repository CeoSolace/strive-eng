// data/schemas/AutoResponse.js
const mongoose = require('mongoose');

const AutoResponseSchema = new mongoose.Schema({
  guildId: { type: String, required: true, index: true },
  trigger: { type: String, required: true, lowercase: true },
  response: { type: String, required: true },
  enabled: { type: Boolean, default: true }
}, { timestamps: true });

AutoResponseSchema.index({ guildId: 1, trigger: 1 }, { unique: true });
module.exports = mongoose.model('AutoResponse', AutoResponseSchema);
