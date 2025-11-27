const { Events } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.warn(`⚠️ No command matching ${interaction.commandName} was found.`);
            return await interaction.reply({ 
                content: '❌ This command no longer exists or is unavailable.',
                ephemeral: true 
            });
        }

        try {
            console.log(`📝 Command executed: ${interaction.commandName} by ${interaction.user.tag}`);
            await command.execute(interaction);
        } catch (error) {
            console.error(`❌ Error executing command ${interaction.commandName}:`, error);
            
            const errorMessage = {
                content: '❌ There was an error while executing this command. Please try again later.',
                ephemeral: true 
            };

            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(errorMessage);
            } else {
                await interaction.reply(errorMessage);
            }
        }
    },
};