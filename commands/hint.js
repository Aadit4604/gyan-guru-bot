const { SlashCommandBuilder } = require('discord.js');
const { getQuestionById } = require('../utils/questionManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hint')
        .setDescription('Get a hint for the current practice question (-5 points penalty)'),
    async execute(interaction) {
        const activeQ = interaction.client.activeQuestions?.get?.(interaction.user.id);

        if (!activeQ) {
            return interaction.reply({ content: "You don't have an active question! Use /practice first.", ephemeral: true });
        }

        const question = getQuestionById(activeQ.questionId);
        activeQ.hintUsed = true; // Mark hint as used

        await interaction.reply({ content: `💡 **Hint:** ${question.hint}\n_(Reward reduced to 5 points)_`, ephemeral: true });
    },
};