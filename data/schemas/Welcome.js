// data/schemas/Welcome.js
const mongoose = require('mongoose');

const WelcomeSchema = new mongoose.Schema({
  guildId: { type: String, required: true, index: true },
  channelId: { type: String },
  message: { type: String, default: 'Welcome {user}!' },
  embed: { type: Boolean, default: true },
  dmEnabled: { type: Boolean, default: false },
  enabled: { type: Boolean, default: false }
}, { timestamps: true });

WelcomeSchema.index({ guildId: 1 }, { unique: true });
module.exports = mongoose.model('Welcome', WelcomeSchema);
