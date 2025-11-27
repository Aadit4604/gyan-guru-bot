const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getStats, getUserRank, getTotalUsers } = require('../utils/points');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('score')
        .setDescription('Check your current progress and ranking'),
    async execute(interaction) {
        const userId = interaction.user.id;
        const stats = getStats(userId);
        const rank = getUserRank(userId);
        const totalUsers = getTotalUsers();

        // Create progress bar
        const createProgressBar = (current, max) => {
            const percentage = Math.min((current / max) * 100, 100);
            const filled = Math.floor(percentage / 10);
            const empty = 10 - filled;
            return `${'█'.repeat(filled)}${'░'.repeat(empty)} ${percentage.toFixed(0)}%`;
        };

        // Rank color based on position
        let rankColor = '🥇';
        if (rank === 2) rankColor = '🥈';
        else if (rank === 3) rankColor = '🥉';
        else if (rank > 3 && rank <= 10) rankColor = '⭐';
        else rankColor = '📍';

        const embed = new EmbedBuilder()
            .setTitle(`📊 ${interaction.user.username}'s Progress`)
            .setColor(0x8B5CF6)
            .setThumbnail(interaction.user.avatarURL())
            .addFields(
                {
                    name: '💰 Gyan Gola',
                    value: `\`\`\`${stats.points.toLocaleString()}\`\`\``,
                    inline: true
                },
                {
                    name: '🔥 Current Streak',
                    value: `\`\`\`${stats.streak} days\`\`\``,
                    inline: true
                },
                {
                    name: `${rankColor} Rank`,
                    value: `\`\`\`${rank ? `#${rank}/${totalUsers}` : 'Unranked'}\`\`\``,
                    inline: true
                },
                {
                    name: '📈 Stats Summary',
                    value: `🎯 Quests Completed: **${stats.questsCompleted}**\n` +
                        `📅 Last Daily: **${stats.lastDaily || 'Never'}**`,
                    inline: false
                },
                {
                    name: '✨ Next Milestone',
                    value: `Current: ${stats.points} | Next Goal: ${Math.ceil((stats.points + 1) / 100) * 100}\n` +
                        createProgressBar(stats.points % 100, 100),
                    inline: false
                }
            )
            .setFooter({
                text: '💡 Use /help to see all commands',
                iconURL: interaction.client.user.avatarURL()
            })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};