const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('softban')
    .setDescription('Ban and immediately unban a user (to clear messages)')
    .addUserOption(option => option.setName('user').setDescription('User to soft-ban').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Reason').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'moderation')) {
      return interaction.reply({ content: '❌ Moderation module is disabled.', ephemeral: true });
    }

    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    try {
      await interaction.guild.members.ban(user, { deleteMessageSeconds: 604800, reason: `${interaction.user.tag}: ${reason}` });
      await interaction.guild.members.unban(user, `Softban by ${interaction.user.tag}`);
      await interaction.reply({ content: `✅ Soft-banned ${user.tag} | ${reason}` });
      await interaction.client.analytics.trackModAction(interaction.guild.id, interaction.user.id, 'softban', user.id, reason);
    } catch (err) {
      await interaction.reply({ content: `❌ Failed to soft-ban: ${err.message}`, ephemeral: true });
    }
  },
};
