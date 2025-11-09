const { SlashCommandBuilder } = require('discord.js');
const { version } = require('../../../package.json');

module.exports = {
   new SlashCommandBuilder()
    .setName('botinfo')
    .setDescription('Show bot information'),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'utility')) {
      return interaction.reply({ content: '❌ Utility module is disabled.', ephemeral: true });
    }

    const embed = {
      title: '🤖 Strive-Endgame',
      description: 'The final, self-sufficient Discord bot.',
      fields: [
        { name: 'Version', value: version, inline: true },
        { name: 'Guilds', value: interaction.client.guilds.cache.size.toLocaleString(), inline: true },
        { name: 'Users', value: interaction.client.guilds.cache.reduce((acc, g) => acc + g.memberCount, 0).toLocaleString(), inline: true },
        { name: 'Commands', value: interaction.client.commands.size.toString(), inline: true },
        { name: 'Developer', value: '<@YOUR_USER_ID>', inline: true },
      ],
      color: 0x5865F2,
      timestamp: new Date()
    };

    await interaction.reply({ embeds: [embed] });
  },
};
