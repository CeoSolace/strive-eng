const { SlashCommandBuilder } = require('discord.js');

module.exports = {
   new SlashCommandBuilder()
    .setName('roles')
    .setDescription('List all server roles'),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'utility')) {
      return interaction.reply({ content: '❌ Utility module is disabled.', ephemeral: true });
    }

    const roles = interaction.guild.roles.cache
      .filter(r => r.id !== interaction.guild.id)
      .sort((a, b) => b.position - a.position)
      .map(r => `${r} (${r.members.size})`)
      .join('\n');

    if (!roles) {
      return interaction.reply({ content: 'No roles found.', ephemeral: true });
    }

    const chunks = roles.match(/(.|[\r\n]){1,4000}/g) || [];
    if (chunks.length > 10) {
      return interaction.reply({ content: '⚠️ Too many roles to display.', ephemeral: true });
    }

    for (let i = 0; i < chunks.length; i++) {
      await interaction.reply({ content: chunks[i], ephemeral: i > 0 });
    }
  },
};
