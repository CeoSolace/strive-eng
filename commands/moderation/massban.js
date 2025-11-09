const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
   new SlashCommandBuilder()
    .setName('massban')
    .setDescription('Ban multiple users by ID (use with extreme caution)')
    .addStringOption(option =>
      option.setName('user_ids')
        .setDescription('Comma-separated user IDs')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for ban')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'moderation')) {
      return interaction.reply({ content: '❌ Moderation module is disabled.', ephemeral: true });
    }

    const rawIds = interaction.options.getString('user_ids');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const ids = rawIds.split(',').map(id => id.trim()).filter(id => /^\d{17,20}$/.test(id));

    if (ids.length === 0) {
      return interaction.reply({ content: '❌ No valid user IDs provided.', ephemeral: true });
    }

    if (ids.length > 50) {
      return interaction.reply({ content: '❌ Max 50 users at once.', ephemeral: true });
    }

    await interaction.reply({ content: `🔨 Banning ${ids.length} users...`, ephemeral: true });

    let banned = 0;
    for (const id of ids) {
      try {
        await interaction.guild.members.ban(id, { reason: `${interaction.user.tag}: ${reason}` });
        banned++;
      } catch (err) {
        console.warn(`[MASSBAN] Failed to ban ${id}:`, err.message);
      }
    }

    await interaction.followUp({ content: `✅ Banned ${banned}/${ids.length} users | ${reason}`, ephemeral: true });
    await interaction.client.analytics.trackModAction(interaction.guild.id, interaction.user.id, 'massban', null, reason);
  },
};
