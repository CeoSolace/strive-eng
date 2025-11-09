const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
   new SlashCommandBuilder()
    .setName('setwelcomemsg')
    .setDescription('Set the welcome message')
    .addStringOption(option =>
      option.setName('message')
        .setDescription('Use {user}, {server}, {member_count}')
        .setRequired(true))
    .addBooleanOption(option =>
      option.setName('embed')
        .setDescription('Send as embed')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'welcome')) {
      return interaction.reply({ content: '❌ Welcome module is disabled.', ephemeral: true });
    }

    const msg = interaction.options.getString('message');
    const embed = interaction.options.getBoolean('embed') || false;

    // Save to DB
    await interaction.client.db.Guild.updateOne(
      { guildId: interaction.guild.id },
      { $set: { 'welcome.message': msg, 'welcome.embed': embed } },
      { upsert: true }
    );

    await interaction.reply({ content: `✅ Welcome message set. Use \`/testwelcome\` to preview.`, ephemeral: true });
  },
};
