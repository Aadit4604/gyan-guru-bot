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
            return interaction.reply({ content: `No questions found for chapter: ${chapter || 'Random'}`, ephemeral: true });
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

        const embed = new EmbedBuilder()
            .setTitle(`📝 Practice: ${question.subject}`)
            .setDescription(`**${question.question}**`)
            .addFields({ name: 'Chapter', value: question.chapter, inline: true })
            .addFields({ name: 'Difficulty', value: question.difficulty, inline: true })
            .setColor(0x6366F1);

        const buttons = question.options.map((opt, index) => 
            new ButtonBuilder()
                .setCustomId(`practice_ans_${index}`)
                .setLabel(opt)
                .setStyle(ButtonStyle.Primary)
        );

        const row = new ActionRowBuilder().addComponents(buttons);

        const response = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true });

        // Collector for answers
        const collector = response.createMessageComponentCollector({ filter: i => i.user.id === interaction.user.id, time: 60000 });

        collector.on('collect', async i => {
            const selectedIdx = parseInt(i.customId.split('_')[2]);
            const activeQ = activeQuestions.get(i.user.id);
            
            if (selectedIdx === activeQ.correct) {
                const points = activeQ.hintUsed ? 5 : 10;
                addPoints(i.user.id, points);
                await i.update({ content: `✅ **Correct!** You earned **${points} points**.`, components: [], embeds: [] });
            } else {
                await i.update({ content: `❌ **Wrong!** The correct answer was: ${question.options[activeQ.correct]}`, components: [], embeds: [] });
            }
            activeQuestions.delete(i.user.id);
            collector.stop();
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                activeQuestions.delete(interaction.user.id);
                interaction.editReply({ content: '⏰ Time up!', components: [] });
            }
        });
    },
};