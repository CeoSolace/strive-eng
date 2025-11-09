const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
   new SlashCommandBuilder()
    .setName('lockdownall')
    .setDescription('Lock all text channels in the server')
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for lockdown')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'moderation')) {
      return interaction.reply({ content: '❌ Moderation module is disabled.', ephemeral: true });
    }

    const reason = interaction.options.getString('reason') || 'No reason provided';
    const textChannels = interaction.guild.channels.cache.filter(
      c => [ChannelType.GuildText, ChannelType.GuildAnnouncement].includes(c.type)
    );

    await interaction.reply({ content: `🔒 Initiating server-wide lockdown (${textChannels.size} channels)...`, ephemeral: true });

    let locked = 0;
    for (const channel of textChannels.values()) {
      try {
        await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
          SendMessages: false
        }, { reason: `${interaction.user.tag}: ${reason}` });
        locked++;
      } catch (err) {
        console.warn(`[LOCKDOWNALL] Failed to lock ${channel.name}:`, err.message);
      }
    }

    await interaction.followUp({ content: `✅ Locked ${locked}/${textChannels.size} channels | ${reason}`, ephemeral: true });
    await interaction.client.analytics.trackModAction(interaction.guild.id, interaction.user.id, 'lockdownall', null, reason);
  },
};
