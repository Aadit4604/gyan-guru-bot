const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getQuestionById } = require('../utils/questionManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hint')
        .setDescription('Get a hint for the current practice question (-5 points penalty)'),
    async execute(interaction) {
        const activeQ = interaction.client.activeQuestions?.get?.(interaction.user.id);

        if (!activeQ) {
            const noQuestionEmbed = new EmbedBuilder()
                .setTitle('❌ No Active Question')
                .setDescription(
                    '**You don\'t have any active practice question!**\n\n' +
                    '═══════════════════════════\n' +
                    '💡 Use `/practice` to start a practice session first.\n' +
                    '═══════════════════════════'
                )
                .setColor(0xEF4444)
                .setThumbnail('https://em-content.zobj.net/thumbs/160/twitter/348/thinking-face_1f914.png');
            
            return interaction.reply({ embeds: [noQuestionEmbed], ephemeral: true });
        }

        if (activeQ.hintUsed) {
            const alreadyUsedEmbed = new EmbedBuilder()
                .setTitle('⚠️ Hint Already Used')
                .setDescription('You\'ve already used a hint for this question!')
                .setColor(0xF59E0B);
            
            return interaction.reply({ embeds: [alreadyUsedEmbed], ephemeral: true });
        }

        const question = getQuestionById(activeQ.questionId);
        activeQ.hintUsed = true; // Mark hint as used

        const hintEmbed = new EmbedBuilder()
            .setTitle('💡 Hint Revealed')
            .setDescription(
                '**Here\'s a hint to help you:**\n\n' +
                '═══════════════════════════\n\n' +
                `${question.hint || 'No hint available for this question.'}\n\n` +
                '═══════════════════════════\n\n' +
                '⚠️ **Note:** Your reward has been reduced from **10 points** to **5 points**'
            )
            .setColor(0xF59E0B)
            .setThumbnail('https://em-content.zobj.net/thumbs/160/twitter/348/light-bulb_1f4a1.png')
            .setFooter({ text: '💭 Use hints wisely to maximize your points!' })
            .setTimestamp();

        await interaction.reply({ embeds: [hintEmbed], ephemeral: true });
    },
};