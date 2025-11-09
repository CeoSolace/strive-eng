const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const ms = require('ms');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('tempban')
    .setDescription('Temporarily ban a user')
    .addUserOption(option => option.setName('user').setDescription('User to ban').setRequired(true))
    .addStringOption(option => option.setName('duration').setDescription('Duration (e.g. 1h, 30m)').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Reason').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'moderation')) {
      return interaction.reply({ content: '❌ Moderation module is disabled.', ephemeral: true });
    }

    const user = interaction.options.getUser('user');
    const duration = interaction.options.getString('duration');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const msDuration = ms(duration);

    if (!msDuration || msDuration < 60000) {
      return interaction.reply({ content: '❌ Invalid duration (min 1m, e.g. 1h, 30m).', ephemeral: true });
    }

    const unbanAt = Date.now() + msDuration;

    try {
      await interaction.guild.members.ban(user, { reason: `${interaction.user.tag}: ${reason}` });
      await interaction.reply({ content: `✅ Temp-banned ${user.tag} for ${duration} | ${reason}` });

      // Schedule unban via TaskManager would be ideal; here we simulate DB storage
      await interaction.client.db.TempBan.create({
        guildId: interaction.guild.id,
        userId: user.id,
        unbanAt: new Date(unbanAt),
        moderator: interaction.user.id
      });

      await interaction.client.analytics.trackModAction(interaction.guild.id, interaction.user.id, 'tempban', user.id, reason);
    } catch (err) {
      await interaction.reply({ content: `❌ Failed to temp-ban: ${err.message}`, ephemeral: true });
    }
  },
};
