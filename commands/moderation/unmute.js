const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('Unmute a user')
    .addUserOption(option => option.setName('user').setDescription('User to unmute').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Reason').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'moderation')) {
      return interaction.reply({ content: '❌ Moderation module is disabled.', ephemeral: true });
    }

    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);

    if (!member) return interaction.reply({ content: '❌ User not in server.', ephemeral: true });
    if (!member.isCommunicationDisabled()) {
      return interaction.reply({ content: '❌ User is not muted.', ephemeral: true });
    }

    try {
      await member.timeout(null, `${interaction.user.tag}: ${reason}`);
      await interaction.reply({ content: `✅ Unmuted ${user.tag} | ${reason}` });
    } catch (err) {
      await interaction.reply({ content: `❌ Failed to unmute: ${err.message}`, ephemeral: true });
    }
  },
};
