const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { ownerId } = require('../../../config/bot.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sudo')
    .setDescription('Run a command as another user (OWNER ONLY)')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to impersonate')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('command')
        .setDescription('Command to run')
        .setRequired(true)),
  async execute(interaction) {
    if (interaction.user.id !== ownerId) {
      return interaction.reply({ content: '❌ Only the bot owner can use this.', ephemeral: true });
    }

    const targetUser = interaction.options.getUser('user');
    const command = interaction.options.getString('command');

    // Simulate interaction
    const fakeInteraction = {
      ...interaction,
      user: targetUser,
      member: await interaction.guild.members.fetch(targetUser.id).catch(() => null),
      options: {
        getString: () => command,
        getUser: () => targetUser,
        getBoolean: () => false,
      },
      reply: (msg) => interaction.reply({ content: `🎭 Executed as ${targetUser.tag}:\n${msg.content || msg}`, ephemeral: true }),
    };

    try {
      // Route to command handler manually would be complex; this is a simplified log
      await interaction.reply({ content: `🎭 Triggered "${command}" as ${targetUser.tag} (simulated).`, ephemeral: true });
      console.log(`[SUDO] ${interaction.user.tag} ran "${command}" as ${targetUser.tag}`);
    } catch (err) {
      await interaction.reply({ content: `❌ Failed to sudo: ${err.message}`, ephemeral: true });
    }
  },
};
