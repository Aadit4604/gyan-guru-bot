const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } = require('discord.js');
const { getRandomQuestion } = require('../utils/questionManager');
const { addPoints } = require('../utils/points');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('match')
        .setDescription('Challenge a friend to a knowledge duel')
        .addUserOption(option => 
            option.setName('opponent')
                .setDescription('The user to challenge')
                .setRequired(true)),
    async execute(interaction) {
        const opponent = interaction.options.getUser('opponent');
        
        // Validation
        if (opponent.id === interaction.user.id) {
            return interaction.reply({ content: "❌ You can't challenge yourself!", ephemeral: true });
        }
        if (opponent.bot) {
            return interaction.reply({ content: "❌ You can't challenge a bot!", ephemeral: true });
        }

        // Select match duration
        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('match_duration')
            .setPlaceholder('Choose number of questions...')
            .addOptions(
                {
                    label: '5 Questions',
                    value: '5',
                    description: 'Quick match - 5 questions',
                    emoji: '⚡'
                },
                {
                    label: '10 Questions',
                    value: '10',
                    description: 'Standard match - 10 questions',
                    emoji: '🎯'
                },
                {
                    label: '15 Questions',
                    value: '15',
                    description: 'Extended match - 15 questions',
                    emoji: '📚'
                },
                {
                    label: '20 Questions',
                    value: '20',
                    description: 'Epic match - 20 questions',
                    emoji: '🏆'
                }
            );

        const row = new ActionRowBuilder().addComponents(selectMenu);

        const challengeMsg = await interaction.reply({ 
            content: `⚔️ **${interaction.user.username}** has challenged **${opponent.username}** to a RAPID-FIRE PvP match!\n\n${opponent}, select the match duration:`, 
            components: [row],
            fetchReply: true 
        });

        try {
            const durationSelection = await challengeMsg.awaitMessageComponent({ 
                filter: i => i.user.id === opponent.id && i.customId === 'match_duration', 
                time: 30000 
            });

            const questionCount = parseInt(durationSelection.values[0]);
            
            await durationSelection.update({ 
                content: `🚀 **RAPID-FIRE MATCH STARTING!**\n${interaction.user.username} vs ${opponent.username}\n📝 ${questionCount} Questions • First Answer Wins!\n\nLoading first question...`, 
                components: [] 
            });

            // Initialize scores
            let scores = {
                [interaction.user.id]: { correct: 0, wrong: 0, user: interaction.user },
                [opponent.id]: { correct: 0, wrong: 0, user: opponent }
            };

            let currentQuestion = 1;

            // Play multiple questions in rapid-fire mode
            for (let q = 0; q < questionCount; q++) {
                currentQuestion = q + 1;
                const question = await getRandomQuestion(null, interaction.user.id);

                if (!question) {
                    await interaction.followUp('❌ Could not load questions. Please try again.');
                    return;
                }

                // Highlight question with bright colors
                const qEmbed = new EmbedBuilder()
                    .setTitle(`🎯 QUESTION ${currentQuestion}/${questionCount}`)
                    .setDescription(`# **${question.question}**`)
                    .setColor(0xFF1744) // Bright red for visibility
                    .addFields({
                        name: `⚡ RAPID-FIRE MODE - FIRST ANSWER WINS!`,
                        value: `${interaction.user.username}: ${scores[interaction.user.id].correct}✓ ${scores[interaction.user.id].wrong}✗ | ${opponent.username}: ${scores[opponent.id].correct}✓ ${scores[opponent.id].wrong}✗`,
                        inline: false
                    },
                    {
                        name: '⏱️ Time Limit',
                        value: '20 seconds to answer',
                        inline: false
                    })
                    .setFooter({ text: '⚡ Whoever answers first wins the point!' })
                    .setTimestamp();

                const options = question.options.map((opt, i) => 
                    new ButtonBuilder()
                        .setCustomId(`duel_${i}`)
                        .setLabel(`${['A', 'B', 'C', 'D'][i]}: ${opt}`)
                        .setStyle(ButtonStyle.Danger) // Red buttons for visibility
                );
                const qRow = new ActionRowBuilder().addComponents(options);

                const duelMsg = await interaction.followUp({ embeds: [qEmbed], components: [qRow] });

                const collector = duelMsg.createMessageComponentCollector({ 
                    filter: i => [interaction.user.id, opponent.id].includes(i.user.id), 
                    time: 20000
                });

                let roundWinner = null;
                let answered = new Set();
                let wrongAnswers = {}; // Store wrong answers without revealing them

                await new Promise((resolve) => {
                    collector.on('collect', async (i) => {
                        if (answered.has(i.user.id)) {
                            await i.reply({ content: '⚠️ You already answered this question!', ephemeral: true });
                            return;
                        }

                        answered.add(i.user.id);
                        const choice = parseInt(i.customId.split('_')[1]);

                        if (choice === question.correctAnswer) {
                            // Correct answer - player wins the point
                            if (!roundWinner) {
                                roundWinner = i.user;
                                scores[i.user.id].correct++;
                                await i.reply({ 
                                    content: `🎉 **${i.user.username}** answered FIRST and is CORRECT! +1 Point!`, 
                                    ephemeral: false 
                                });
                                collector.stop();
                            }
                        } else {
                            // Wrong answer - don't reveal answer, just acknowledge
                            scores[i.user.id].wrong++;
                            wrongAnswers[i.user.id] = choice; // Store for later
                            await i.reply({ 
                                content: `❌ **${i.user.username}** answered, but that's not correct!`, 
                                ephemeral: false 
                            });
                            
                            // If other player hasn't answered, they can still win
                            const otherUserId = i.user.id === interaction.user.id ? opponent.id : interaction.user.id;
                            if (!answered.has(otherUserId) && !roundWinner) {
                                // Wait for other player or timeout
                            }
                        }
                    });

                    collector.on('end', () => {
                        resolve();
                    });
                });

                // Reveal the correct answer at the end of the round
                if (!roundWinner) {
                    await interaction.followUp({ 
                        content: `⏰ **Time's up!**\n✅ Correct answer: **${['A', 'B', 'C', 'D'][question.correctAnswer]}) ${question.options[question.correctAnswer]}**\n💡 Hint: ${question.hint}` 
                    });
                }

                // Add delay between questions
                if (q < questionCount - 1) {
                    await new Promise(r => setTimeout(r, 2000));
                }
            }

            // Calculate final results
            const player1Correct = scores[interaction.user.id].correct;
            const player1Wrong = scores[interaction.user.id].wrong;
            const player2Correct = scores[opponent.id].correct;
            const player2Wrong = scores[opponent.id].wrong;

            let resultContent = '';
            let winner = null;

            if (player1Correct > player2Correct) {
                winner = interaction.user;
                resultContent = `🏆 **${interaction.user.username}** wins the rapid-fire match!`;
            } else if (player2Correct > player1Correct) {
                winner = opponent;
                resultContent = `🏆 **${opponent.username}** wins the rapid-fire match!`;
            } else {
                resultContent = `🤝 **It's a tie!** Both players got the same score.`;
            }

            // Calculate points based on performance
            let pointsAwarded = {
                [interaction.user.id]: 0,
                [opponent.id]: 0
            };

            if (winner) {
                // Winner: 3 points per correct + 1 bonus per question
                const winnerPoints = (player1Correct > player2Correct ? player1Correct : player2Correct) * 3 + questionCount;
                // Loser: 2 points per correct (participation)
                const loserPoints = (player1Correct > player2Correct ? player2Correct : player1Correct) * 2;
                
                addPoints(winner.id, winnerPoints);
                pointsAwarded[winner.id] = winnerPoints;
                
                const loserId = winner.id === interaction.user.id ? opponent.id : interaction.user.id;
                addPoints(loserId, loserPoints);
                pointsAwarded[loserId] = loserPoints;
            } else {
                // Tie: Both get equal points
                const tiePoints = player1Correct * 2 + Math.floor(questionCount * 0.5);
                addPoints(interaction.user.id, tiePoints);
                addPoints(opponent.id, tiePoints);
                pointsAwarded[interaction.user.id] = tiePoints;
                pointsAwarded[opponent.id] = tiePoints;
            }

            // Penalty system: -5 gyan gola per wrong answer (minimum 0)
            const penalty1 = Math.min(player1Wrong * 5, 0);
            const penalty2 = Math.min(player2Wrong * 5, 0);
            
            if (penalty1 < 0) {
                addPoints(interaction.user.id, penalty1);
                pointsAwarded[interaction.user.id] += penalty1;
            }
            if (penalty2 < 0) {
                addPoints(opponent.id, penalty2);
                pointsAwarded[opponent.id] += penalty2;
            }

            const resultEmbed = new EmbedBuilder()
                .setTitle('⚡ RAPID-FIRE MATCH COMPLETE!')
                .setColor(winner ? 0x00E676 : 0xFFD600)
                .addFields(
                    {
                        name: '🎯 Final Score',
                        value: `**${interaction.user.username}**: ${player1Correct}/${questionCount} Correct\n**${opponent.username}**: ${player2Correct}/${questionCount} Correct`,
                        inline: false
                    },
                    {
                        name: '⚡ Accuracy & Penalties',
                        value: `**${interaction.user.username}**: ${Math.round((player1Correct/questionCount)*100)}% | Wrong: ${player1Wrong} (${player1Wrong * 5} GP penalty)\n**${opponent.username}**: ${Math.round((player2Correct/questionCount)*100)}% | Wrong: ${player2Wrong} (${player2Wrong * 5} GP penalty)`,
                        inline: false
                    },
                    {
                        name: '💰 Gyan Gola Awarded',
                        value: `**${interaction.user.username}**: +${pointsAwarded[interaction.user.id]} GP\n**${opponent.username}**: +${pointsAwarded[opponent.id]} GP`,
                        inline: false
                    },
                    {
                        name: '🏆 Match Result',
                        value: resultContent,
                        inline: false
                    }
                )
                .setFooter({ text: '⚡ Rapid-fire mode: First answer wins! Wrong answers = -5 GP penalty!' })
                .setTimestamp();

            await interaction.followUp({ embeds: [resultEmbed] });

        } catch (e) {
            await interaction.editReply({ content: '❌ Challenge expired or declined.', components: [] });
        }
    },
};