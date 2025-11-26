const { Events } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        console.log(`✅ Ready! Logged in as ${client.user.tag}`);
        console.log(`📝 Loaded ${client.commands.size} slash commands`);
        
        client.user.setActivity('/help for commands!');
    },
};