// data/schemas/ThreadRule.js
const mongoose = require('mongoose');

const ThreadRuleSchema = new mongoose.Schema({
  guildId: { type: String, required: true, index: true },
  channelId: { type: String, required: true },
  autoArchive: { type: Number, default: 1440 },
  rateLimit: { type: Number, default: 0 }
}, { timestamps: true });

ThreadRuleSchema.index({ guildId: 1, channelId: 1 }, { unique: true });
module.exports = mongoose.model('ThreadRule', ThreadRuleSchema);
