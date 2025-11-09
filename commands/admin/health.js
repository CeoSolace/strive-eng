const { SlashCommandBuilder } = require('discord.js');
const { ownerId } = require('../../../config/bot.json');
const mongoose = require('mongoose');

module.exports = {
   new SlashCommandBuilder()
    .setName('health')
    .setDescription('Check bot health status (OWNER ONLY)'),
  async execute(interaction) {
    if (interaction.user.id !== ownerId) {
      return interaction.reply({ content: '❌ Only the bot owner can use this.', ephemeral: true });
    }

    const dbStatus = mongoose.connection.readyState === 1 ? '✅ Connected' : '❌ Disconnected';
    const wsStatus = interaction.client.ws.status === 0 ? '✅ Online' : '⚠️ Reconnecting';
    const ping = interaction.client.ws.ping;

    const embed = {
      title: '🩺 Health Check',
      fields: [
        { name: 'Database', value: dbStatus, inline: true },
        { name: 'WebSocket', value: wsStatus, inline: true },
        { name: 'Ping', value: `${ping}ms`, inline: true },
        { name: 'Commands Loaded', value: interaction.client.commands.size.toString(), inline: true },
        { name: 'Uptime', value: `<t:${Math.floor(Date.now() / 1000 - process.uptime())}:R>`, inline: true },
      ],
      color: 0x00ff00,
      timestamp: new Date(),
    };

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
