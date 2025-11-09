const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
   new SlashCommandBuilder()
    .setName('setautorole')
    .setDescription('Set the primary autorole for new members')
    .addRoleOption(option =>
      option.setName('role')
        .setDescription('Role to assign on join')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'autorole')) {
      return interaction.reply({ content: '❌ Autorole module is disabled.', ephemeral: true });
    }

    const role = interaction.options.getRole('role');
    if (role.managed) {
      return interaction.reply({ content: '❌ Cannot use bot-integrated roles.', ephemeral: true });
    }
    if (role.position >= interaction.guild.members.me.roles.highest.position) {
      return interaction.reply({ content: '❌ I cannot assign roles higher than my highest role.', ephemeral: true });
    }

    try {
      await interaction.client.db.Guild.updateOne(
        { guildId: interaction.guild.id },
        { $set: { 'autorole.roleId': role.id, 'autorole.enabled': true } },
        { upsert: true }
      );
      await interaction.reply({ content: `✅ Primary autorole set to ${role}.`, ephemeral: true });
    } catch (err) {
      console.error('[AUTOROLE] Error setting role:', err);
      await interaction.reply({ content: '❌ Failed to save autorole.', ephemeral: true });
    }
  },
};
