// Alias for userinfo
const userinfo = require('./userinfo');
module.exports = {
   new userinfo.data.constructor()
    .setName('whois')
    .setDescription('Show user information')
    .addUserOption(opt => opt.setName('user').setDescription('User to inspect').setRequired(false)),
  execute: userinfo.execute
};
