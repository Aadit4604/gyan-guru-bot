const { Events, ActivityType } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        console.log('\n' + '='.repeat(50));
        console.log('✅ Bot Ready!');
        console.log('='.repeat(50));
        console.log(`🤖 Logged in as: ${client.user.tag}`);
        console.log(`📝 Loaded ${client.commands.size} slash commands`);
        console.log(`🔗 Invite link: https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=2147483647`);
        console.log('='.repeat(50) + '\n');
        
        // Set bot activity
        client.user.setActivity('/help for commands', { type: ActivityType.Watching });
    },
};