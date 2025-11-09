// data/schemas/ScheduledMessage.js
const mongoose = require('mongoose');

const ScheduledMessageSchema = new mongoose.Schema({
  guildId: { type: String, required: true, index: true },
  channelId: { type: String, required: true },
  content: { type: String, required: true },
  scheduledFor: { type: Date, required: true },
  sent: { type: Boolean, default: false }
}, { timestamps: true });

ScheduledMessageSchema.index({ scheduledFor: 1 });
module.exports = mongoose.model('ScheduledMessage', ScheduledMessageSchema);
