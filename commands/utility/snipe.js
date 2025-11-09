const { SlashCommandBuilder } = require('discord.js');

module.exports = {
   new SlashCommandBuilder()
    .setName('snipe')
    .setDescription('Show last deleted message in this channel'),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'utility')) {
      return interaction.reply({ content: '❌ Utility module is disabled.', ephemeral: true });
    }

    const sniped = interaction.client.snipes?.get(interaction.channel.id);
    if (!sniped) {
      return interaction.reply({ content: '📭 Nothing to snipe.', ephemeral: true });
    }

    await interaction.reply({
      content: `🗑️ **${sniped.author}** deleted:`,
      embeds: sniped.content ? [{ description: sniped.content }] : [],
      ephemeral: true
    });
  },
};
