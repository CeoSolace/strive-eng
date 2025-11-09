// Alias to tempmute for UX consistency
const tempmute = require('./tempmute');
module.exports = {
   new tempmute.data.constructor()
    .setName('timeout')
    .setDescription('Timeout a user (Discord-native term for mute)')
    .addUserOption(opt => opt.setName('user').setDescription('User to timeout').setRequired(true))
    .addStringOption(opt => opt.setName('duration').setDescription('Duration (e.g. 1h)').setRequired(true))
    .addStringOption(opt => opt.setName('reason').setDescription('Reason').setRequired(false))
    .setDefaultMemberPermissions(tempmute.data.defaultMemberPermissions),
  execute: tempmute.execute
};
