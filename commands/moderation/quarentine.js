const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
   new SlashCommandBuilder()
    .setName('quarantine')
    .setDescription('Isolate a user in a restricted role')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to quarantine')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'moderation')) {
      return interaction.reply({ content: '❌ Moderation module is disabled.', ephemeral: true });
    }

    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);

    if (!member) return interaction.reply({ content: '❌ User not in server.', ephemeral: true });

    // Try to find or create quarantine role
    let quarantineRole = interaction.guild.roles.cache.find(r => r.name.toLowerCase() === 'quarantined');
    if (!quarantineRole) {
      try {
        quarantineRole = await interaction.guild.roles.create({
          name: 'Quarantined',
          color: '#ff0000',
          reason: 'Created by Strive-Endgame for quarantine',
          mentionable: false
        });

        // Apply restrictive permissions to all channels
        for (const [id, channel] of interaction.guild.channels.cache) {
          if (channel.type === 0 || channel.type === 2 || channel.type === 5 || channel.type === 10 || channel.type === 11 || channel.type === 12) {
            await channel.permissionOverwrites.edit(quarantineRole, {
              ViewChannel: false,
              SendMessages: false,
              Connect: false
            });
          }
        }
      } catch (err) {
        return interaction.reply({ content: '❌ Failed to create quarantine role. Check my permissions.', ephemeral: true });
      }
    }

    try {
      await member.roles.add(quarantineRole, `${interaction.user.tag}: ${reason}`);
      await interaction.reply({ content: `☣️ Quarantined ${user.tag} | ${reason}` });
      await interaction.client.analytics.trackModAction(interaction.guild.id, interaction.user.id, 'quarantine', user.id, reason);
    } catch (err) {
      await interaction.reply({ content: `❌ Failed to quarantine: ${err.message}`, ephemeral: true });
    }
  },
};
