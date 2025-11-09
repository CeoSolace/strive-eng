const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nickname')
    .setDescription('Change a user\'s nickname')
    .addUserOption(option => option.setName('user').setDescription('User').setRequired(true))
    .addStringOption(option => option.setName('nickname').setDescription('New nickname (leave empty to reset)').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'moderation')) {
      return interaction.reply({ content: '❌ Moderation module is disabled.', ephemeral: true });
    }

    const user = interaction.options.getUser('user');
    const nickname = interaction.options.getString('nickname') || null;
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);

    if (!member) return interaction.reply({ content: '❌ User not in server.', ephemeral: true });
    if (!member.manageable) return interaction.reply({ content: '❌ Cannot change nickname (role hierarchy).', ephemeral: true });

    try {
      await member.setNickname(nickname, `Requested by ${interaction.user.tag}`);
      await interaction.reply({ content: `✅ Nickname updated for ${user.tag}` });
    } catch (err) {
      await interaction.reply({ content: `❌ Failed to update nickname: ${err.message}`, ephemeral: true });
    }
  },
};
