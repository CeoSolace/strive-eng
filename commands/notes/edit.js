const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('edit')
    .setDescription('Edit a mod note')
    .addUserOption(option => option.setName('user').setDescription('User').setRequired(true))
    .addStringOption(option => option.setName('note').setDescription('New note').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const note = interaction.options.getString('note');
    await interaction.client.db.Note.findOneAndUpdate(
      { guildId: interaction.guild.id, userId: user.id },
      { note, editedAt: new Date() },
      { upsert: true }
    );
    await interaction.reply({ content: `✅ Note updated for ${user.tag}.`, ephemeral: true });
  },
};
