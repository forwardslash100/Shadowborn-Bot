const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban A User From Shadowborn')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The User To Ban')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason For The Ban')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('duration')
        .setDescription('Ban Duration')
        .setRequired(true)),

  async execute(interaction) {
    const target = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason');
    const duration = interaction.options.getString('duration');
    const member = await interaction.guild.members.fetch(target.id).catch(() => null);

    if (!member) {
      return interaction.reply({ content: 'Error: User Not In The Server.', ephemeral: true });
    }

    if (!member.bannable) {
      return interaction.reply({ content: 'Error: 404', ephemeral: true });
    }

    await member.ban({ reason });

    await interaction.reply({
      content: `Successfully Banned: ${target.tag} For **${duration}**.\nReason: ${reason}`,
      ephemeral: false
    });

    const logChannel = interaction.guild.channels.cache.find(ch => ch.name === 'timeouts-and-bans');
    if (logChannel) {
      const logEmbed = new EmbedBuilder()
        .setTitle('User Banned')
        .addFields(
          { name: 'User', value: `${target.tag} (${target.id})` },
          { name: 'Reason', value: reason },
          { name: 'Duration', value: duration }
        )
        .setColor(0xff0000)
        .setTimestamp()
        .setFooter({ text: `Banned By: ${interaction.user.tag}` });

      logChannel.send({ embeds: [logEmbed] });
    }
  }
};
