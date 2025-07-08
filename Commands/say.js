const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Make The Shadowborn Bot Say Something')
    .addStringOption(option =>
      option.setName('message')
        .setDescription('The Message To Say')
        .setRequired(true)
    ),

  async execute(interaction) {
    const message = interaction.options.getString('message');

    await interaction.reply({ content: 'Message Sent', ephemeral: true });

    await interaction.channel.send(message);
  }
};
