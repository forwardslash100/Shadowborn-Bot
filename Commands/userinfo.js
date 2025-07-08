const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('View Info About A User')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User To Get Info About')
        .setRequired(true)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const member = interaction.guild.members.cache.get(user.id);

    if (!member) {
      return interaction.reply({ content: 'ERROR: User Not Found In The Server.', ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setTitle(`User Info: ${user.tag}`)
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: 'Username', value: user.username, inline: true },
        { name: 'User ID', value: user.id, inline: true },
        { name: 'Account Created', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:F>`, inline: false },
        { name: 'Joined Server', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>`, inline: false },
        {
          name: 'Roles',
          value: member.roles.cache
            .filter(role => role.id !== interaction.guild.id)
            .map(role => `<@&${role.id}>`)
            .join(', ') || 'None',
          inline: false
        }
      )
      .setColor('Blue')
      .setFooter({ text: `Requested by ${interaction.user.tag}` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
