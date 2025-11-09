const { SlashCommandBuilder } = require('discord.js');
const { ownerId } = require('../../../config/bot.json');
const fs = require('fs');
const path = require('path');

module.exports = {
   new SlashCommandBuilder()
    .setName('logs')
    .setDescription('Retrieve the latest bot logs (OWNER ONLY)')
    .addIntegerOption(option =>
      option.setName('lines')
        .setDescription('Number of lines to fetch (default: 50)')
        .setMinValue(1)
        .setMaxValue(200)),
  async execute(interaction) {
    if (interaction.user.id !== ownerId) {
      return interaction.reply({ content: '❌ Only the bot owner can use this.', ephemeral: true });
    }

    const lines = interaction.options.getInteger('lines') || 50;
    const logPath = path.join(__dirname, '..', '..', '..', 'logs', 'combined.log');

    if (!fs.existsSync(logPath)) {
      return interaction.reply({ content: '❌ Log file not found.', ephemeral: true });
    }

    try {
      const logData = fs.readFileSync(logPath, 'utf8');
      const logLines = logData.split('\n').filter(Boolean).slice(-lines);
      let logText = logLines.join('\n');

      if (logText.length > 1900) {
        logText = logText.slice(-1900);
        logText = '... (truncated)\n' + logText;
      }

      await interaction.reply({ content: `\`\`\`ansi\n${logText}\n\`\`\``, ephemeral: true });
    } catch (err) {
      await interaction.reply({ content: `❌ Failed to read logs: ${err.message}`, ephemeral: true });
    }
  },
};
