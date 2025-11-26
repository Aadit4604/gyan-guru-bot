const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getLeaderboard } = require('../utils/points');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Show the top students'),
    async execute(interaction) {
        const topUsers = getLeaderboard();
        
        if (topUsers.length === 0) {
            const emptyEmbed = new EmbedBuilder()
                .setTitle('🏆 Class Leaderboard')
                .setDescription('📝 **No rankings yet!**\n\nBe the first to start practicing and claim the top spot!\n\nUse `/practice` to begin earning points.')
                .setColor(0xFCD34D)
                .setThumbnail('https://em-content.zobj.net/thumbs/160/twitter/348/trophy_1f3c6.png');
            return interaction.reply({ embeds: [emptyEmbed] });
        }
        
        const embed = new EmbedBuilder()
            .setTitle('🏆 Class Leaderboard')
            .setDescription('**Top 10 Students of the Month**\n━━━━━━━━━━━━━━━━━━━━━━━━━━━')
            .setColor(0xFCD34D)
            .setThumbnail('https://em-content.zobj.net/thumbs/160/twitter/348/trophy_1f3c6.png')
            .setTimestamp()
            .setFooter({ text: 'Keep studying to climb the ranks! 📚' });

        let description = "\n";
        const medals = ['🥇', '🥈', '🥉'];
        
        for (let i = 0; i < Math.min(10, topUsers.length); i++) {
            const [userId, stats] = topUsers[i];
            const medal = medals[i] || `\`#${i + 1}\``;
            const streakEmoji = stats.streak >= 7 ? '🔥' : '📅';
            
            // Create a progress bar for visual appeal
            const maxPoints = topUsers[0][1].points;
            const barLength = Math.floor((stats.points / maxPoints) * 15);
            const bar = '▰'.repeat(barLength) + '▱'.repeat(15 - barLength);
            
            description += `${medal} <@${userId}>\n`;
            description += `    💰 **${stats.points}** pts  ${streakEmoji} **${stats.streak}** days\n`;
            description += `    ${bar}\n\n`;
        }

        embed.addFields({ name: '\u200B', value: description, inline: false });
        
        // Add user's rank if not in top 10
        const userRank = topUsers.findIndex(([id]) => id === interaction.user.id) + 1;
        if (userRank > 10) {
            const userStats = topUsers[userRank - 1][1];
            embed.addFields({
                name: '📊 Your Rank',
                value: `\`#${userRank}\` • ${userStats.points} pts • ${userStats.streak} day streak\n*Keep practicing to reach the top 10!*`,
                inline: false
            });
        } else if (userRank > 0) {
            embed.setAuthor({ 
                name: `You are ranked #${userRank}!`,
                iconURL: interaction.user.displayAvatarURL()
            });
        }
        
        await interaction.reply({ embeds: [embed] });
    },
};