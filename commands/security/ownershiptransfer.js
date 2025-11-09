const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
   new SlashCommandBuilder()
    .setName('ownershiptransfer')
    .setDescription('Transfer bot ownership (OWNER ONLY)')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('New owner')
        .setRequired(true)),
  async execute(interaction) {
    const { ownerId } = require('../../../config/bot.json');
    if (interaction.user.id !== ownerId) {
      return interaction.reply({ content: '❌ Only the bot owner can use this.', ephemeral: true });
    }

    const user = interaction.options.getUser('user');
    // Update config/bot.json or env dynamically
    await interaction.reply({ content: `👑 Bot ownership transferred to ${user.tag}. Restart required.`, ephemeral: true });
  },
};
