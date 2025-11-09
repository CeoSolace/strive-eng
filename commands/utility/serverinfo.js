const { SlashCommandBuilder } = require('discord.js');

module.exports = {
   new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Show server information'),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'utility')) {
      return interaction.reply({ content: '❌ Utility module is disabled.', ephemeral: true });
    }

    const guild = interaction.guild;
    const embed = {
      title: `ℹ️ ${guild.name}`,
      thumbnail: { url: guild.iconURL({ dynamic: true, size: 1024 }) || null },
      fields: [
        { name: 'Owner', value: `<@${guild.ownerId}>`, inline: true },
        { name: 'Members', value: guild.memberCount.toLocaleString(), inline: true },
        { name: 'Boosts', value: guild.premiumSubscriptionCount || '0', inline: true },
        { name: 'Created', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`, inline: true },
        { name: 'Roles', value: guild.roles.cache.size.toString(), inline: true },
        { name: 'Channels', value: guild.channels.cache.size.toString(), inline: true },
      ],
      color: 0x5865F2,
      timestamp: new Date()
    };

    await interaction.reply({ embeds: [embed] });
  },
};
