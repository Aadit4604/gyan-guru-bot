const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getLeaderboard, getUserRank } = require('../utils/points');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('View the top 10 students on the leaderboard'),
    async execute(interaction) {
        const leaderboard = getLeaderboard();
        
        if (leaderboard.length === 0) {
            const embed = new EmbedBuilder()
                .setTitle('🏆 Class Leaderboard')
                .setDescription('📈 No data yet! Start practicing with `/practice` to earn gyan gola and climb the ranks!')
                .setColor(0xFCD34D)
                .setFooter({ text: 'Be the first to join the leaderboard!' });
            return await interaction.reply({ embeds: [embed] });
        }

        const embed = new EmbedBuilder()
            .setTitle('🏆 Class Leaderboard - Top 10 Students')
            .setColor(0xFCD34D)
            .setThumbnail(interaction.client.user.avatarURL())
            .setTimestamp()
            .setFooter({ 
                text: `Total Students: ${leaderboard.length} | Use /score to see your rank`,
                iconURL: interaction.client.user.avatarURL()
            });

        let description = "";
        
        for (let i = 0; i < leaderboard.length; i++) {
            const { userId, points, streak } = leaderboard[i];
            
            let medal = '';
            if (i === 0) medal = '🥇';
            else if (i === 1) medal = '🥈';
            else if (i === 2) medal = '🥉';
            else medal = `#${i + 1}`;
            
            const streakIcon = streak > 0 ? `🔥 ${streak}` : '❄️ 0';
            
            description += `${medal} <@${userId}> — **${points.toLocaleString()}** GP | ${streakIcon} Streak\n`;
        }

        embed.setDescription(description);
        
        // Add your rank information
        const userRank = getUserRank(interaction.user.id);
        if (userRank && userRank > 10) {
            embed.addFields({
                name: '📍 Your Position',
                value: `You are ranked #${userRank}`,
                inline: false
            });
        }

        await interaction.reply({ embeds: [embed] });
    },
};