const { SlashCommandBuilder } = require('discord.js');

module.exports = {
   new SlashCommandBuilder()
    .setName('serverqr')
    .setDescription('Generate a QR code for server invite'),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'utility')) {
      return interaction.reply({ content: '❌ Utility module is disabled.', ephemeral: true });
    }

    let invite;
    try {
      const invites = await interaction.guild.invites.fetch();
      invite = invites.size ? invites.first() : await interaction.channel.createInvite({ maxAge: 0 });
    } catch (err) {
      return interaction.reply({ content: '❌ I need `Create Invite` permission.', ephemeral: true });
    }

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(invite.url)}`;
    await interaction.reply({ content: `🔗 **${interaction.guild.name}**\n${qrUrl}` });
  },
};
