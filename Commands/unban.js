const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Unban A User From Shadowborn')
    .addStringOption(option =>
      option.setName('userid')
        .setDescription('The ID Of The User')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason For Unban')
        .setRequired(false)),

  async execute(interaction) {
    const userId = interaction.options.getString('userid');
    const reason = interaction.options.getString('reason') || 'No Reason Provided';

    try {
      const bans = await interaction.guild.bans.fetch();
      const bannedUser = bans.get(userId);

      if (!bannedUser) {
        return await interaction.reply({ content: `ERROR: User With ID: ${userId} Is Not Banned.`, ephemeral: true });
      }

      await interaction.guild.bans.remove(userId, reason);
      await interaction.reply({ content: `Successfully Unbanned <@${userId}>.\nReason: ${reason}` });

      const logChannel = interaction.guild.channels.cache.find(ch => ch.name === 'timeouts-and-bans');
      if (logChannel) {
        logChannel.send(`User: <@${userId}> Was Unbanned By: ${interaction.user.tag}. Reason: ${reason}`);
      }
    } catch (error) {
      console.error('Error Unbanning User:', error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: 'Error Trying To Unban That User.', ephemeral: true });
      } else {
        await interaction.reply({ content: 'Error Trying To Unban That User.', ephemeral: true });
      }
    }
  }
};
