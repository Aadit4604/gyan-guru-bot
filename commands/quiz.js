const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('quiz')
        .setDescription('Start a rapid-fire quiz (Coming Soon)'),
    async execute(interaction) {
        await interaction.reply("🚧 **Quiz Mode** is under construction! Try `/practice` or `/match` for now.");
    },
};