const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
   new SlashCommandBuilder()
    .setName('features')
    .setDescription('List available premium features'),
  async execute(interaction) {
    const isPremium = await interaction.client.premium.isPremium(interaction.guild.id);
    const embed = new EmbedBuilder()
      .setTitle('💎 Premium Features')
      .setDescription(isPremium ? 'All features unlocked!' : 'Upgrade for full access.')
      .addFields(
        { name: 'Security', value: 'Wick-mode, anti-nuke, auto-heal', inline: true },
        { name: 'Stats', value: 'Export, trends, retention', inline: true },
        { name: 'Automation', value: 'Auto-response, schedules, backups', inline: true }
      )
      .setColor(isPremium ? 0x00ff00 : 0xffaa00);
    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
