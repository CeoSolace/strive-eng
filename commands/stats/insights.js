const { SlashCommandBuilder } = require('discord.js');

module.exports = {
   new SlashCommandBuilder()
    .setName('insights')
    .setDescription('Show server engagement insights'),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'stats')) {
      return interaction.reply({ content: '❌ Stats module is disabled.', ephemeral: true });
    }

    const totalUsers = await interaction.client.db.User.countDocuments({ guildId: interaction.guild.id });
    const activeThisWeek = await interaction.client.db.User.countDocuments({
      guildId: interaction.guild.id,
      lastActive: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });

    const topMsg = await interaction.client.db.User.findOne({ guildId: interaction.guild.id }).sort({ messageCount: -1 });
    const topVoice = await interaction.client.db.User.findOne({ guildId: interaction.guild.id }).sort({ voiceSeconds: -1 });

    const embed = {
      title: '🔍 Server Insights',
      fields: [
        { name: 'Tracked Users', value: totalUsers.toLocaleString(), inline: true },
        { name: 'Active (7d)', value: activeThisWeek.toLocaleString(), inline: true },
        { name: 'Top Chatter', value: topMsg ? `<@${topMsg.userId}>` : 'None', inline: true },
        { name: 'Top Voice', value: topVoice ? `<@${topVoice.userId}>` : 'None', inline: true },
      ],
      color: 0x5865F2
    };

    await interaction.reply({ embeds: [embed] });
  },
};
