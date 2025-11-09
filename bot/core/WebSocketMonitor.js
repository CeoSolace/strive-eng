class WebSocketMonitor {
  constructor(client) {
    this.client = client;
    this.pingHistory = [];
  }

  start() {
    setInterval(() => {
      this.pingHistory.push(this.client.ws.ping);
      if (this.pingHistory.length > 10) this.pingHistory.shift();
      const avg = this.pingHistory.reduce((a, b) => a + b, 0) / this.pingHistory.length;
      if (avg > 300) console.warn(`[WS] High latency: ${avg.toFixed(2)}ms`);
    }, 30000);
  }
}

module.exports = WebSocketMonitor;
