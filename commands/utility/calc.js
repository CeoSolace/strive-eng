const { SlashCommandBuilder } = require('discord.js');

module.exports = {
   new SlashCommandBuilder()
    .setName('calc')
    .setDescription('Evaluate a mathematical expression')
    .addStringOption(option =>
      option.setName('expression')
        .setDescription('e.g. (2+3)*4')
        .setRequired(true)),
  async execute(interaction) {
    if (!interaction.client.modules.isEnabled(interaction.guild.id, 'utility')) {
      return interaction.reply({ content: '❌ Utility module is disabled.', ephemeral: true });
    }

    const expr = interaction.options.getString('expression');
    // Safe eval alternative
    const allowed = /^[0-9+\-*/().\s%]+$/;
    if (!allowed.test(expr)) {
      return interaction.reply({ content: '❌ Invalid characters in expression.', ephemeral: true });
    }

    try {
      // eslint-disable-next-line no-eval
      const result = eval(expr);
      await interaction.reply({ content: `🧮 ${expr} = ${result}`, ephemeral: true });
    } catch (err) {
      await interaction.reply({ content: '❌ Invalid expression.', ephemeral: true });
    }
  },
};
