module.exports = {
  name: 'ready',
  once: true,

  execute(client) {
    console.log(`Bot Launched As Username: ${client.user.tag}`);
  }
};
