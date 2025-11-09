// utils/Embeds.js
const { EmbedBuilder } = require('discord.js');

class Embeds {
  static success(title, description, fields = []) {
    return new EmbedBuilder()
      .setColor(0x00FF00)
      .setTitle(title)
      .setDescription(description)
      .addFields(fields)
      .setTimestamp();
  }

  static error(title, description) {
    return new EmbedBuilder()
      .setColor(0xFF0000)
      .setTitle(title)
      .setDescription(description)
      .setTimestamp();
  }

  static warning(title, description) {
    return new EmbedBuilder()
      .setColor(0xFFFF00)
      .setTitle(title)
      .setDescription(description)
      .setTimestamp();
  }

  static info(title, description, color = 0x5865F2) {
    return new EmbedBuilder()
      .setColor(color)
      .setTitle(title)
      .setDescription(description)
      .setTimestamp();
  }
}

module.exports = Embeds;
