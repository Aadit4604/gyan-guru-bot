const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { askQuestion } = require('../utils/ai');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ask')
        .setDescription('Ask the AI Study Assistant a question')
        .addStringOption(option => 
            option.setName('query')
            .setDescription('Your question')
            .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply();
        const query = interaction.options.getString('query');
        
        const answer = await askQuestion(query, interaction.user.id);
        
        const embed = new EmbedBuilder()
            .setTitle(`❓ Question: ${query}`)
            .setDescription(answer)
            .setColor(0x10B981)
            .setFooter({ text: 'Padh Lo AI Assistant' });

        await interaction.editReply({ embeds: [embed] });
    },
};