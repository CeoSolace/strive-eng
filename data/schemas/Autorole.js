// data/schemas/Autorole.js
const mongoose = require('mongoose');

const AutoRoleSchema = new mongoose.Schema({
  guildId: { type: String, required: true, index: true },
  primaryRole: { type: String },
  extraRoles: [{ type: String }],
  enabled: { type: Boolean, default: false }
}, { timestamps: true });

AutoRoleSchema.index({ guildId: 1 }, { unique: true });
module.exports = mongoose.model('AutoRole', AutoRoleSchema);
