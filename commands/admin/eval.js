const { SlashCommandBuilder } = require('discord.js');
const { ownerId } = require('../../../config/bot.json');

module.exports = {
   new SlashCommandBuilder()
    .setName('eval')
    .setDescription('Execute arbitrary JavaScript code (OWNER ONLY)')
    .addStringOption(option =>
      option.setName('code')
        .setDescription('Code to evaluate')
        .setRequired(true))
    .addBooleanOption(option =>
      option.setName('silent')
        .setDescription('Hide output')
        .setRequired(false)),
  async execute(interaction) {
    if (interaction.user.id !== ownerId) {
      return interaction.reply({ content: '❌ Only the bot owner can use this.', ephemeral: true });
    }

    const code = interaction.options.getString('code');
    const silent = interaction.options.getBoolean('silent') || false;

    try {
      let evaled = eval(code);
      if (typeof evaled !== 'string') evaled = require('util').inspect(evaled, { depth: 0 });

      if (silent) {
        await interaction.reply({ content: '✅ Code executed silently.', ephemeral: true });
        console.log(`[EVAL] ${interaction.user.tag} ran: ${code}`);
      } else {
        if (evaled.length > 1900) evaled = evaled.substring(0, 1900) + '...';
        await interaction.reply({ content: `\`\`\`js\n${evaled}\n\`\`\``, ephemeral: true });
      }
    } catch (err) {
      await interaction.reply({ content: `\`\`\`xl\n${err}\n\`\`\``, ephemeral: true });
    }
  },
};
