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
            return interaction.reply({ content: "You can't challenge yourself!", ephemeral: true });
        }
        if (opponent.bot) {
            return interaction.reply({ content: "You can't challenge a bot!", ephemeral: true });
        }

        const acceptButton = new ButtonBuilder()
            .setCustomId('accept_match')
            .setLabel('Accept Challenge')
            .setStyle(ButtonStyle.Success);
            
        const row = new ActionRowBuilder().addComponents(acceptButton);

        const challengeMsg = await interaction.reply({ 
            content: `⚔️ **PVP MATCH!**\n${opponent}, you have been challenged by ${interaction.user} to a study duel!`, 
            components: [row],
            fetchReply: true 
        });

        try {
            const confirmation = await challengeMsg.awaitMessageComponent({ 
                filter: i => i.user.id === opponent.id && i.customId === 'accept_match', 
                time: 30000 
            });

            await confirmation.update({ content: `✅ Challenge Accepted! Starting match...`, components: [] });

            const question = getRandomQuestion();
            const qEmbed = new EmbedBuilder()
                .setTitle('⚔️ Duel Question')
                .setDescription(question.question)
                .setColor(0xFF0000);

            const options = question.options.map((opt, i) => 
                new ButtonBuilder().setCustomId(`duel_${i}`).setLabel(opt).setStyle(ButtonStyle.Secondary)
            );
            const qRow = new ActionRowBuilder().addComponents(options);

            const duelMsg = await interaction.followUp({ embeds: [qEmbed], components: [qRow] });

            const collector = duelMsg.createMessageComponentCollector({ 
                filter: i => [interaction.user.id, opponent.id].includes(i.user.id), 
                time: 30000 
            });

            let winner = null;

            collector.on('collect', async i => {
                const choice = parseInt(i.customId.split('_')[1]);
                if (choice === question.correctAnswer) {
                    winner = i.user;
                    collector.stop();
                    await i.deferUpdate();
                } else {
                    await i.reply({ content: "❌ Wrong answer! You are out.", ephemeral: true });
                }
            });

            collector.on('end', async () => {
                if (winner) {
                    addPoints(winner.id, 30);
                    await interaction.followUp(`🏆 **Winner:** ${winner}! (+30 Points)\nThe answer was: ${question.options[question.correctAnswer]}`);
                } else {
                    await interaction.followUp(`⏱️ Time's up! No one answered correctly.\nAnswer: ${question.options[question.correctAnswer]}`);
                }
            });

        } catch (e) {
            await interaction.editReply({ content: '❌ Challenge expired or declined.', components: [] });
        }
    },
};