const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('edit')
    .setDescription('Edit an auto-response')
    .addStringOption(option => option.setName('trigger').setDescription('Trigger word').setRequired(true))
    .addStringOption(option => option.setName('response').setDescription('Response').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'autoresponse')) {
      return interaction.reply({ content: '❌ Auto-response module is disabled.', ephemeral: true });
    }
    const trigger = interaction.options.getString('trigger').toLowerCase();
    const response = interaction.options.getString('response');
    await interaction.client.db.AutoResponse.findOneAndUpdate(
      { guildId: interaction.guild.id, trigger },
      { response },
      { upsert: true }
    );
    await interaction.reply({ content: `✅ Auto-response for "${trigger}" updated.`, ephemeral: true });
  },
};
