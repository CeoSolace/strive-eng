const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
   new SlashCommandBuilder()
    .setName('whitelist')
    .setDescription('Whitelist a user from security filters')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to whitelist')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'security')) {
      return interaction.reply({ content: '❌ Security module is disabled.', ephemeral: true });
    }

    const user = interaction.options.getUser('user');
    // Add to whitelist set in SecurityKernel or DB
    interaction.client.security.whitelisted.set(`${interaction.guild.id}-${user.id}`, true);
    await interaction.reply({ content: `✅ Whitelisted ${user.tag} from security actions.`, ephemeral: true });
  },
};
