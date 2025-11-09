const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
   new SlashCommandBuilder()
    .setName('cooldown')
    .setDescription('Set XP cooldown (seconds between messages)')
    .addIntegerOption(option =>
      option.setName('seconds')
        .setDescription('Cooldown in seconds (default: 30)')
        .setMinValue(5)
        .setMaxValue(300)
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'leveling')) {
      return interaction.reply({ content: '❌ Leveling module is disabled.', ephemeral: true });
    }

    const seconds = interaction.options.getInteger('seconds');
    await interaction.client.db.Guild.updateOne(
      { guildId: interaction.guild.id },
      { $set: { 'leveling.cooldown': seconds } },
      { upsert: true }
    );
    await interaction.reply({ content: `✅ XP cooldown set to ${seconds} seconds.`, ephemeral: true });
  },
};
