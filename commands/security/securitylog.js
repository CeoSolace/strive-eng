const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
   new SlashCommandBuilder()
    .setName('securitylog')
    .setDescription('Set channel for security alerts')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('Log channel')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ViewAuditLog),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'security')) {
      return interaction.reply({ content: '❌ Security module is disabled.', ephemeral: true });
    }

    const channel = interaction.options.getChannel('channel');
    // Save to DB: Guild.security.logChannel = channel.id
    await interaction.reply({ content: `📜 Security logs will be sent to ${channel}.`, ephemeral: true });
  },
};
