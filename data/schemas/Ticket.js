// data/schemas/Ticket.js
const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
  guildId: { type: String, required: true, index: true },
  channelId: { type: String, required: true },
  userId: { type: String, required: true },
  topic: { type: String, default: 'Support' },
  createdAt: { type: Date, default: Date.now },
  closedAt: { type: Date }
}, { timestamps: true });

TicketSchema.index({ guildId: 1, userId: 1 });
TicketSchema.index({ channelId: 1 });
module.exports = mongoose.model('Ticket', TicketSchema);
