const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Timeout A User From Shadowborn')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User To Timeout')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('duration')
        .setDescription('Timeout Duration (In Minutes)')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason For Timeout')
        .setRequired(false)),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const member = interaction.guild.members.cache.get(user.id);
    const duration = interaction.options.getInteger('duration');
    const reason = interaction.options.getString('reason') || 'No Reason Provided';

    if (!member) {
      return await interaction.reply({ content: 'ERROR: User Not Found In This Server.', ephemeral: true });
    }

    if (!member.moderatable) {
      return await interaction.reply({ content: 'ERROR: Cannot Timeout This User.', ephemeral: true });
    }

    try {
      const msDuration = duration * 60 * 1000;

      await member.timeout(msDuration, reason);
      await interaction.reply({ content: `Successfully Timed Out <@${user.id}> For ${duration} Minute(s).\nReason: ${reason}` });

      const logChannel = interaction.guild.channels.cache.find(ch => ch.name === 'timeouts-and-bans');
      if (logChannel) {
        logChannel.send(`User: <@${user.id}> Was Timed Out By: ${interaction.user.tag} For: ${duration} Minute(s). Reason: ${reason}`);
      }
    } catch (error) {
      console.error('Error Timing Out User:', error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: 'Error Trying To Timeout That User.', ephemeral: true });
      } else {
        await interaction.reply({ content: 'Error Trying To Timeout That User.', ephemeral: true });
      }
    }
  }
};
