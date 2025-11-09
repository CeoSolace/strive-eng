const { readdirSync } = require('fs');
const path = require('path');
const { REST, Routes } = require('discord.js');
require('dotenv').config();

class CommandLoader {
  constructor(client) {
    this.client = client;
  }

  async load() {
    const commands = [];
    const commandFolders = readdirSync(path.join(__dirname, '..', '..', 'commands'));
    for (const folder of commandFolders) {
      const commandFiles = readdirSync(path.join(__dirname, '..', '..', 'commands', folder)).filter(file => file.endsWith('.js'));
      for (const file of commandFiles) {
        const command = require(path.join(__dirname, '..', '..', 'commands', folder, file));
        if ('data' in command && 'execute' in command) {
          this.client.commands.set(command.data.name, command);
          commands.push(command.data.toJSON());
        } else {
          console.warn(`[WARNING] The command at ${file} is missing "data" or "execute" property.`);
        }
      }
    }

    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
    try {
      console.log('🔁 Refreshing application (/) commands globally...');
      await rest.put(
        Routes.applicationCommands(process.env.CLIENT_ID),
        { body: commands }
      );
      console.log('✅ Successfully reloaded application (/) commands.');
    } catch (error) {
      console.error('❌ Failed to reload application (/) commands:', error);
    }
  }
}

module.exports = CommandLoader;
