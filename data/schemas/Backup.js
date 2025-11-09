// data/schemas/Backup.js
const mongoose = require('mongoose');

const BackupSchema = new mongoose.Schema({
  guildId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  roles: [{ type: mongoose.Schema.Types.Mixed }],
  channels: [{ type: mongoose.Schema.Types.Mixed }],
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

BackupSchema.index({ guildId: 1, createdAt: -1 });
module.exports = mongoose.model('Backup', BackupSchema);
