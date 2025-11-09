const { SlashCommandBuilder } = require('discord.js');

module.exports = {
   new SlashCommandBuilder()
    .setName('growth')
    .setDescription('Show server growth over time'),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'stats')) {
      return interaction.reply({ content: '❌ Stats module is disabled.', ephemeral: true });
    }

    // Mock — real version would use join logs or daily snapshots
    const embed = {
      title: '📈 Growth (Last 30 Days)',
      description: '```📅 +120 members\n💬 +45,000 messages\n🎤 +1,200 voice hours```',
      color: 0x5865F2
    };

    await interaction.reply({ embeds: [embed] });
  },
};
