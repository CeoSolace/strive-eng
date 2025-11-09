// utils/i18n.js
const fs = require('fs');
const path = require('path');

class I18n {
  constructor() {
    this.locales = new Map();
    this.loadLocales();
  }

  loadLocales() {
    const localesPath = path.join(__dirname, '..', 'config', 'i18n');
    if (!fs.existsSync(localesPath)) return;

    const files = fs.readdirSync(localesPath).filter(f => f.endsWith('.json'));
    for (const file of files) {
      const lang = file.replace('.json', '');
      const data = JSON.parse(fs.readFileSync(path.join(localesPath, file), 'utf8'));
      this.locales.set(lang, data);
    }
  }

  translate(key, lang = 'en', replacements = {}) {
    const dict = this.locales.get(lang) || this.locales.get('en') || {};
    let str = this.getNested(dict, key) || key;

    for (const [k, v] of Object.entries(replacements)) {
      str = str.replace(new RegExp(`{${k}}`, 'g'), v);
    }

    return str;
  }

  getNested(obj, path) {
    return path.split('.').reduce((cur, prop) => cur?.[prop], obj);
  }
}

module.exports = new I18n();
