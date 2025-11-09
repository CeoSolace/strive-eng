const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
   new SlashCommandBuilder()
    .setName('giveaway')
    .setDescription('Manage giveaways (alias for /start)')
    .addSubcommand(sub => sub.setName('start').setDescription('Start a giveaway'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'giveaways')) {
      return interaction.reply({ content: '❌ Giveaways module is disabled.', ephemeral: true });
    }
    await interaction.reply({ content: '✅ Use `/start` to create a giveaway.', ephemeral: true });
  },
};
