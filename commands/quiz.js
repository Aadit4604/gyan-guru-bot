const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } = require('discord.js');
const { getRandomQuestion } = require('../utils/questionManager');
const { addPoints, getScore } = require('../utils/points');
const fs = require('fs');

// Quiz sessions storage
const quizSessions = new Map();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('quiz')
        .setDescription('Start a themed quiz to test your knowledge')
        .addStringOption(option => 
            option.setName('mode')
                .setDescription('Choose quiz mode')
                .setRequired(true)
                .addChoices(
                    { name: '📚 Chapter Quiz', value: 'chapter' },
                    { name: '🎓 Subject Quiz', value: 'subject' },
                    { name: '🌟 Random Quiz', value: 'random' }
                )
        ),
    async execute(interaction) {
        const mode = interaction.options.getString('mode');
        
        if (mode === 'chapter') {
            return handleChapterQuiz(interaction);
        } else if (mode === 'subject') {
            return handleSubjectQuiz(interaction);
        } else if (mode === 'random') {
            return handleRandomQuiz(interaction);
        }
    },
};

async function handleChapterQuiz(interaction) {
    const chapters = JSON.parse(fs.readFileSync('./data/chapters.json', 'utf8'));
    
    const selectMenu = new StringSelectMenuBuilder()
        .setCustomId('quiz_chapter_select')
        .setPlaceholder('Choose a chapter...')
        .addOptions(
            chapters.map(chapter => ({
                label: chapter,
                value: chapter,
                description: `Quiz on ${chapter}`,
                emoji: '📖'
            }))
        );

    const row = new ActionRowBuilder().addComponents(selectMenu);

    const embed = new EmbedBuilder()
        .setTitle('📚 Chapter Quiz')
        .setDescription('Select a chapter to start your quiz!')
        .setColor(0x6366F1)
        .setAuthor({ name: '🎯 Quiz Mode' });

    await interaction.reply({ embeds: [embed], components: [row] });
}

async function handleSubjectQuiz(interaction) {
    const selectMenu = new StringSelectMenuBuilder()
        .setCustomId('quiz_subject_select')
        .setPlaceholder('Choose a subject...')
        .addOptions(
            { label: 'Science', value: 'Science', description: 'Questions from Science', emoji: '🔬' },
            { label: 'Mathematics', value: 'Mathematics', description: 'Questions from Mathematics', emoji: '🔢' },
            { label: 'History', value: 'History', description: 'Questions from History', emoji: '📜' }
        );

    const row = new ActionRowBuilder().addComponents(selectMenu);

    const embed = new EmbedBuilder()
        .setTitle('🎓 Subject Quiz')
        .setDescription('Select a subject to start your quiz!')
        .setColor(0x8B5CF6)
        .setAuthor({ name: '🎯 Quiz Mode' });

    await interaction.reply({ embeds: [embed], components: [row] });
}

async function handleRandomQuiz(interaction) {
    const selectMenu = new StringSelectMenuBuilder()
        .setCustomId('quiz_random_difficulty')
        .setPlaceholder('Choose difficulty level...')
        .addOptions(
            { label: 'Easy', value: 'Easy', description: 'Questions for beginners', emoji: '🟢' },
            { label: 'Medium', value: 'Medium', description: 'Mixed difficulty questions', emoji: '🟡' },
            { label: 'Hard', value: 'Hard', description: 'Challenging questions', emoji: '🔴' },
            { label: 'Mix All', value: 'all', description: 'All difficulty levels', emoji: '🌈' }
        );

    const row = new ActionRowBuilder().addComponents(selectMenu);

    const embed = new EmbedBuilder()
        .setTitle('🌟 Random Quiz')
        .setDescription('Select difficulty level for a random quiz!')
        .setColor(0xF59E0B)
        .setAuthor({ name: '🎯 Quiz Mode' });

    await interaction.reply({ embeds: [embed], components: [row] });
}

async function startQuiz(interaction, filter) {
    const userId = interaction.user.id;
    const questions = getQuestionsForQuiz(filter);

    if (questions.length === 0) {
        return interaction.reply({ 
            content: '❌ No questions found for your selection. Try another filter!', 
            ephemeral: true 
        });
    }

    // Limit to max 10 questions per quiz
    const quizQuestions = questions.slice(0, 10);

    quizSessions.set(userId, {
        questions: quizQuestions,
        currentIndex: 0,
        score: 0,
        correct: 0,
        wrong: 0,
        timeouts: 0,
        messageId: null
    });

    await showNextQuestion(interaction, userId);
}

async function showNextQuestion(interaction, userId) {
    const session = quizSessions.get(userId);
    if (!session) return;

    if (session.currentIndex >= session.questions.length) {
        return endQuiz(interaction, userId);
    }

    const question = session.questions[session.currentIndex];
    const progress = `${session.currentIndex + 1}/${session.questions.length}`;

    const embed = new EmbedBuilder()
        .setTitle(`📝 Quiz Question ${progress}`)
        .setDescription(`# **${question.question}**`)
        .addFields(
            { name: '\u200b', value: '\u200b' },
            { name: 'Chapter', value: question.chapter, inline: true },
            { name: 'Difficulty', value: question.difficulty, inline: true },
            { name: 'Subject', value: question.subject, inline: true }
        )
        .setColor(0x6366F1)
        .setFooter({ text: `Score: ${session.score} | Correct: ${session.correct} | Wrong: ${session.wrong}` });

    const buttons = question.options.map((opt, index) => 
        new ButtonBuilder()
            .setCustomId(`quiz_ans_${index}`)
            .setLabel(opt)
            .setStyle(ButtonStyle.Primary)
    );

    const row = new ActionRowBuilder().addComponents(buttons);
    try {
        await interaction.reply({ embeds: [embed], components: [row] });
    } catch (error) {
        console.error('Error sending quiz question:', error);
    }
}

async function handleQuizAnswer(interaction, userIndex) {
    const userId = interaction.user.id;
    const session = quizSessions.get(userId);

    if (!session) {
        return interaction.reply({ content: '❌ Quiz session not found!', ephemeral: true });
    }

    const question = session.questions[session.currentIndex];
    const isCorrect = userIndex === question.correctAnswer;

    if (isCorrect) {
        session.correct++;
        session.score += 10;
        await interaction.reply({ 
            content: `✅ **Correct!** (+10 points)\n💡 *${question.hint}*`, 
            ephemeral: true 
        });
    } else {
        session.wrong++;
        session.score += 0;
        await interaction.reply({ 
            content: `❌ **Wrong!** The correct answer was: **${question.options[question.correctAnswer]}**\n💡 *${question.hint}*`, 
            ephemeral: true 
        });
    }

    session.currentIndex++;
    await new Promise(resolve => setTimeout(resolve, 1500)); // 1.5 second delay before next question
    
    if (session.currentIndex >= session.questions.length) {
        return endQuiz(interaction, userId);
    }

    await showNextQuestion(interaction, userId);
}

function endQuiz(interaction, userId) {
    const session = quizSessions.get(userId);
    if (!session) return;

    const percentage = Math.round((session.correct / session.questions.length) * 100);
    let grade = '🔴 F';
    let bonus = 0;

    if (percentage >= 90) { grade = '🟢 A+'; bonus = 50; }
    else if (percentage >= 80) { grade = '🟢 A'; bonus = 40; }
    else if (percentage >= 70) { grade = '🟡 B'; bonus = 30; }
    else if (percentage >= 60) { grade = '🟡 C'; bonus = 20; }
    else if (percentage >= 50) { grade = '🟠 D'; bonus = 10; }

    const totalPoints = session.score + bonus;
    addPoints(userId, totalPoints);
    const userScore = getScore(userId);

    const embed = new EmbedBuilder()
        .setTitle('🏆 Quiz Completed!')
        .setDescription(`**${interaction.user.username}** finished the quiz!`)
        .addFields(
            { name: 'Score', value: `**${session.score}**`, inline: true },
            { name: 'Bonus', value: `**+${bonus}**`, inline: true },
            { name: 'Total', value: `**${totalPoints}**`, inline: true },
            { name: '\u200b', value: '\u200b' },
            { name: 'Correct Answers', value: `**${session.correct}**/${session.questions.length}`, inline: true },
            { name: 'Score Percentage', value: `**${percentage}%**`, inline: true },
            { name: 'Grade', value: `**${grade}**`, inline: true },
            { name: '\u200b', value: '\u200b' },
            { name: 'Total Gyan Gola', value: `**${userScore}** 💛`, inline: false }
        )
        .setColor(0x10B981)
        .setThumbnail(interaction.user.displayAvatarURL());

    interaction.channel.send({ embeds: [embed] });
    quizSessions.delete(userId);
}

function getQuestionsForQuiz(filter) {
    const questions = JSON.parse(fs.readFileSync('./data/questions.json', 'utf8'));
    
    if (filter.type === 'chapter') {
        return questions.filter(q => q.chapter === filter.value);
    } else if (filter.type === 'subject') {
        return questions.filter(q => q.subject === filter.value);
    } else if (filter.type === 'difficulty') {
        if (filter.value === 'all') return questions;
        return questions.filter(q => q.difficulty === filter.value);
    }
    return questions;
}

// Export for interaction handler
module.exports.quizSessions = quizSessions;
module.exports.handleQuizAnswer = handleQuizAnswer;
module.exports.startQuiz = startQuiz;