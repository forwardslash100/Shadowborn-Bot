module.exports = {
  name: 'interactionCreate',

  async execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
      await command.execute(interaction, client);
    } catch (error) {
      console.error(`Error Executing Command '${interaction.commandName}':`, error);

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: 'Error While Executing This Command.', ephemeral: true });
      } else {
        await interaction.reply({ content: 'Error While Executing This Command.', ephemeral: true });
      }
    }
  }
};
