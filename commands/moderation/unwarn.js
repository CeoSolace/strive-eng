const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unwarn')
    .setDescription('Remove a warning from a user')
    .addUserOption(option => option.setName('user').setDescription('User').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Reason').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'moderation')) {
      return interaction.reply({ content: '❌ Moderation module is disabled.', ephemeral: true });
    }

    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason');

    const warning = await interaction.client.db.Warning.findOneAndDelete({
      guildId: interaction.guild.id,
      userId: user.id
    });

    if (!warning) {
      return interaction.reply({ content: '❌ No warning found for this user.', ephemeral: true });
    }

    await interaction.reply({ content: `✅ Removed warning for ${user.tag} | ${reason}` });
  },
};
