const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
   new SlashCommandBuilder()
    .setName('cancel')
    .setDescription('Cancel an active giveaway')
    .addStringOption(option =>
      option.setName('message_id')
        .setDescription('Giveaway message ID')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'giveaways')) {
      return interaction.reply({ content: '❌ Giveaways module is disabled.', ephemeral: true });
    }

    const messageId = interaction.options.getString('message_id');
    const giveaway = await interaction.client.db.Giveaway.findOne({
      guildId: interaction.guild.id,
      messageId: messageId,
      ended: false
    });

    if (!giveaway) {
      return interaction.reply({ content: '❌ Active giveaway not found.', ephemeral: true });
    }

    await interaction.client.db.Giveaway.updateOne(
      { _id: giveaway._id },
      { $set: { ended: true, cancelled: true } }
    );

    await interaction.reply({ content: '✅ Giveaway cancelled.', ephemeral: true });
  },
};
