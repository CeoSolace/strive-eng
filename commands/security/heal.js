const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
   new SlashCommandBuilder()
    .setName('heal')
    .setDescription('Restore protected roles/channels to last known good state')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'security')) {
      return interaction.reply({ content: '❌ Security module is disabled.', ephemeral: true });
    }

    await interaction.deferReply({ ephemeral: true });
    // Trigger RecoverySystem full heal
    await interaction.client.recovery.healGuild(interaction.guild);
    await interaction.editReply({ content: '⚕️ Healing complete. Protected assets restored.' });
  },
};
