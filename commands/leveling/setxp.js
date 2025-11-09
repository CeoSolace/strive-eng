const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
   new SlashCommandBuilder()
    .setName('setxp')
    .setDescription('Set XP for a user')
    .addUserOption(option => option.setName('user').setDescription('User').setRequired(true))
    .addIntegerOption(option => option.setName('xp').setDescription('XP amount').setMinValue(0).setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'leveling')) {
      return interaction.reply({ content: '❌ Leveling module is disabled.', ephemeral: true });
    }

    const user = interaction.options.getUser('user');
    const xp = interaction.options.getInteger('xp');
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    if (!member) {
      return interaction.reply({ content: '❌ User not in server.', ephemeral: true });
    }

    await interaction.client.db.User.updateOne(
      { guildId: interaction.guild.id, userId: user.id },
      { $set: { xp, lastUpdated: new Date() } },
      { upsert: true }
    );

    // Check for level-up rewards
    const level = Math.floor(0.1 * Math.sqrt(xp));
    const guildDoc = await interaction.client.db.Guild.findOne({ guildId: interaction.guild.id });
    const rewardRoleId = guildDoc?.leveling?.rewards?.[level];
    if (rewardRoleId) {
      const role = interaction.guild.roles.cache.get(rewardRoleId);
      if (role && !member.roles.cache.has(role.id) && role.editable) {
        await member.roles.add(role, 'Level reward');
      }
    }

    await interaction.reply({ content: `✅ Set ${user.tag} XP to ${xp.toLocaleString()}.`, ephemeral: true });
  },
};
