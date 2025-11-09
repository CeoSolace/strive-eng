// data/schemas/VoiceAnomaly.js
const mongoose = require('mongoose');

const VoiceAnomalySchema = new mongoose.Schema({
  guildId: { type: String, required: true, index: true },
  channelId: { type: String, required: true },
  userId: { type: String, required: true },
  joinTimestamp: { type: Date, required: true },
  anomalyType: { type: String, enum: ['raid', 'afk-farm', 'mute-swap'], required: true }
}, { timestamps: true });

VoiceAnomalySchema.index({ guildId: 1, anomalyType: 1 });
module.exports = mongoose.model('VoiceAnomaly', VoiceAnomalySchema);
