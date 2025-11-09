const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('removeautorole')
    .setDescription('Remove an autorole (primary or extra)')
    .addRoleOption(option =>
      option.setName('role')
        .setDescription('Role to remove')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'autorole')) {
      return interaction.reply({ content: '❌ Autorole module is disabled.', ephemeral: true });
    }

    const role = interaction.options.getRole('role');
    const guildDoc = await interaction.client.db.Guild.findOne({ guildId: interaction.guild.id });

    if (!guildDoc || (!guildDoc.autorole?.roleId && !guildDoc.autorole?.extraRoles?.length)) {
      return interaction.reply({ content: '❌ No autoroles configured.', ephemeral: true });
    }

    try {
      let removed = false;
      if (guildDoc.autorole.roleId === role.id) {
        await interaction.client.db.Guild.updateOne(
          { guildId: interaction.guild.id },
          { $unset: { 'autorole.roleId': "" } }
        );
        removed = true;
      } else if (guildDoc.autorole.extraRoles?.includes(role.id)) {
        await interaction.client.db.Guild.updateOne(
          { guildId: interaction.guild.id },
          { $pull: { 'autorole.extraRoles': role.id } }
        );
        removed = true;
      }

      if (!removed) {
        return interaction.reply({ content: '❌ This role is not in autoroles.', ephemeral: true });
      }

      await interaction.reply({ content: `✅ Removed ${role} from autoroles.`, ephemeral: true });
    } catch (err) {
      console.error('[AUTOROLE] Error removing role:', err);
      await interaction.reply({ content: '❌ Failed to remove autorole.', ephemeral: true });
    }
  },
};
