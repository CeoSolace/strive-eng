const { SlashCommandBuilder } = require('discord.js');
const { ownerId } = require('../../../config/bot.json');
const os = require('os');

module.exports = {
   new SlashCommandBuilder()
    .setName('debug')
    .setDescription('Show system and bot debug info (OWNER ONLY)'),
  async execute(interaction) {
    if (interaction.user.id !== ownerId) {
      return interaction.reply({ content: '❌ Only the bot owner can use this.', ephemeral: true });
    }

    const memory = process.memoryUsage();
    const uptime = process.uptime();
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const mins = Math.floor((uptime % 3600) / 60);

    const embed = {
      title: '🔍 Debug Info',
      fields: [
        { name: 'OS', value: `${os.platform()} ${os.arch()}`, inline: true },
        { name: 'Node.js', value: process.version, inline: true },
        { name: 'Memory', value: `${(memory.heapUsed / 1024 / 1024).toFixed(2)} MB`, inline: true },
        { name: 'Uptime', value: `${days}d ${hours}h ${mins}m`, inline: true },
        { name: 'Guilds', value: interaction.client.guilds.cache.size.toString(), inline: true },
        { name: 'Users', value: interaction.client.guilds.cache.reduce((acc, g) => acc + g.memberCount, 0).toLocaleString(), inline: true },
        { name: 'WebSocket Ping', value: `${interaction.client.ws.ping}ms`, inline: true },
      ],
      timestamp: new Date(),
    };

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
