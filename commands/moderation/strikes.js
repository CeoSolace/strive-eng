const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('strikes')
    .setDescription('View strikes for a user')
    .addUserOption(option => option.setName('user').setDescription('User').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'moderation')) {
      return interaction.reply({ content: '❌ Moderation module is disabled.', ephemeral: true });
    }

    const user = interaction.options.getUser('user');
    const warnings = await interaction.client.db.Warning.find({
      guildId: interaction.guild.id,
      userId: user.id
    });

    if (warnings.length === 0) {
      return interaction.reply({ content: `${user.tag} has no strikes.`, ephemeral: true });
    }

    const description = warnings.map(w => `**${new Date(w.timestamp).toLocaleString()}** - ${w.reason} (by <@${w.moderator}>)`).join('\n');
    const embed = {
      title: `⚠️ Strikes for ${user.tag}`,
      description,
      color: 0xffcc00
    };

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
