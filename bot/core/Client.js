const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
const EventHandler = require('./EventHandler');
const CommandLoader = require('./CommandLoader');
const TaskManager = require('./TaskManager');
const SecurityKernel = require('./SecurityKernel');
const AnalyticsEngine = require('./AnalyticsEngine');
const ModuleManager = require('./ModuleManager');
const RateLimitHandler = require('./RateLimitHandler');
const WebSocketMonitor = require('./WebSocketMonitor');
const FeatureFlagManager = require('./FeatureFlagManager');
const PolicyEngine = require('./PolicyEngine');
const RecoverySystem = require('./RecoverySystem');
require('dotenv').config();

class StriveClient extends Client {
  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildScheduledEvents
      ],
      partials: [
        Partials.Message,
        Partials.Channel,
        Partials.Reaction,
        Partials.User,
        Partials.GuildMember
      ],
      restTimeOffset: 0,
      restRequestTimeout: 15000,
      failIfNotExists: false
    });

    this.commands = new Collection();
    this.aliases = new Collection();
    this.events = new Collection();
    this.tasks = new Collection();

    // Core systems
    this.security = new SecurityKernel(this);
    this.analytics = new AnalyticsEngine(this);
    this.modules = new ModuleManager(this);
    this.rateLimiter = new RateLimitHandler(this);
    this.wsMonitor = new WebSocketMonitor(this);
    this.features = new FeatureFlagManager(this);
    this.policy = new PolicyEngine(this);
    this.recovery = new RecoverySystem(this);

    this.once('ready', this._onReady.bind(this));
  }

  async _onReady() {
    console.log(`✅ Strive-Endgame online as ${this.user.tag}`);
    this.wsMonitor.start();
    await this.security.initialize();
    await this.analytics.initialize();
    await this.modules.initialize();
    await this.policy.initialize();
    await this.recovery.initialize();
    await new CommandLoader(this).load();
    await new EventHandler(this).load();
    await new TaskManager(this).start();
    this.features.initialize();
    this.rateLimiter.initialize();
  }

  async login(token) {
    await super.login(token);
  }
}

module.exports = StriveClient;
