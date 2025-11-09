// utils/Helpers.js
const { parse } = require('node:path');

class Helpers {
  static formatDate(date) {
    return new Date(date).toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  static truncate(str, length = 100) {
    return str.length > length ? str.substring(0, length - 3) + '...' : str;
  }

  static isValidSnowflake(id) {
    return /^\d{17,20}$/.test(id);
  }

  static msToHuman(ms) {
    if (ms < 60000) return `${Math.ceil(ms / 1000)}s`;
    if (ms < 3600000) return `${Math.ceil(ms / 60000)}m`;
    return `${Math.ceil(ms / 3600000)}h`;
  }

  static cleanCodeBlock(text) {
    return text.replace(/```[\s\S]*?```/g, '[code]');
  }
}

module.exports = Helpers;
