const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rename')
    .setDescription('Rename a ticket')
    .addStringOption(option => option.setName('name').setDescription('New name').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'tickets')) {
      return interaction.reply({ content: '❌ Tickets module is disabled.', ephemeral: true });
    }
    const name = interaction.options.getString('name');
    await interaction.channel.setName(`ticket-${name}`);
    await interaction.reply({ content: `✅ Ticket renamed to ${name}.`, ephemeral: true });
  },
};
