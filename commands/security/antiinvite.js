const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
   new SlashCommandBuilder()
    .setName('antiinvite')
    .setDescription('Block Discord invite links')
    .addBooleanOption(option =>
      option.setName('enabled')
        .setDescription('Enable or disable')
        .setRequired(true))
    .addBooleanOption(option =>
      option.setName('whitelist_partner')
        .setDescription('Allow partner/server invites')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'security')) {
      return interaction.reply({ content: '❌ Security module is disabled.', ephemeral: true });
    }

    const enabled = interaction.options.getBoolean('enabled');
    const partner = interaction.options.getBoolean('whitelist_partner') || false;
    // Update DB
    await interaction.reply({ content: `✉️ Anti-invite ${enabled ? 'enabled' : 'disabled'} ${partner ? '(partner invites allowed)' : ''}.`, ephemeral: true });
  },
};
