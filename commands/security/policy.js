const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
   new SlashCommandBuilder()
    .setName('policy')
    .setDescription('Manage custom security policies')
    .addSubcommand(sc => sc.setName('create').setDescription('Create a policy')
      .addStringOption(opt => opt.setName('name').setDescription('Policy name').setRequired(true))
      .addStringOption(opt => opt.setName('rule').setDescription('Rule (JSON)').setRequired(true)))
    .addSubcommand(sc => sc.setName('list').setDescription('List policies'))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'security')) {
      return interaction.reply({ content: '❌ Security module is disabled.', ephemeral: true });
    }

    const sub = interaction.options.getSubcommand();
    if (sub === 'create') {
      const name = interaction.options.getString('name');
      const rule = interaction.options.getString('rule');
      // Parse and store rule in DB
      await interaction.reply({ content: `📜 Policy "${name}" created.`, ephemeral: true });
    } else if (sub === 'list') {
      // Fetch from DB
      await interaction.reply({ content: '📜 Policies: none yet.', ephemeral: true });
    }
  },
};
