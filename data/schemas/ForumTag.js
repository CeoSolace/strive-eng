// data/schemas/ForumTag.js
const mongoose = require('mongoose');

const ForumTagSchema = new mongoose.Schema({
  guildId: { type: String, required: true, index: true },
  forumId: { type: String, required: true },
  tagName: { type: String, required: true },
  autoPin: { type: Boolean, default: false }
}, { timestamps: true });

ForumTagSchema.index({ guildId: 1, forumId: 1, tagName: 1 }, { unique: true });
module.exports = mongoose.model('ForumTag', ForumTagSchema);
