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
        
        // Split long responses into multiple embeds
        // Discord embed size limit is 6000 total, but we'll use 3500 per embed to be safe
        const MAX_DESC_LENGTH = 3500;
        const embeds = [];
        
        if (answer.length <= MAX_DESC_LENGTH) {
            // Short response - single embed
            const embed = new EmbedBuilder()
                .setTitle(`❓ Question: ${query.substring(0, 256)}`)
                .setDescription(answer)
                .setColor(0x10B981)
                .setFooter({ text: 'Padh Lo AI Assistant' });
            embeds.push(embed);
        } else {
            // Long response - split into multiple embeds
            let remaining = answer;
            let partNumber = 1;
            
            while (remaining.length > 0) {
                const chunk = remaining.substring(0, MAX_DESC_LENGTH);
                const lastNewline = chunk.lastIndexOf('\n');
                const textToAdd = lastNewline > MAX_DESC_LENGTH * 0.7 ? chunk.substring(0, lastNewline) : chunk;
                
                const embed = new EmbedBuilder()
                    .setColor(0x10B981)
                    .setFooter({ text: `Padh Lo AI Assistant • Part ${partNumber}` });
                
                if (partNumber === 1) {
                    embed.setTitle(`❓ Question: ${query.substring(0, 256)}`);
                }
                
                embed.setDescription(textToAdd);
                embeds.push(embed);
                
                remaining = remaining.substring(textToAdd.length).trim();
                partNumber++;
                
                // Discord limit: max 10 embeds per message
                if (partNumber > 10) {
                    break;
                }
            }
        }

        await interaction.editReply({ embeds });
    },
};