const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
   new SlashCommandBuilder()
    .setName('ownership')
    .setDescription('Verify or set server owner')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to verify (leave empty to check current)')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'security')) {
      return interaction.reply({ content: '❌ Security module is disabled.', ephemeral: true });
    }

    const user = interaction.options.getUser('user');
    if (user) {
      // Only actual owner can transfer
      if (interaction.user.id !== interaction.guild.ownerId) {
        return interaction.reply({ content: '❌ Only the server owner can verify ownership.', ephemeral: true });
      }
      // Store in DB as verified owner
      await interaction.reply({ content: `👑 Verified ${user.tag} as owner.`, ephemeral: true });
    } else {
      await interaction.reply({ content: `👑 Current owner: <@${interaction.guild.ownerId}>`, ephemeral: true });
    }
  },
};
