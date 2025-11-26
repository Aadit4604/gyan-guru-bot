const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getStats } = require('../utils/points');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('score')
        .setDescription('Check your current progress'),
    async execute(interaction) {
        const stats = getStats(interaction.user.id);
        
        const embed = new EmbedBuilder()
            .setTitle(`📊 Progress for ${interaction.user.username}`)
            .addFields(
                { name: 'Points', value: `${stats.points}`, inline: true },
                { name: 'Streak', value: `${stats.streak} Days`, inline: true },
                { name: 'Rank', value: 'Check /leaderboard', inline: true }
            )
            .setColor(0x8B5CF6);
            
        await interaction.reply({ embeds: [embed] });
    },
};