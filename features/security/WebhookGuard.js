// features/security/WebhookGuard.js

class WebhookGuard {
  constructor(client) {
    this.client = client;
  }

  async handleWebhookUpdate(channel) {
    const webhooks = await channel.fetchWebhooks();
    for (const webhook of webhooks.values()) {
      if (webhook.owner.id !== this.client.user.id) {
        // Log suspicious webhook
        await this.client.security.auditLogger.log(channel.guild.id, 'SUSPICIOUS_WEBHOOK', {
          webhookId: webhook.id,
          channelId: channel.id,
          creatorId: webhook.owner.id
        });
        // Optionally delete
        // await webhook.delete('Non-bot webhook in protected channel');
      }
    }
  }
}

module.exports = WebhookGuard;
