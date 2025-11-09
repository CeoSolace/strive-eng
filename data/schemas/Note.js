// data/schemas/Note.js
const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  guildId: { type: String, required: true, index: true },
  userId: { type: String, required: true, index: true },
  moderator: { type: String, required: true },
  note: { type: String, required: true },
  editedAt: { type: Date }
}, { timestamps: true });

NoteSchema.index({ guildId: 1, userId: 1 });
module.exports = mongoose.model('Note', NoteSchema);
