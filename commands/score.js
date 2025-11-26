const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getStats, getLeaderboard } = require('../utils/points');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('score')
        .setDescription('Check your current progress'),
    async execute(interaction) {
        const stats = getStats(interaction.user.id);
        const leaderboard = getLeaderboard();
        
        // Calculate rank
        const rank = leaderboard.findIndex(([id]) => id === interaction.user.id) + 1;
        const totalUsers = leaderboard.length;
        
        // Get streak emoji
        let streakEmoji = '📅';
        if (stats.streak >= 7) streakEmoji = '🔥';
        if (stats.streak >= 14) streakEmoji = '⚡';
        if (stats.streak >= 30) streakEmoji = '💎';
        
        // Progress bar for next rank
        const nextRankPoints = leaderboard[rank - 2] ? leaderboard[rank - 2][1].points : stats.points + 100;
        const pointsToNext = Math.max(0, nextRankPoints - stats.points);
        const progressPercent = rank === 1 ? 100 : Math.min(100, Math.floor((stats.points / nextRankPoints) * 100));
        const progressBar = createProgressBar(progressPercent);
        
        const embed = new EmbedBuilder()
            .setAuthor({ 
                name: `${interaction.user.username}'s Progress Report`,
                iconURL: interaction.user.displayAvatarURL()
            })
            .setTitle('📊 Student Statistics')
            .setDescription(
                `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                `**Total Points:** \`${stats.points}\` 💰\n` +
                `**Current Streak:** \`${stats.streak}\` days ${streakEmoji}\n` +
                `**Class Rank:** \`#${rank || 'Unranked'}\` / ${totalUsers}\n` +
                `━━━━━━━━━━━━━━━━━━━━━━━━━━━`
            )
            .setColor(getRankColor(rank))
            .addFields(
                { 
                    name: '🏆 Ranking Progress', 
                    value: rank === 1 
                        ? `${progressBar} 100%\n🎉 **You're #1! Keep it up!**`
                        : `${progressBar} ${progressPercent}%\n📈 **${pointsToNext} points** to rank #${rank - 1}`,
                    inline: false 
                },
                { 
                    name: '📈 Statistics', 
                    value: `\`\`\`\nQuests Completed: ${stats.questsCompleted || 0}\nBest Streak: ${stats.streak} days\nStatus: ${getStudentStatus(stats.points)}\`\`\``, 
                    inline: false 
                }
            )
            .setThumbnail(getRankBadge(rank))
            .setFooter({ text: `💡 Use /dailyquest to maintain your streak!` })
            .setTimestamp();
            
        await interaction.reply({ embeds: [embed] });
    },
};

function createProgressBar(percent) {
    const filled = Math.floor(percent / 10);
    const empty = 10 - filled;
    return '█'.repeat(filled) + '░'.repeat(empty);
}

function getRankColor(rank) {
    if (rank === 1) return 0xFFD700; // Gold
    if (rank === 2) return 0xC0C0C0; // Silver
    if (rank === 3) return 0xCD7F32; // Bronze
    if (rank <= 10) return 0x8B5CF6; // Purple
    return 0x6B7280; // Gray
}

function getRankBadge(rank) {
    if (rank === 1) return 'https://em-content.zobj.net/thumbs/160/twitter/348/1st-place-medal_1f947.png';
    if (rank === 2) return 'https://em-content.zobj.net/thumbs/160/twitter/348/2nd-place-medal_1f948.png';
    if (rank === 3) return 'https://em-content.zobj.net/thumbs/160/twitter/348/3rd-place-medal_1f949.png';
    return 'https://em-content.zobj.net/thumbs/160/twitter/348/sports-medal_1f3c5.png';
}

function getStudentStatus(points) {
    if (points >= 1000) return '🌟 Master Scholar';
    if (points >= 500) return '📚 Advanced Student';
    if (points >= 250) return '✏️ Dedicated Learner';
    if (points >= 100) return '📖 Active Student';
    return '🌱 Beginner';
}