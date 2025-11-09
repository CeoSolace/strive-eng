const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Delete up to 100 messages')
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('Number of messages (1–100)')
        .setMinValue(1)
        .setMaxValue(100)
        .setRequired(true))
    .addUserOption(option => option.setName('user').setDescription('Only delete messages from this user'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'moderation')) {
      return interaction.reply({ content: '❌ Moderation module is disabled.', ephemeral: true });
    }

    const amount = interaction.options.getInteger('amount');
    const user = interaction.options.getUser('user');
    const channel = interaction.channel;

    await interaction.deferReply({ ephemeral: true });

    try {
      let deleted;
      if (user) {
        const fetched = await channel.messages.fetch({ limit: 100 });
        const messages = fetched.filter(m => m.author.id === user.id).first(amount);
        deleted = await channel.bulkDelete(messages, true);
      } else {
        deleted = await channel.bulkDelete(amount, true);
      }

      await interaction.editReply({ content: `✅ Deleted ${deleted.size} messages.` });
    } catch (err) {
      await interaction.editReply({ content: `❌ Failed to purge: ${err.message}` });
    }
  },
};
