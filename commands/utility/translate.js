const { SlashCommandBuilder } = require('discord.js');

module.exports = {
   new SlashCommandBuilder()
    .setName('translate')
    .setDescription('Translate text (mock implementation)')
    .addStringOption(option =>
      option.setName('text')
        .setDescription('Text to translate')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('to')
        .setDescription('Target language (e.g. es, fr)')
        .setRequired(true)),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'utility')) {
      return interaction.reply({ content: '❌ Utility module is disabled.', ephemeral: true });
    }

    const text = interaction.options.getString('text');
    const to = interaction.options.getString('to');

    // In real app: use Google Translate API or LibreTranslate
    await interaction.reply({ content: `🔤 Translated to ${to}: "${text}" (mock)`, ephemeral: true });
  },
};
