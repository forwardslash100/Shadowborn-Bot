const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('untimeout')
    .setDescription('Remove Timeout From A User')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The User To Remove Timeout From')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason For Removing Timeout')
        .setRequired(false)),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const member = interaction.guild.members.cache.get(user.id);
    const reason = interaction.options.getString('reason') || 'No Reason Provided';

    if (!member) {
      return await interaction.reply({ content: 'ERROR: User Not Found In This Server.', ephemeral: true });
    }

    if (!member.moderatable) {
      return await interaction.reply({ content: 'ERROR: Cannot Untimeout This User.', ephemeral: true });
    }

    try {
      await member.timeout(null, reason);
      await interaction.reply({ content: `Successfully Removed Timeout From <@${user.id}>.\nReason: ${reason}` });

      const logChannel = interaction.guild.channels.cache.find(ch => ch.name === 'timeouts-and-bans');
      if (logChannel) {
        logChannel.send(`User: <@${user.id}> Had Their Timeout Removed By: ${interaction.user.tag}. Reason: ${reason}`);
      }
    } catch (error) {
      console.error('Error Removing Timeout:', error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: 'Error Trying To Remove Timeout.', ephemeral: true });
      } else {
        await interaction.reply({ content: 'Error Trying To Remove Timeout.', ephemeral: true });
      }
    }
  }
};
