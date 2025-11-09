const { SlashCommandBuilder } = require('discord.js');
const { createWriteStream } = require('fs');
const { pipeline } = require('stream');
const { promisify } = require('util');
const { Transform } = require('stream');
const { ObjectId } = require('mongoose').Types;

module.exports = {
   new SlashCommandBuilder()
    .setName('export')
    .setDescription('Export server stats as CSV (OWNER ONLY)'),
  async execute(interaction) {
    const { ownerId } = require('../../../config/bot.json');
    if (interaction.user.id !== ownerId) {
      return interaction.reply({ content: '❌ Only the bot owner can use this.', ephemeral: true });
    }

    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'stats')) {
      return interaction.reply({ content: '❌ Stats module is disabled.', ephemeral: true });
    }

    await interaction.deferReply({ ephemeral: true });

    try {
      const users = await interaction.client.db.User.find({ guildId: interaction.guild.id });
      const csv = [
        'User ID,Username,Messages,Voice Seconds,XP,Last Active'
      ];

      for (const u of users) {
        const member = interaction.guild.members.cache.get(u.userId);
        const name = member ? member.user.username.replace(/,/g, '') : 'Unknown';
        csv.push(`${u.userId},${name},${u.messageCount || 0},${u.voiceSeconds || 0},${u.xp || 0},${u.lastActive || ''}`);
      }

      const buffer = Buffer.from(csv.join('\n'));
      await interaction.editReply({ 
        content: '📤 Export complete.', 
        files: [{ attachment: buffer, name: `stats-${interaction.guild.id}.csv` }] 
      });
    } catch (err) {
      await interaction.editReply({ content: `❌ Export failed: ${err.message}` });
    }
  },
};
