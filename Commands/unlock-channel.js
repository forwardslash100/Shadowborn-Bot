const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unlock-channel')
    .setDescription('Unlocks Current Channel')
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason For Unlocking Channel')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction) {
    const channel = interaction.channel;
    const reason = interaction.options.getString('reason') || 'No Reason Provided';

    try {
      await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
        SendMessages: true,
      });

      await interaction.reply({ content: `Unlocked: <#${channel.id}>.\nReason: ${reason}` });

      const logChannel = interaction.guild.channels.cache.find(ch => ch.name === 'command-logs');
      if (logChannel) {
        logChannel.send(`Channel: <#${channel.id}> Was Unlocked By: ${interaction.user.tag}. Reason: ${reason}`);
      }
    } catch (error) {
      console.error('Error Unlocking Channel:', error);
      await interaction.reply({ content: 'Error Trying To Unlock Channel.', ephemeral: true });
    }
  }
};
