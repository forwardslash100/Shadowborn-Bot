const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('removerole')
    .setDescription('Remove A Role From A User')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User To Remove Role From')
        .setRequired(true))
    .addRoleOption(option =>
      option.setName('role')
        .setDescription('The Role To Remove')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason For Removing Role')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const member = interaction.guild.members.cache.get(user.id);
    const role = interaction.options.getRole('role');
    const reason = interaction.options.getString('reason') || 'No Reason Provided';

    if (!member) {
      return await interaction.reply({ content: 'ERROR: User Not Found In This Server.', ephemeral: true });
    }

    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageRoles)) {
      return await interaction.reply({ content: 'ERROR: Missing Permission To Manage Roles.', ephemeral: true });
    }

    if (interaction.member.roles.highest.position <= role.position) {
      return await interaction.reply({ content: 'ERROR: That Role Is Higher Than Your Highest Role.', ephemeral: true });
    }

    if (interaction.guild.members.me.roles.highest.position <= role.position) {
      return await interaction.reply({ content: 'ERROR: That Role Is Higher Than The Bot\'s Highest Role.', ephemeral: true });
    }

    try {
      await member.roles.remove(role, reason);
      await interaction.reply({ content: `Successfully Removed Role <@&${role.id}> From <@${user.id}>.\nReason: ${reason}` });

      const logChannel = interaction.guild.channels.cache.find(ch => ch.name === 'command-logs');
      if (logChannel) {
        logChannel.send(`Role: <@&${role.id}> Was Removed From <@${user.id}> By: ${interaction.user.tag}. Reason: ${reason}`);
      }
    } catch (error) {
      console.error('Error Removing Role:', error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: 'Error Trying To Remove Role.', ephemeral: true });
      } else {
        await interaction.reply({ content: 'Error Trying To Remove Role.', ephemeral: true });
      }
    }
  }
};
