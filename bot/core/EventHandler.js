const { readdirSync } = require('fs');
const path = require('path');

class EventHandler {
  constructor(client) {
    this.client = client;
  }

  async load() {
    const eventFolders = readdirSync(path.join(__dirname, '..', '..', 'events'));
    for (const folder of eventFolders) {
      const eventFiles = readdirSync(path.join(__dirname, '..', '..', 'events', folder)).filter(file => file.endsWith('.js'));
      for (const file of eventFiles) {
        const event = require(path.join(__dirname, '..', '..', 'events', folder, file));
        if (event.once) {
          this.client.once(event.name, (...args) => event.execute(...args, this.client));
        } else {
          this.client.on(event.name, (...args) => event.execute(...args, this.client));
        }
        this.client.events.set(event.name, event);
      }
    }
  }
}

module.exports = EventHandler;
