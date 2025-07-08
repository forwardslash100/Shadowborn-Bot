const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lock-channel')
    .setDescription('Lock Current Channel')
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason For Locking Channel')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction) {
    const channel = interaction.channel;
    const reason = interaction.options.getString('reason') || 'No Reason Provided';

    try {
      await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
        SendMessages: false,
      });

      await interaction.reply({ content: `Locked: <#${channel.id}>.\nReason: ${reason}` });

      const logChannel = interaction.guild.channels.cache.find(ch => ch.name === 'command-logs');
      if (logChannel) {
        logChannel.send(`Channel: <#${channel.id}> Was Locked By: ${interaction.user.tag}. Reason: ${reason}`);
      }
    } catch (error) {
      console.error('Error Locking Channel:', error);
      await interaction.reply({ content: 'Error Trying To Lock This Channel.', ephemeral: true });
    }
  }
};
