// data/schemas/Subscription.js
const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  guildId: { type: String, required: true, index: true },
  customerId: { type: String, required: true },
  subscriptionId: { type: String, required: true },
  planId: { type: String, required: true },
  active: { type: Boolean, default: true },
  startsAt: { type: Date, default: Date.now },
  endsAt: { type: Date, required: true }
}, { timestamps: true });

SubscriptionSchema.index({ guildId: 1 });
SubscriptionSchema.index({ customerId: 1 });
module.exports = mongoose.model('Subscription', SubscriptionSchema);
