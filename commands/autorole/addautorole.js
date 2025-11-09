const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
   new SlashCommandBuilder()
    .setName('addautorole')
    .setDescription('Add an extra autorole (multiple roles)')
    .addRoleOption(option =>
      option.setName('role')
        .setDescription('Additional role to assign')
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
      const guildDoc = await interaction.client.db.Guild.findOne({ guildId: interaction.guild.id });
      const extraRoles = guildDoc?.autorole?.extraRoles || [];
      
      if (extraRoles.includes(role.id)) {
        return interaction.reply({ content: '❌ This role is already in extra autoroles.', ephemeral: true });
      }

      await interaction.client.db.Guild.updateOne(
        { guildId: interaction.guild.id },
        { $addToSet: { 'autorole.extraRoles': role.id } },
        { upsert: true }
      );

      await interaction.reply({ content: `✅ Added ${role} to autoroles.`, ephemeral: true });
    } catch (err) {
      console.error('[AUTOROLE] Error adding extra role:', err);
      await interaction.reply({ content: '❌ Failed to add autorole.', ephemeral: true });
    }
  },
};
