// data/seeds/defaultGuild.js
const Guild = require('../schemas/Guild');

async function createDefaultGuild(guildId) {
  const existing = await Guild.findOne({ guildId });
  if (existing) return existing;

  const defaultGuild = new Guild({
    guildId,
    modules: {
      welcome: true,
      autorole: true,
      leveling: true,
      automod: false,
      security: false,
      tickets: true,
      reactionroles: true,
      giveaways: true,
      stats: true,
      fun: true
    },
    welcome: {
      enabled: false,
      message: 'Welcome {user} to {server}!'
    },
    leveling: {
      enabled: true,
      cooldown: 30
    }
  });

  await defaultGuild.save();
  return defaultGuild;
}

module.exports = { createDefaultGuild };
