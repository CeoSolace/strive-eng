const { SlashCommandBuilder } = require('discord.js');

module.exports = {
   new SlashCommandBuilder()
    .setName('voice')
    .setDescription('Show voice time for a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to inspect')
        .setRequired(false)),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'stats')) {
      return interaction.reply({ content: '❌ Stats module is disabled.', ephemeral: true });
    }

    const user = interaction.options.getUser('user') || interaction.user;
    const data = await interaction.client.db.User.findOne({ guildId: interaction.guild.id, userId: user.id });

    const seconds = data ? data.voiceSeconds || 0 : 0;
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    await interaction.reply({ content: `🎤 ${user.tag} has spent **${hours}h ${minutes}m** in voice channels.`, ephemeral: true });
  },
};
