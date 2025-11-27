const { Events } = require('discord.js');
const { quizSessions, handleQuizAnswer, startQuiz } = require('../commands/quiz');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        // Handle slash commands
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) {
                console.warn(`⚠️ No command matching ${interaction.commandName} was found.`);
                return await interaction.reply({ 
                    content: '❌ This command no longer exists or is unavailable.',
                    ephemeral: true 
                });
            }

            try {
                console.log(`📝 Command executed: ${interaction.commandName} by ${interaction.user.tag}`);
                await command.execute(interaction);
            } catch (error) {
                console.error(`❌ Error executing command ${interaction.commandName}:`, error);
                
                const errorMessage = {
                    content: '❌ There was an error while executing this command. Please try again later.',
                    ephemeral: true 
                };

                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp(errorMessage);
                } else {
                    await interaction.reply(errorMessage);
                }
            }
        }

        // Handle quiz select menus and buttons
        if (interaction.isStringSelectMenu()) {
            if (interaction.customId === 'quiz_chapter_select') {
                const chapter = interaction.values[0];
                await interaction.deferReply();
                await startQuiz(interaction, { type: 'chapter', value: chapter });
            } else if (interaction.customId === 'quiz_subject_select') {
                const subject = interaction.values[0];
                await interaction.deferReply();
                await startQuiz(interaction, { type: 'subject', value: subject });
            } else if (interaction.customId === 'quiz_random_difficulty') {
                const difficulty = interaction.values[0];
                await interaction.deferReply();
                await startQuiz(interaction, { type: 'difficulty', value: difficulty });
            }
            return;
        }

        // Handle quiz answer buttons
        if (interaction.isButton()) {
            if (interaction.customId.startsWith('quiz_ans_')) {
                const answerIndex = parseInt(interaction.customId.split('_')[2]);
                await handleQuizAnswer(interaction, answerIndex);
            }
        }
    },
};