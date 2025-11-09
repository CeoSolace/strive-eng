const { SlashCommandBuilder } = require('discord.js');
const { ownerId } = require('../../../config/bot.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('shutdown')
    .setDescription('Gracefully shut down the bot (OWNER ONLY)'),
  async execute(interaction) {
    if (interaction.user.id !== ownerId) {
      return interaction.reply({ content: '❌ Only the bot owner can use this.', ephemeral: true });
    }

    await interaction.reply({ content: '🔌 Shutting down Strive-Endgame...', ephemeral: true });
    console.log(`[SHUTDOWN] Initiated by ${interaction.user.tag}`);
    process.exit(0);
  },
};
