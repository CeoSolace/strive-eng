const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
   new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a user from the server')
    .addUserOption(option => option.setName('user').setDescription('User to kick').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Reason').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'moderation')) {
      return interaction.reply({ content: '❌ Moderation module is disabled.', ephemeral: true });
    }

    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);

    if (member && !member.kickable) {
      return interaction.reply({ content: '❌ I cannot kick this user.', ephemeral: true });
    }

    try {
      await interaction.guild.members.kick(user, `${interaction.user.tag}: ${reason}`);
      await interaction.reply({ content: `✅ Kicked ${user.tag} | ${reason}` });
      await interaction.client.analytics.trackModAction(interaction.guild.id, interaction.user.id, 'kick', user.id, reason);
    } catch (err) {
      await interaction.reply({ content: `❌ Failed to kick: ${err.message}`, ephemeral: true });
    }
  },
};
