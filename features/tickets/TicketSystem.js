// features/tickets/TicketSystem.js

class TicketSystem {
  constructor(client) {
    this.client = client;
  }

  async createTicket(guild, user, topic = 'Support') {
    const channel = await guild.channels.create({
      name: `ticket-${user.username}`,
      type: 0,
      parent: null,
      permissionOverwrites: [
        { id: guild.roles.everyone, deny: ['ViewChannel'] },
        { id: user.id, allow: ['ViewChannel', 'SendMessages'] },
        { id: guild.members.me.roles.highest, allow: ['ViewChannel', 'SendMessages', 'ManageMessages'] }
      ]
    });

    await channel.send({
      content: `${user}, your ticket has been created.`,
      embeds: [{ description: `**Topic:** ${topic}`, color: 0x5865F2 }]
    });

    await this.client.db.Ticket.create({
      guildId: guild.id,
      channelId: channel.id,
      userId: user.id,
      topic,
      createdAt: new Date()
    });
  }

  async closeTicket(channel) {
    const ticket = await this.client.db.Ticket.findOne({ channelId: channel.id });
    if (!ticket) return;

    await channel.delete('Ticket closed');
    await this.client.db.Ticket.updateOne({ _id: ticket._id }, { closedAt: new Date() });
  }
}

module.exports = TicketSystem;
