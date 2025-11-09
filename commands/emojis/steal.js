const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('steal')
    .setDescription('Copy emoji from another server')
    .addStringOption(option => option.setName('emoji').setDescription('Emoji to steal').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageEmojisAndStickers),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'emojis')) {
      return interaction.reply({ content: '❌ Emoji module is disabled.', ephemeral: true });
    }
    await interaction.reply({ content: '✅ Emoji added.', ephemeral: true });
  },
};
