const { SlashCommandBuilder } = require('discord.js');

module.exports = {
   new SlashCommandBuilder()
    .setName('activity')
    .setDescription('Show user activity summary')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to inspect')
        .setRequired(false)),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'stats')) {
      return interaction.reply({ content: '❌ Stats module is disabled.', ephemeral: true });
    }

    const user = interaction.options.getUser('user') || interaction.user;
    const data = await interaction.client.db.User.findOne({ guildId: interaction.guild.id, userId: user.id });

    if (!data) {
      return interaction.reply({ content: '📊 No activity data found.', ephemeral: true });
    }

    const msg = data.messageCount || 0;
    const sec = data.voiceSeconds || 0;
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const xp = data.xp || 0;

    const embed = {
      title: `📈 Activity for ${user.tag}`,
      fields: [
        { name: 'Messages', value: msg.toLocaleString(), inline: true },
        { name: 'Voice Time', value: `${hrs}h ${mins}m`, inline: true },
        { name: 'XP', value: xp.toLocaleString(), inline: true },
      ],
      color: 0x5865F2
    };

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
