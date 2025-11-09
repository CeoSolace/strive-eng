const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
   new SlashCommandBuilder()
    .setName('cleanmod')
    .setDescription('Purge bot and webhook messages in this channel')
    .addIntegerOption(option =>
      option.setName('limit')
        .setDescription('Max messages to scan (default: 100)')
        .setMinValue(1)
        .setMaxValue(1000)
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'moderation')) {
      return interaction.reply({ content: '❌ Moderation module is disabled.', ephemeral: true });
    }

    const limit = interaction.options.getInteger('limit') || 100;
    await interaction.deferReply({ ephemeral: true });

    try {
      const messages = await interaction.channel.messages.fetch({ limit });
      const toDelete = messages.filter(m => m.author.bot || m.webhookId);
      if (toDelete.size === 0) {
        return interaction.editReply({ content: '✅ No bot/webhook messages found.' });
      }

      await interaction.channel.bulkDelete(toDelete, true);
      await interaction.editReply({ content: `✅ Deleted ${toDelete.size} bot/webhook messages.` });
    } catch (err) {
      await interaction.editReply({ content: `❌ Failed to clean: ${err.message}` });
    }
  },
};
