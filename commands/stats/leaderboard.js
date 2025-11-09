const { SlashCommandBuilder } = require('discord.js');

module.exports = {
   new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Show top users by XP')
    .addIntegerOption(option =>
      option.setName('page')
        .setDescription('Page number')
        .setMinValue(1)
        .setMaxValue(10)
        .setRequired(false)),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'stats')) {
      return interaction.reply({ content: '❌ Stats module is disabled.', ephemeral: true });
    }

    const page = interaction.options.getInteger('page') || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const leaders = await interaction.client.db.User.find(
      { guildId: interaction.guild.id },
      null,
      { sort: { xp: -1 }, limit, skip }
    );

    if (leaders.length === 0) {
      return interaction.reply({ content: '📊 No data yet.', ephemeral: true });
    }

    const description = leaders.map((u, i) => {
      const user = interaction.guild.members.cache.get(u.userId)?.user;
      return `${(skip + i + 1)}. ${user ? user.tag : 'Unknown'} — ${u.xp} XP`;
    }).join('\n');

    const embed = {
      title: `🏆 Leaderboard (Page ${page})`,
      description,
      color: 0x5865F2,
      footer: { text: 'XP earned from chatting & voice activity' }
    };

    await interaction.reply({ embeds: [embed] });
  },
};
