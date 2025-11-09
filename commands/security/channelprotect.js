const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
   new SlashCommandBuilder()
    .setName('channelprotect')
    .setDescription('Protect a channel from deletion/permission changes')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('Channel to protect')
        .setRequired(true))
    .addBooleanOption(option =>
      option.setName('protect')
        .setDescription('Enable or disable protection')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'security')) {
      return interaction.reply({ content: '❌ Security module is disabled.', ephemeral: true });
    }

    const channel = interaction.options.getChannel('channel');
    const protect = interaction.options.getBoolean('protect');

    if (protect) {
      await interaction.client.security.protectChannel(interaction.guild.id, channel.id);
    }

    await interaction.reply({ content: `🔐 Channel ${channel.name} ${protect ? 'protected' : 'unprotected'}.`, ephemeral: true });
  },
};
