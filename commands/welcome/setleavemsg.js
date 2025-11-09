const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
   new SlashCommandBuilder()
    .setName('setleavemsg')
    .setDescription('Set the leave message')
    .addStringOption(option =>
      option.setName('message')
        .setDescription('Use {user}, {server}')
        .setRequired(true))
    .addBooleanOption(option =>
      option.setName('embed')
        .setDescription('Send as embed')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'welcome')) {
      return interaction.reply({ content: '❌ Welcome module is disabled.', ephemeral: true });
    }

    const msg = interaction.options.getString('message');
    const embed = interaction.options.getBoolean('embed') || false;

    await interaction.client.db.Guild.updateOne(
      { guildId: interaction.guild.id },
      { $set: { 'leave.message': msg, 'leave.embed': embed } },
      { upsert: true }
    );

    await interaction.reply({ content: `✅ Leave message set.`, ephemeral: true });
  },
};
