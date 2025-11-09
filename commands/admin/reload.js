const { SlashCommandBuilder } = require('discord.js');
const { ownerId } = require('../../../config/bot.json');
const { readdirSync } = require('fs');
const path = require('path');

module.exports = {
   new SlashCommandBuilder()
    .setName('reload')
    .setDescription('Reload a command (OWNER ONLY)')
    .addStringOption(option =>
      option.setName('command')
        .setDescription('Command to reload')
        .setRequired(true)
        .setAutocomplete(true)),
  async execute(interaction) {
    if (interaction.user.id !== ownerId) {
      return interaction.reply({ content: '❌ Only the bot owner can use this.', ephemeral: true });
    }

    const commandName = interaction.options.getString('command').toLowerCase();
    const command = interaction.client.commands.get(commandName);

    if (!command) {
      return interaction.reply({ content: `❌ Command \`${commandName}\` not found.`, ephemeral: true });
    }

    const commandFolders = readdirSync(path.join(__dirname, '..'));
    let found = false;
    let fullPath = '';

    for (const folder of commandFolders) {
      const folderPath = path.join(__dirname, '..', folder);
      if (!folderPath.includes('.js') && !folder.startsWith('.')) {
        const files = readdirSync(folderPath).filter(f => f.endsWith('.js'));
        if (files.includes(`${commandName}.js`)) {
          fullPath = path.join(folderPath, `${commandName}.js`);
          found = true;
          break;
        }
      }
    }

    if (!found) {
      return interaction.reply({ content: `❌ Command file for \`${commandName}\` not found.`, ephemeral: true });
    }

    delete require.cache[require.resolve(fullPath)];
    const newCommand = require(fullPath);
    interaction.client.commands.set(newCommand.data.name, newCommand);

    await interaction.reply({ content: `✅ Command \`${newCommand.data.name}\` reloaded successfully!`, ephemeral: true });
  },

  async autocomplete(interaction) {
    const focusedValue = interaction.options.getFocused();
    const choices = Array.from(interaction.client.commands.keys());
    const filtered = choices.filter(choice => choice.startsWith(focusedValue));
    await interaction.respond(filtered.map(c => ({ name: c, value: c })).slice(0, 25));
  },
};
