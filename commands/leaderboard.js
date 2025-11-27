const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getLeaderboard } = require('../utils/points');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Show the top students'),
    async execute(interaction) {
        const topUsers = getLeaderboard();
        
        const embed = new EmbedBuilder()
            .setTitle('🏆 Class Leaderboard')
            .setColor(0xFCD34D)
            .setTimestamp();

        let description = "";
        
        for (let i = 0; i < topUsers.length; i++) {
            const [userId, stats] = topUsers[i];
            description += `**#${i + 1}** <@${userId}> — ${stats.points} Gyan Gola (Streak: ${stats.streak})\n`;
        }

        if (!description) description = "No data yet! Start practicing.";

        embed.setDescription(description);
        await interaction.reply({ embeds: [embed] });
    },
};