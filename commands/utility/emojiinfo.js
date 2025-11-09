const { SlashCommandBuilder } = require('discord.js');

module.exports = {
   new SlashCommandBuilder()
    .setName('emojiinfo')
    .setDescription('Get info about an emoji')
    .addStringOption(option =>
      option.setName('emoji')
        .setDescription('Emoji to inspect')
        .setRequired(true)),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'utility')) {
      return interaction.reply({ content: '❌ Utility module is disabled.', ephemeral: true });
    }

    const emojiStr = interaction.options.getString('emoji');
    const guild = interaction.guild;

    // Try to parse as custom emoji
    const match = emojiStr.match(/<?(a)?:?(\w{2,32}):(\d{17,20})>?/);
    if (match) {
      const animated = Boolean(match[1]);
      const name = match[2];
      const id = match[3];
      const url = `https://cdn.discordapp.com/emojis/${id}.${animated ? 'gif' : 'png'}?quality=lossless`;

      const embed = {
        title: `🔤 Emoji Info: ${name}`,
        thumbnail: { url },
        fields: [
          { name: 'ID', value: id, inline: true },
          { name: 'Animated', value: animated ? 'Yes' : 'No', inline: true },
          { name: 'URL', value: `[Link](${url})`, inline: true }
        ],
        color: 0x5865F2
      };

      return await interaction.reply({ embeds: [embed] });
    }

    // Unicode emoji
    await interaction.reply({ content: `🔤 Unicode emoji: \`${emojiStr}\``, ephemeral: true });
  },
};
