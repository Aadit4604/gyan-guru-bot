const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { getRandomQuestion } = require('../utils/questionManager');
const { addPoints } = require('../utils/points');

// Temporary storage for active questions (In production, use a database or cache)
const activeQuestions = new Map();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('practice')
        .setDescription('Practice a question from a specific chapter or random')
        .addStringOption(option => 
            option.setName('chapter')
            .setDescription('Specific chapter name (optional)')
            .setRequired(false)),
    async execute(interaction) {
        const chapter = interaction.options.getString('chapter');
        const question = getRandomQuestion(chapter);

        if (!question) {
            const errorEmbed = new EmbedBuilder()
                .setTitle('❌ No Questions Found')
                .setDescription(`No questions available for: **${chapter || 'Random'}**\n\nTry a different chapter or leave it blank for random questions.`)
                .setColor(0xEF4444);
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        // Store active question for this user and on client
        activeQuestions.set(interaction.user.id, { 
            questionId: question.id, 
            correct: question.correctAnswer,
            hintUsed: false 
        });
        
        if (!interaction.client.activeQuestions) {
            interaction.client.activeQuestions = activeQuestions;
        }

        // Difficulty colors and emojis
        const difficultyConfig = {
            'Easy': { color: 0x10B981, emoji: '🜢' },
            'Medium': { color: 0xF59E0B, emoji: '🜡' },
            'Hard': { color: 0xEF4444, emoji: '🜠' }
        };
        
        const config = difficultyConfig[question.difficulty] || { color: 0x6366F1, emoji: '❓' };

        const embed = new EmbedBuilder()
            .setAuthor({ 
                name: `${interaction.user.username}'s Practice Session`,
                iconURL: interaction.user.displayAvatarURL()
            })
            .setTitle(`${config.emoji} ${question.subject} Practice`)
            .setDescription(
                `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
                `**${question.question}**\n\n` +
                `━━━━━━━━━━━━━━━━━━━━━━━━━━━`
            )
            .addFields(
                { name: '📚 Chapter', value: `\`${question.chapter}\``, inline: true },
                { name: `${config.emoji} Difficulty`, value: `\`${question.difficulty}\``, inline: true },
                { name: '⏱️ Time Limit', value: '\`60 seconds\`', inline: true }
            )
            .setColor(config.color)
            .setFooter({ text: '💡 Use /hint if you need help • Select your answer below' })
            .setTimestamp();

        const buttons = question.options.map((opt, index) => {
            const letters = ['A', 'B', 'C', 'D'];
            return new ButtonBuilder()
                .setCustomId(`practice_ans_${index}`)
                .setLabel(`${letters[index]}. ${opt.length > 50 ? opt.substring(0, 47) + '...' : opt}`)
                .setStyle(ButtonStyle.Primary);
        });

        const row = new ActionRowBuilder().addComponents(buttons);

        const response = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true });

        // Collector for answers
        const collector = response.createMessageComponentCollector({ 
            filter: i => i.user.id === interaction.user.id, 
            time: 60000 
        });

        collector.on('collect', async i => {
            const selectedIdx = parseInt(i.customId.split('_')[2]);
            const activeQ = activeQuestions.get(i.user.id);
            
            if (selectedIdx === activeQ.correct) {
                const points = activeQ.hintUsed ? 5 : 10;
                const newTotal = addPoints(i.user.id, points);
                
                const successEmbed = new EmbedBuilder()
                    .setTitle('✅ Correct Answer!')
                    .setDescription(
                        `**Great job!** You got it right!\n\n` +
                        `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                        `💰 **Points Earned:** +${points}\n` +
                        `🏆 **New Balance:** ${newTotal} points\n` +
                        `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
                        (activeQ.hintUsed ? '💡 *Hint was used, so you earned 5 points instead of 10*' : '⭐ *Perfect! Full points earned!*')
                    )
                    .setColor(0x10B981)
                    .setThumbnail('https://em-content.zobj.net/thumbs/160/twitter/348/party-popper_1f389.png')
                    .setFooter({ text: '📚 Keep practicing to earn more points!' });
                
                await i.update({ embeds: [successEmbed], components: [] });
            } else {
                const wrongEmbed = new EmbedBuilder()
                    .setTitle('❌ Wrong Answer')
                    .setDescription(
                        `**Not quite right!** Don't worry, keep practicing!\n\n` +
                        `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                        `**✅ Correct Answer:** ${question.options[activeQ.correct]}\n` +
                        `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
                        `💡 **Hint:** ${question.hint || 'No hint available'}\n\n` +
                        `Use \`/practice\` to try another question!`
                    )
                    .setColor(0xEF4444)
                    .setThumbnail('https://em-content.zobj.net/thumbs/160/twitter/348/cross-mark_274c.png')
                    .setFooter({ text: 'Learn from mistakes and try again!' });
                
                await i.update({ embeds: [wrongEmbed], components: [] });
            }
            activeQuestions.delete(i.user.id);
            collector.stop();
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                activeQuestions.delete(interaction.user.id);
                
                const timeoutEmbed = new EmbedBuilder()
                    .setTitle('⏰ Time\'s Up!')
                    .setDescription(
                        `**Time ran out!**\n\n` +
                        `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                        `**✅ Correct Answer:** ${question.options[question.correctAnswer]}\n` +
                        `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
                        `Try again with \`/practice\`!`
                    )
                    .setColor(0xF59E0B);
                    
                interaction.editReply({ embeds: [timeoutEmbed], components: [] }).catch(() => {});
            }
        });
    },
};