const { SlashCommandBuilder } = require('discord.js');

module.exports = {
   new SlashCommandBuilder()
    .setName('streaks')
    .setDescription('Show current message streak'),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'stats')) {
      return interaction.reply({ content: '❌ Stats module is disabled.', ephemeral: true });
    }

    const data = await interaction.client.db.User.findOne({ guildId: interaction.guild.id, userId: interaction.user.id });
    const streak = data ? data.currentStreak || 0 : 0;
    const max = data ? data.longestStreak || 0 : 0;

    await interaction.reply({ content: `🔥 Your current streak: **${streak} days** (max: ${max})`, ephemeral: true });
  },
};
