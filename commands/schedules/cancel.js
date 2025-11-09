const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('cancel')
    .setDescription('Cancel a scheduled message')
    .addStringOption(option => option.setName('job_id').setDescription('Job ID').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'schedules')) {
      return interaction.reply({ content: '❌ Schedules module is disabled.', ephemeral: true });
    }
    await interaction.reply({ content: '✅ Scheduled message cancelled.', ephemeral: true });
  },
};
