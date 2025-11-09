const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const ms = require('ms');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('tempmute')
    .setDescription('Temporarily mute a user')
    .addUserOption(option => option.setName('user').setDescription('User to mute').setRequired(true))
    .addStringOption(option => option.setName('duration').setDescription('Duration (e.g. 1h)').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Reason').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'moderation')) {
      return interaction.reply({ content: '❌ Moderation module is disabled.', ephemeral: true });
    }

    const user = interaction.options.getUser('user');
    const duration = interaction.options.getString('duration');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const msDuration = ms(duration);

    if (!msDuration || msDuration > 28 * 24 * 60 * 60 * 1000 || msDuration < 60000) {
      return interaction.reply({ content: '❌ Duration must be 1m–28d.', ephemeral: true });
    }

    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    if (!member) return interaction.reply({ content: '❌ User not in server.', ephemeral: true });

    try {
      await member.timeout(msDuration, `${interaction.user.tag}: ${reason}`);
      await interaction.reply({ content: `✅ Muted ${user.tag} for ${duration} | ${reason}` });
      await interaction.client.analytics.trackModAction(interaction.guild.id, interaction.user.id, 'tempmute', user.id, reason);
    } catch (err) {
      await interaction.reply({ content: `❌ Failed to mute: ${err.message}`, ephemeral: true });
    }
  },
};
