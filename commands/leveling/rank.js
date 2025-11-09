const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
   new SlashCommandBuilder()
    .setName('rank')
    .setDescription('View your XP rank')
    .addUserOption(option => option.setName('user').setDescription('Check another user')),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'leveling')) {
      return interaction.reply({ content: '❌ Leveling module is disabled.', ephemeral: true });
    }

    const user = interaction.options.getUser('user') || interaction.user;
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    if (!member) {
      return interaction.reply({ content: '❌ User not in server.', ephemeral: true });
    }

    const userData = await interaction.client.db.User.findOne({ guildId: interaction.guild.id, userId: user.id });
    const xp = userData?.xp || 0;
    const level = Math.floor(0.1 * Math.sqrt(xp));
    const nextLevelXP = (level + 1) * (level + 1) * 100;
    const currentLevelXP = level * level * 100;
    const progress = xp - currentLevelXP;
    const total = nextLevelXP - currentLevelXP;
    const percent = total > 0 ? Math.min(100, Math.floor((progress / total) * 100)) : 100;
    const barLength = 15;
    const filled = Math.floor((percent / 100) * barLength);
    const bar = '█'.repeat(filled) + '░'.repeat(barLength - filled);

    const embed = new EmbedBuilder()
      .setTitle(`📊 Rank for ${user.username}`)
      .setDescription(`**Level:** ${level}\n**XP:** ${xp.toLocaleString()}/${nextLevelXP.toLocaleString()}\n\`${bar}\` ${percent}%`)
      .setColor(0x5865F2)
      .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 128 }))
      .setFooter({ text: `Member since ${member.joinedAt.toLocaleDateString()}` });

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
