// data/schemas/Giveaway.js
const mongoose = require('mongoose');

const GiveawaySchema = new mongoose.Schema({
  guildId: { type: String, required: true, index: true },
  channelId: { type: String, required: true },
  messageId: { type: String, required: true },
  prize: { type: String, required: true },
  winners: { type: Number, default: 1 },
  endsAt: { type: Date, required: true },
  startedBy: { type: String, required: true },
  ended: { type: Boolean, default: false },
  cancelled: { type: Boolean, default: false }
}, { timestamps: true });

GiveawaySchema.index({ endsAt: 1 });
GiveawaySchema.index({ guildId: 1 });
module.exports = mongoose.model('Giveaway', GiveawaySchema);
