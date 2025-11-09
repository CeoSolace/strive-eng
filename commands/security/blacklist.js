const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
   new SlashCommandBuilder()
    .setName('blacklist')
    .setDescription('Ban and blacklist a user globally')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to blacklist')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'security')) {
      return interaction.reply({ content: '❌ Security module is disabled.', ephemeral: true });
    }

    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'Blacklisted';
    // Add to global blacklist DB
    await interaction.client.db.Blacklist.create({ userId: user.id, reason, guildId: interaction.guild.id });
    await interaction.guild.members.ban(user, { reason });
    await interaction.reply({ content: `🚫 Blacklisted ${user.tag} | ${reason}`, ephemeral: true });
  },
};
