const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
   new SlashCommandBuilder()
    .setName('listautoroles')
    .setDescription('List all configured autoroles')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'autorole')) {
      return interaction.reply({ content: '❌ Autorole module is disabled.', ephemeral: true });
    }

    const guildDoc = await interaction.client.db.Guild.findOne({ guildId: interaction.guild.id });
    if (!guildDoc?.autorole) {
      return interaction.reply({ content: '📭 No autoroles set.', ephemeral: true });
    }

    const roles = [];
    if (guildDoc.autorole.roleId) {
      const role = interaction.guild.roles.cache.get(guildDoc.autorole.roleId);
      roles.push(`${role || '<deleted>'} (primary)`);
    }
    if (guildDoc.autorole.extraRoles?.length) {
      guildDoc.autorole.extraRoles.forEach(id => {
        const role = interaction.guild.roles.cache.get(id);
        roles.push(`${role || '<deleted>'} (extra)`);
      });
    }

    if (roles.length === 0) {
      return interaction.reply({ content: '📭 All autorole roles have been deleted.', ephemeral: true });
    }

    await interaction.reply({
      content: `🎭 **Autoroles (${roles.length}):**\n${roles.join('\n')}`,
      ephemeral: true
    });
  },
};
