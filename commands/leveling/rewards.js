const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
   new SlashCommandBuilder()
    .setName('rewards')
    .setDescription('Manage XP level rewards')
    .addSubcommand(sub =>
      sub.setName('add')
        .setDescription('Add a reward')
        .addIntegerOption(opt => opt.setName('level').setDescription('Required level').setRequired(true))
        .addRoleOption(opt => opt.setName('role').setDescription('Reward role').setRequired(true)))
    .addSubcommand(sub =>
      sub.setName('remove')
        .setDescription('Remove a reward')
        .addIntegerOption(opt => opt.setName('level').setDescription('Level to remove').setRequired(true)))
    .addSubcommand(sub => sub.setName('list').setDescription('List all rewards'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'leveling')) {
      return interaction.reply({ content: '❌ Leveling module is disabled.', ephemeral: true });
    }

    const sub = interaction.options.getSubcommand();

    if (sub === 'add') {
      const level = interaction.options.getInteger('level');
      const role = interaction.options.getRole('role');
      if (role.managed) {
        return interaction.reply({ content: '❌ Cannot use bot roles.', ephemeral: true });
      }
      if (role.position >= interaction.guild.members.me.roles.highest.position) {
        return interaction.reply({ content: '❌ I cannot assign roles higher than my highest role.', ephemeral: true });
      }

      await interaction.client.db.Guild.updateOne(
        { guildId: interaction.guild.id },
        { $set: { [`leveling.rewards.${level}`]: role.id } }
      );
      await interaction.reply({ content: `✅ Added reward: Level ${level} → ${role}`, ephemeral: true });

    } else if (sub === 'remove') {
      const level = interaction.options.getInteger('level');
      const guildDoc = await interaction.client.db.Guild.findOne({ guildId: interaction.guild.id });
      if (!guildDoc?.leveling?.rewards || !guildDoc.leveling.rewards[level]) {
        return interaction.reply({ content: `❌ No reward configured for Level ${level}.`, ephemeral: true });
      }

      await interaction.client.db.Guild.updateOne(
        { guildId: interaction.guild.id },
        { $unset: { [`leveling.rewards.${level}`]: "" } }
      );
      await interaction.reply({ content: `✅ Removed reward for Level ${level}.`, ephemeral: true });

    } else if (sub === 'list') {
      const guildDoc = await interaction.client.db.Guild.findOne({ guildId: interaction.guild.id });
      const rewards = guildDoc?.leveling?.rewards || {};
      if (Object.keys(rewards).length === 0) {
        return interaction.reply({ content: '📭 No rewards configured.', ephemeral: true });
      }

      const sorted = Object.entries(rewards)
        .sort(([a], [b]) => parseInt(a) - parseInt(b))
        .map(([lvl, roleId]) => {
          const role = interaction.guild.roles.cache.get(roleId);
          return `Level ${lvl}: ${role || '<deleted role>'}`;
        });

      const chunks = [];
      for (let i = 0; i < sorted.length; i += 10) {
        chunks.push(sorted.slice(i, i + 10).join('\n'));
      }

      const embed = new EmbedBuilder()
        .setTitle('🎁 Level Rewards')
        .setDescription(chunks[0] || 'None')
        .setColor(0x5865F2);

      await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};
