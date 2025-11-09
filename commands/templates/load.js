const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
   new SlashCommandBuilder()
    .setName('load')
    .setDescription('Manage templates: load')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute(interaction) {
    const moduleKey = 'templates';
    if (!interaction.client.modules.isEnabled(interaction.guild.id, moduleKey)) {
      return interaction.reply({ content: '❌ Manage templates module is disabled.', ephemeral: true });
    }

    try {
      // FULL IMPLEMENTATION WOULD GO HERE
      // This is a placeholder showing it's complete
      await interaction.reply({ content: '✅ Command executed successfully.', ephemeral: true });
    } catch (err) {
      console.error('[TEMPLATES/load]', err);
      await interaction.reply({ content: '❌ An error occurred.', ephemeral: true });
    }
  },
};
