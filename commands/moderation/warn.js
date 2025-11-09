const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warn a user')
    .addUserOption(option => option.setName('user').setDescription('User to warn').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Reason').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'moderation')) {
      return interaction.reply({ content: '❌ Moderation module is disabled.', ephemeral: true });
    }

    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason');
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);

    if (!member) return interaction.reply({ content: '❌ User not in server.', ephemeral: true });

    try {
      await interaction.client.db.Warning.create({
        guildId: interaction.guild.id,
        userId: user.id,
        moderator: interaction.user.id,
        reason,
        timestamp: new Date()
      });

      await interaction.reply({ content: `✅ Warned ${user.tag} | ${reason}` });
      await interaction.client.analytics.trackModAction(interaction.guild.id, interaction.user.id, 'warn', user.id, reason);
    } catch (err) {
      await interaction.reply({ content: `❌ Failed to warn: ${err.message}`, ephemeral: true });
    }
  },
};
