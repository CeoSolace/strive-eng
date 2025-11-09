const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
   new SlashCommandBuilder()
    .setName('mentionlimit')
    .setDescription('Limit user mentions per message')
    .addIntegerOption(option =>
      option.setName('max_mentions')
        .setDescription('Max mentions (0 = disable all)')
        .setMinValue(0)
        .setMaxValue(10)
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'security')) {
      return interaction.reply({ content: '❌ Security module is disabled.', ephemeral: true });
    }

    const max = interaction.options.getInteger('max_mentions');
    // Update DB
    await interaction.reply({ content: `@️ Mention limit set to ${max === 0 ? 'block all' : max}.`, ephemeral: true });
  },
};
