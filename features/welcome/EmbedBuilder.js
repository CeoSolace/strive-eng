// features/welcome/EmbedBuilder.js
const { EmbedBuilder } = require('discord.js');

class EmbedBuilderModule {
  constructor(client) {
    this.client = client;
  }

  buildWelcomeEmbed(member, description) {
    return new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle('Welcome!')
      .setDescription(description)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 128 }))
      .setFooter({ text: `Member #${member.guild.memberCount}`, iconURL: member.guild.iconURL() || undefined })
      .setTimestamp();
  }

  buildLeaveEmbed(member, description) {
    return new EmbedBuilder()
      .setColor(0xed4245)
      .setTitle('Goodbye')
      .setDescription(description)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 128 }))
      .setFooter({ text: `Now ${member.guild.memberCount - 1} members`, iconURL: member.guild.iconURL() || undefined })
      .setTimestamp();
  }
}

module.exports = EmbedBuilderModule;
