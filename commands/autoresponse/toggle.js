const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('toggle')
    .setDescription('Enable/disable an auto-response')
    .addStringOption(option => option.setName('trigger').setDescription('Trigger word').setRequired(true))
    .addBooleanOption(option => option.setName('enabled').setDescription('Enable').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'autoresponse')) {
      return interaction.reply({ content: '❌ Auto-response module is disabled.', ephemeral: true });
    }
    const trigger = interaction.options.getString('trigger').toLowerCase();
    const enabled = interaction.options.getBoolean('enabled');
    await interaction.client.db.AutoResponse.findOneAndUpdate(
      { guildId: interaction.guild.id, trigger },
      { enabled },
      { upsert: true }
    );
    await interaction.reply({ content: `✅ Auto-response "${trigger}" ${enabled ? 'enabled' : 'disabled'}.`, ephemeral: true });
  },
};
