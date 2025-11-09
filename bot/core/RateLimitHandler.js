class RateLimitHandler {
  constructor(client) {
    this.client = client;
    this.globalReset = null;
    this.globalRemaining = 50;
  }

  initialize() {
    this.client.rest.on('rateLimited', (info) => {
      console.warn(`[RATELIMIT] ${info.timeout}ms for ${info.method} ${info.route}`);
    });
  }
}

module.exports = RateLimitHandler;
