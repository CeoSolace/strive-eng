const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
   new SlashCommandBuilder()
    .setName('requirements')
    .setDescription('Set giveaway entry requirements')
    .addRoleOption(option => option.setName('role').setDescription('Required role'))
    .addBooleanOption(option => option.setName('boosters_only').setDescription('Boosters only'))
    .addIntegerOption(option => option.setName('min_account_age').setDescription('Min account age (days)'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'giveaways')) {
      return interaction.reply({ content: '❌ Giveaways module is disabled.', ephemeral: true });
    }

    const role = interaction.options.getRole('role');
    const boostersOnly = interaction.options.getBoolean('boosters_only') || false;
    const minAge = interaction.options.getInteger('min_account_age') || 0;

    await interaction.client.db.Guild.updateOne(
      { guildId: interaction.guild.id },
      { $set: { 'giveaways.requirements': { role: role?.id, boostersOnly, minAge } } },
      { upsert: true }
    );

    await interaction.reply({ content: '✅ Giveaway requirements updated.', ephemeral: true });
  },
};
