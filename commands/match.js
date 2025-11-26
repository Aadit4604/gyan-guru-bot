const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
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
        
        if (opponent.id === interaction.user.id) {
            return interaction.reply({ content: "You can't challenge yourself! 🤦\u200d♂️", ephemeral: true });
        }
        if (opponent.bot) {
            return interaction.reply({ content: "You can't challenge a bot! 🤖", ephemeral: true });
        }

        const challengeEmbed = new EmbedBuilder()
            .setTitle('⚔️ PVP DUEL CHALLENGE!')
            .setDescription(
                `**${opponent}, you have been challenged!**\n\n` +
                `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                `🎯 **Challenger:** ${interaction.user}\n` +
                `🎯 **Opponent:** ${opponent}\n` +
                `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
                `🏆 **Prize:** +30 points for the winner!\n` +
                `⏱️ **Time Limit:** 30 seconds to accept\n\n` +
                `Will you accept this challenge?`
            )
            .setColor(0xEF4444)
            .setThumbnail('https://em-content.zobj.net/thumbs/160/twitter/348/crossed-swords_2694-fe0f.png')
            .setFooter({ text: 'First to answer correctly wins!' });

        const acceptButton = new ButtonBuilder()
            .setCustomId('accept_match')
            .setLabel('✅ Accept Challenge')
            .setStyle(ButtonStyle.Success);
        
        const declineButton = new ButtonBuilder()
            .setCustomId('decline_match')
            .setLabel('❌ Decline')
            .setStyle(ButtonStyle.Danger);
            
        const row = new ActionRowBuilder().addComponents(acceptButton, declineButton);

        const challengeMsg = await interaction.reply({ 
            embeds: [challengeEmbed],
            components: [row],
            fetchReply: true 
        });

        try {
            const confirmation = await challengeMsg.awaitMessageComponent({ 
                filter: i => i.user.id === opponent.id, 
                time: 30000 
            });

            if (confirmation.customId === 'decline_match') {
                const declineEmbed = new EmbedBuilder()
                    .setTitle('🚨 Challenge Declined')
                    .setDescription(`${opponent} has declined the challenge.`)
                    .setColor(0x6B7280);
                return confirmation.update({ embeds: [declineEmbed], components: [] });
            }

            const startEmbed = new EmbedBuilder()
                .setTitle('⚔️ DUEL STARTING!')
                .setDescription('**Challenge Accepted!**\n\nPrepare yourselves... 🔥')
                .setColor(0xF59E0B);
            
            await confirmation.update({ embeds: [startEmbed], components: [] });
            await new Promise(resolve => setTimeout(resolve, 2000));

            const question = getRandomQuestion();
            const qEmbed = new EmbedBuilder()
                .setTitle('⚔️ DUEL QUESTION')
                .setDescription(
                    `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
                    `**${question.question}**\n\n` +
                    `━━━━━━━━━━━━━━━━━━━━━━━━━━━`
                )
                .addFields(
                    { name: '📚 Subject', value: `\`${question.subject}\``, inline: true },
                    { name: '📝 Chapter', value: `\`${question.chapter}\``, inline: true },
                    { name: '⏱️ Time', value: '\`30 seconds\`', inline: true }
                )
                .setColor(0xFF0000)
                .setFooter({ text: '⚡ First correct answer wins!' });

            const options = question.options.map((opt, i) => {
                const letters = ['A', 'B', 'C', 'D'];
                return new ButtonBuilder()
                    .setCustomId(`duel_${i}`)
                    .setLabel(`${letters[i]}. ${opt.length > 40 ? opt.substring(0, 37) + '...' : opt}`)
                    .setStyle(ButtonStyle.Secondary);
            });
            const qRow = new ActionRowBuilder().addComponents(options);

            const duelMsg = await interaction.followUp({ embeds: [qEmbed], components: [qRow] });

            const collector = duelMsg.createMessageComponentCollector({ 
                filter: i => [interaction.user.id, opponent.id].includes(i.user.id), 
                time: 30000 
            });

            let winner = null;
            let loser = null;

            collector.on('collect', async i => {
                const choice = parseInt(i.customId.split('_')[1]);
                if (choice === question.correctAnswer && !winner) {
                    winner = i.user;
                    loser = i.user.id === interaction.user.id ? opponent : interaction.user;
                    collector.stop();
                    await i.deferUpdate();
                } else {
                    await i.reply({ content: "❌ Wrong answer! You're out. 💔", ephemeral: true });
                }
            });

            collector.on('end', async () => {
                if (winner) {
                    const newTotal = addPoints(winner.id, 30);
                    
                    const winEmbed = new EmbedBuilder()
                        .setTitle('🏆 VICTORY!')
                        .setDescription(
                            `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
                            `🎉 **Winner:** ${winner}\n` +
                            `💔 **Defeated:** ${loser}\n\n` +
                            `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                            `✅ **Correct Answer:** ${question.options[question.correctAnswer]}\n` +
                            `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
                            `💰 **Reward:** +30 points\n` +
                            `🏆 **New Balance:** ${newTotal} points`
                        )
                        .setColor(0x10B981)
                        .setThumbnail('https://em-content.zobj.net/thumbs/160/twitter/348/trophy_1f3c6.png')
                        .setFooter({ text: 'Great job! Challenge more friends to earn more points!' });
                    
                    await interaction.followUp({ embeds: [winEmbed] });
                } else {
                    const drawEmbed = new EmbedBuilder()
                        .setTitle('⏱️ TIME\'S UP!')
                        .setDescription(
                            `**No one answered correctly!**\n\n` +
                            `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                            `✅ **Correct Answer:** ${question.options[question.correctAnswer]}\n` +
                            `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
                            `💡 **Hint:** ${question.hint || 'Study harder for next time!'}\n\n` +
                            `Better luck next time!`
                        )
                        .setColor(0xF59E0B)
                        .setThumbnail('https://em-content.zobj.net/thumbs/160/twitter/348/alarm-clock_23f0.png');
                    
                    await interaction.followUp({ embeds: [drawEmbed] });
                }
            });

        } catch (e) {
            const expiredEmbed = new EmbedBuilder()
                .setTitle('❌ Challenge Expired')
                .setDescription(`${opponent} didn't respond in time. The challenge has been cancelled.`)
                .setColor(0x6B7280);
            
            await interaction.editReply({ embeds: [expiredEmbed], components: [] });
        }
    },
};