const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a user from the server')
    .addUserOption(option => option.setName('user').setDescription('User to ban').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Reason for ban').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'moderation')) {
      return interaction.reply({ content: '❌ Moderation module is disabled.', ephemeral: true });
    }

    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);

    if (member && !member.bannable) {
      return interaction.reply({ content: '❌ I cannot ban this user (role hierarchy or permissions).', ephemeral: true });
    }

    try {
      await interaction.guild.members.ban(user, { reason: `${interaction.user.tag}: ${reason}` });
      await interaction.reply({ content: `✅ Banned ${user.tag} | ${reason}` });
      await interaction.client.analytics.trackModAction(interaction.guild.id, interaction.user.id, 'ban', user.id, reason);
    } catch (err) {
      await interaction.reply({ content: `❌ Failed to ban: ${err.message}`, ephemeral: true });
    }
  },
};
