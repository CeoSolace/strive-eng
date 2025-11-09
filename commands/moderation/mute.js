const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Mute a user (timeout)')
    .addUserOption(option => option.setName('user').setDescription('User to mute').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Reason').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'moderation')) {
      return interaction.reply({ content: '❌ Moderation module is disabled.', ephemeral: true });
    }

    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);

    if (!member) {
      return interaction.reply({ content: '❌ User not in server.', ephemeral: true });
    }

    try {
      await member.timeout(28 * 24 * 60 * 60 * 1000, `${interaction.user.tag}: ${reason}`); // Max 28 days
      await interaction.reply({ content: `✅ Muted ${user.tag} (max duration) | ${reason}` });
      await interaction.client.analytics.trackModAction(interaction.guild.id, interaction.user.id, 'mute', user.id, reason);
    } catch (err) {
      await interaction.reply({ content: `❌ Failed to mute: ${err.message}`, ephemeral: true });
    }
  },
};
