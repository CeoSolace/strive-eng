const { SlashCommandBuilder } = require('discord.js');

module.exports = {
   new SlashCommandBuilder()
    .setName('retention')
    .setDescription('Show member retention rate'),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'stats')) {
      return interaction.reply({ content: '❌ Stats module is disabled.', ephemeral: true });
    }

    const now = new Date();
    const oneWeekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now - 14 * 24 * 60 * 60 * 1000);

    const activeLastWeek = await interaction.client.db.User.countDocuments({
      guildId: interaction.guild.id,
      lastActive: { $gte: twoWeeksAgo, $lt: oneWeekAgo }
    });

    const stillActive = await interaction.client.db.User.countDocuments({
      guildId: interaction.guild.id,
      lastActive: { $gte: oneWeekAgo }
    });

    const retention = activeLastWeek ? Math.round((stillActive / activeLastWeek) * 100) : 0;

    const embed = {
      title: '🔁 Retention Rate',
      description: `Of users active 2 weeks ago, **${retention}%** were active this week.`,
      color: retention > 70 ? 0x00ff00 : retention > 40 ? 0xffaa00 : 0xff0000
    };

    await interaction.reply({ embeds: [embed] });
  },
};
