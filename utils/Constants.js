// utils/Constants.js

class Constants {
  static PLAN_TIERS = {
    CHEAP: ['cheap_basic', 'cheap_standard', 'cheap_pro'],
    EXPENSIVE: ['exp_elite', 'exp_business', 'exp_enterprise']
  };

  static MODULES = [
    'welcome', 'autorole', 'leveling', 'automod', 'security',
    'tickets', 'reactionroles', 'giveaways', 'stats', 'music',
    'fun', 'premium', 'config', 'voice', 'threads', 'forums',
    'stages', 'onboarding', 'emojis', 'stickers', 'schedules',
    'templates', 'rolesubs', 'screening', 'notes', 'autoresponse', 'backup'
  ];

  static DYNAMIC_SLOWMODE_THRESHOLDS = {
    spam: 30,
    raid: 60,
    normal: 0
  };

  static STRIPE_WEBHOOK_EVENTS = [
    'checkout.session.completed',
    'customer.subscription.deleted',
    'customer.subscription.updated'
  ];
}

module.exports = Constants;
