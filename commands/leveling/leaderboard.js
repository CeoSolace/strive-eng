const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
   new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('View top 10 users by XP')
    .addIntegerOption(option =>
      option.setName('page')
        .setDescription('Page number (default: 1)')
        .setMinValue(1)
        .setMaxValue(10)),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'leveling')) {
      return interaction.reply({ content: '❌ Leveling module is disabled.', ephemeral: true });
    }

    const page = interaction.options.getInteger('page') || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const totalUsers = await interaction.client.db.User.countDocuments({ guildId: interaction.guild.id, xp: { $gt: 0 } });
    const totalPages = Math.ceil(totalUsers / limit);

    if (page > totalPages && totalPages > 0) {
      return interaction.reply({ content: `❌ Page ${page} does not exist. Max page: ${totalPages}`, ephemeral: true });
    }

    const leaders = await interaction.client.db.User.find({ guildId: interaction.guild.id, xp: { $gt: 0 } })
      .sort({ xp: -1 })
      .skip(skip)
      .limit(limit);

    if (leaders.length === 0) {
      return interaction.reply({ content: '📭 No users with XP found.', ephemeral: true });
    }

    const description = leaders.map((doc, i) => {
      const globalPos = (page - 1) * 10 + i + 1;
      const member = interaction.guild.members.cache.get(doc.userId);
      const username = member ? member.user.username : `Unknown (${doc.userId.slice(0, 5)}...)`;
      const level = Math.floor(0.1 * Math.sqrt(doc.xp || 0));
      return `${globalPos}. **${username}** — Level ${level} (${doc.xp.toLocaleString()} XP)`;
    }).join('\n');

    const embed = new EmbedBuilder()
      .setTitle(`🏆 Leaderboard (Page ${page}/${totalPages || 1})`)
      .setDescription(description)
      .setColor(0x5865F2)
      .setFooter({ text: `Total tracked users: ${totalUsers}` });

    await interaction.reply({ embeds: [embed] });
  },
};
