// data/schemas/Filter.js
const mongoose = require('mongoose');

const FilterSchema = new mongoose.Schema({
  guildId: { type: String, required: true, index: true },
  filters: {
    words: [String],
    extensions: [String]
  },
  actions: {
    link: { type: String, enum: ['delete', 'warn', 'both'], default: 'delete' },
    word: { type: String, enum: ['delete', 'warn', 'both'], default: 'delete' },
    caps: { type: String, enum: ['delete', 'warn', 'both'], default: 'delete' }
  }
}, { timestamps: true });

FilterSchema.index({ guildId: 1 }, { unique: true });
module.exports = mongoose.model('Filter', FilterSchema);
