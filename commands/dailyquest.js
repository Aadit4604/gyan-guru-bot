const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { updateStreak, addPoints, getStats } = require('../utils/points');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dailyquest')
        .setDescription('Claim your daily quest rewards'),
    async execute(interaction) {
        const streak = updateStreak(interaction.user.id);
        
        if (streak > 0) {
             addPoints(interaction.user.id, 20);
             
             const embed = new EmbedBuilder()
                .setTitle('📅 Daily Quest Completed!')
                .setDescription(`You checked in today!\n\n**+20 Gyan Gola**\n**+5 Streak Bonus**`)
                .addFields({ name: 'Current Streak', value: `${streak} Days 🔥` })
                .setColor(0xF59E0B);
                
             await interaction.reply({ embeds: [embed] });
        } else {
            const stats = getStats(interaction.user.id);
            await interaction.reply({ content: `You've already claimed your daily reward today! Current streak: ${stats.streak} 🔥`, ephemeral: true });
        }
    },
};