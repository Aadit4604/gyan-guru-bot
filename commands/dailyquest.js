const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { updateStreak, addPoints, getStats } = require('../utils/points');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dailyquest')
        .setDescription('Claim your daily quest rewards'),
    async execute(interaction) {
        const stats = getStats(interaction.user.id);
        const oldStreak = stats.streak;
        const streak = updateStreak(interaction.user.id);
        
        if (streak > oldStreak) {
             addPoints(interaction.user.id, 20);
             
             // Determine streak level and rewards
             let streakEmoji = '📅';
             let streakTitle = 'Daily Check-in';
             let bonusMessage = '';
             
             if (streak >= 30) {
                 streakEmoji = '💎';
                 streakTitle = 'Diamond Streak!';
                 bonusMessage = '\n🎁 **LEGENDARY!** Keep this up!';
             } else if (streak >= 14) {
                 streakEmoji = '⚡';
                 streakTitle = 'Epic Streak!';
                 bonusMessage = '\n⭐ **Amazing dedication!**';
             } else if (streak >= 7) {
                 streakEmoji = '🔥';
                 streakTitle = 'Week Streak!';
                 bonusMessage = '\n🎉 **One week milestone!**';
             } else if (streak >= 3) {
                 streakEmoji = '⭐';
                 streakTitle = 'Growing Streak!';
                 bonusMessage = '\n💪 **Keep it going!**';
             }
             
             const totalRewards = 20 + 5;
             const newTotal = stats.points + totalRewards;
             
             const embed = new EmbedBuilder()
                .setTitle(`${streakEmoji} ${streakTitle}`)
                .setDescription(
                    `**Daily Quest Completed!**\n` +
                    `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
                    `💰 **Base Reward:** +20 points\n` +
                    `🔥 **Streak Bonus:** +5 points\n` +
                    `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                    `✨ **Total Earned:** \`+${totalRewards}\` points\n` +
                    `💎 **New Balance:** \`${newTotal}\` points${bonusMessage}`
                )
                .addFields(
                    { name: '🔥 Current Streak', value: `\`\`\`${streak} Days\`\`\``, inline: true },
                    { name: '🎯 Next Milestone', value: `\`\`\`${getNextMilestone(streak)} Days\`\`\``, inline: true },
                    { name: '📅 Come Back', value: '\`\`\`Tomorrow\`\`\`', inline: true }
                )
                .setColor(getStreakColor(streak))
                .setThumbnail('https://em-content.zobj.net/thumbs/160/twitter/348/fire_1f525.png')
                .setFooter({ text: '💡 Don\'t break your streak! Come back tomorrow!' })
                .setTimestamp();
                
             await interaction.reply({ embeds: [embed] });
        } else {
            const nextClaimTime = new Date();
            nextClaimTime.setDate(nextClaimTime.getDate() + 1);
            nextClaimTime.setHours(0, 0, 0, 0);
            const timeUntil = Math.floor((nextClaimTime - new Date()) / 1000 / 60 / 60);
            
            const embed = new EmbedBuilder()
                .setTitle('⏰ Daily Quest Already Claimed!')
                .setDescription(
                    `You've already claimed your reward today!\n\n` +
                    `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                    `🔥 **Current Streak:** ${stats.streak} days\n` +
                    `⏱️ **Next Claim:** ~${timeUntil} hours\n` +
                    `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
                    `💡 Come back tomorrow to keep your streak alive!`
                )
                .setColor(0xEF4444)
                .setThumbnail('https://em-content.zobj.net/thumbs/160/twitter/348/alarm-clock_23f0.png')
                .setFooter({ text: 'Set a reminder so you don\'t forget!' });
            
            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    },
};

function getNextMilestone(streak) {
    const milestones = [3, 7, 14, 30, 60, 100];
    for (const milestone of milestones) {
        if (streak < milestone) return milestone;
    }
    return Math.ceil((streak + 1) / 10) * 10; // Next multiple of 10
}

function getStreakColor(streak) {
    if (streak >= 30) return 0x8B5CF6; // Purple
    if (streak >= 14) return 0xF59E0B; // Orange
    if (streak >= 7) return 0xEF4444; // Red
    if (streak >= 3) return 0x10B981; // Green
    return 0x3B82F6; // Blue
}