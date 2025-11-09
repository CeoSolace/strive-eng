const { SlashCommandBuilder } = require('discord.js');

module.exports = {
   new SlashCommandBuilder()
    .setName('boost')
    .setDescription('Activate server boost perks'),
  async execute(interaction) {
    const isBoosted = interaction.guild.premiumTier > 0;
    if (!isBoosted) {
      return interaction.reply({ content: '❌ This server must be boosted to use this.', ephemeral: true });
    }
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'premium')) {
      return interaction.reply({ content: '❌ Premium module is disabled.', ephemeral: true });
    }
    await interaction.reply({ content: '💎 Boost perks activated!', ephemeral: true });
  },
};
