const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
   new SlashCommandBuilder()
    .setName('case')
    .setDescription('View or manage moderation cases')
    .addSubcommand(subcommand =>
      subcommand.setName('view')
        .setDescription('View a case by ID')
        .addIntegerOption(option => option.setName('case_id').setDescription('Case ID').setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand.setName('delete')
        .setDescription('Delete a case')
        .addIntegerOption(option => option.setName('case_id').setDescription('Case ID').setRequired(true)))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'moderation')) {
      return interaction.reply({ content: '❌ Moderation module is disabled.', ephemeral: true });
    }

    const subcommand = interaction.options.getSubcommand();
    const caseId = interaction.options.getInteger('case_id');

    if (subcommand === 'view') {
      const warning = await interaction.client.db.Warning.findOne({
        guildId: interaction.guild.id,
        caseId
      });

      if (!warning) {
        return interaction.reply({ content: '❌ Case not found.', ephemeral: true });
      }

      const embed = {
        title: `Case #${caseId}`,
        fields: [
          { name: 'User', value: `<@${warning.userId}> (\`${warning.userId}\`)`, inline: true },
          { name: 'Moderator', value: `<@${warning.moderator}>`, inline: true },
          { name: 'Reason', value: warning.reason },
          { name: 'Date', value: `<t:${Math.floor(warning.timestamp / 1000)}:R>`, inline: true }
        ],
        color: 0x4f545c
      };

      await interaction.reply({ embeds: [embed], ephemeral: true });
    } else if (subcommand === 'delete') {
      const result = await interaction.client.db.Warning.findOneAndDelete({
        guildId: interaction.guild.id,
        caseId
      });

      if (!result) {
        return interaction.reply({ content: '❌ Case not found.', ephemeral: true });
      }

      await interaction.reply({ content: `✅ Deleted case #${caseId}.`, ephemeral: true });
    }
  },
};
