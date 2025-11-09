// Alias for purge — same behavior
const purge = require('./purge');
module.exports = {
  data: new purge.data.constructor()
    .setName('clear')
    .setDescription('Delete up to 100 messages')
    .addIntegerOption(opt => opt.setName('amount').setDescription('Number of messages (1–100)').setMinValue(1).setMaxValue(100).setRequired(true))
    .addUserOption(opt => opt.setName('user').setDescription('Only delete messages from this user'))
    .setDefaultMemberPermissions(purge.data.defaultMemberPermissions),
  execute: purge.execute
};
