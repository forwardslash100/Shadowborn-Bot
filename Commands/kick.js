const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick A User From Shadowborn')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The User To Kick')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason For Kick')
        .setRequired(false)),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const member = interaction.guild.members.cache.get(user.id);
    const reason = interaction.options.getString('reason') || 'No Reason Provided';

    if (!member) {
      return await interaction.reply({ content: 'ERROR: User Not Found In This Server.', ephemeral: true });
    }

    if (!member.kickable) {
      return await interaction.reply({ content: 'ERROR: Cannot Kick This User.', ephemeral: true });
    }

    try {
      await member.kick(reason);
      await interaction.reply({ content: `Successfully Kicked <@${user.id}>.\nReason: ${reason}` });

      const logChannel = interaction.guild.channels.cache.find(ch => ch.name === 'timeouts-and-bans');
      if (logChannel) {
        logChannel.send(`User: <@${user.id}> Was Kicked By: ${interaction.user.tag}. Reason: ${reason}`);
      }
    } catch (error) {
      console.error('Error Kicking User:', error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: 'Error Trying To Kick That User.', ephemeral: true });
      } else {
        await interaction.reply({ content: 'Error Trying To Kick That User.', ephemeral: true });
      }
    }
  }
};
