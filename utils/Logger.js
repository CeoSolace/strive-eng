// utils/Logger.js
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

class Logger {
  constructor() {
    this.logDir = path.join(__dirname, '..', '..', 'logs');
    if (!fs.existsSync(this.logDir)) fs.mkdirSync(this.logDir, { recursive: true });
    this.logFile = path.join(this.logDir, 'combined.log');
  }

  format(level, message) {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
  }

  write(level, message) {
    const line = this.format(level, message);
    console.log(this.colorize(level, line));
    fs.appendFileSync(this.logFile, line + '\n');
  }

  colorize(level, text) {
    switch (level) {
      case 'error': return chalk.red(text);
      case 'warn': return chalk.yellow(text);
      case 'success': return chalk.green(text);
      case 'debug': return chalk.cyan(text);
      default: return text;
    }
  }

  info(message) { this.write('info', message); }
  error(message) { this.write('error', message); }
  warn(message) { this.write('warn', message); }
  success(message) { this.write('success', message); }
  debug(message) { this.write('debug', message); }
}

module.exports = new Logger();
