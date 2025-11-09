const { SlashCommandBuilder } = require('discord.js');

module.exports = {
   new SlashCommandBuilder()
    .setName('weather')
    .setDescription('Weather a user')
    .addUserOption(option => option.setName('user').setDescription('Target user').setRequired(true)),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'fun')) {
      return interaction.reply({ content: '❌ Fun module is disabled.', ephemeral: true });
    }
    const user = interaction.options.getUser('user');
    await interaction.reply({ content: '✅ Action performed!', ephemeral: true });
  },
};
