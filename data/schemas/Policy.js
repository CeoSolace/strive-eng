// data/schemas/Policy.js
const mongoose = require('mongoose');

const PolicySchema = new mongoose.Schema({
  guildId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  rules: [{ type: mongoose.Schema.Types.Mixed }]
}, { timestamps: true });

PolicySchema.index({ guildId: 1, name: 1 }, { unique: true });
module.exports = mongoose.model('Policy', PolicySchema);
