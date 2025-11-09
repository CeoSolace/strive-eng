const { SlashCommandBuilder } = require('discord.js');

module.exports = {
   new SlashCommandBuilder()
    .setName('messages')
    .setDescription('Show message count for a user')
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

    const count = data ? data.messageCount || 0 : 0;
    await interaction.reply({ content: `💬 ${user.tag} has sent **${count.toLocaleString()}** messages.`, ephemeral: true });
  },
};
