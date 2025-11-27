const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { askQuestion } = require('../utils/ai');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ask')
        .setDescription('Ask the AI Study Assistant a question')
        .addStringOption(option => 
            option.setName('query')
                .setDescription('Your question')
                .setRequired(true)
                .setMaxLength(300)),
    async execute(interaction) {
        await interaction.deferReply();
        
        const query = interaction.options.getString('query').trim();
        
        // Validate input
        if (!query || query.length === 0) {
            return await interaction.editReply({
                content: '❌ Please ask a valid question!',
                ephemeral: true
            });
        }

        // Show typing indicator
        const thinkingEmbed = new EmbedBuilder()
            .setTitle('🤔 Thinking...')
            .setDescription(`Processing your question: *${query}*`)
            .setColor(0x3B82F6);
        
        await interaction.editReply({ embeds: [thinkingEmbed] });
        
        const answer = await askQuestion(query, interaction.user.id);
        
        // Split long responses into multiple embeds
        const MAX_DESC_LENGTH = 3500;
        const embeds = [];
        
        if (answer.length <= MAX_DESC_LENGTH) {
            // Short response - single embed
            const embed = new EmbedBuilder()
                .setTitle(`❓ Q: ${query.substring(0, 200)}`)
                .setDescription(answer)
                .setColor(0x10B981)
                .setAuthor({ 
                    name: 'Gyan Guru AI Assistant',
                    iconURL: interaction.client.user.avatarURL()
                })
                .setFooter({ text: '💡 Ask another question with /ask' });
            embeds.push(embed);
        } else {
            // Long response - split into multiple embeds
            let remaining = answer;
            let partNumber = 1;
            
            while (remaining.length > 0 && partNumber <= 10) {
                const chunk = remaining.substring(0, MAX_DESC_LENGTH);
                const lastNewline = chunk.lastIndexOf('\n');
                const textToAdd = lastNewline > MAX_DESC_LENGTH * 0.7 ? chunk.substring(0, lastNewline) : chunk;
                
                const embed = new EmbedBuilder()
                    .setColor(0x10B981)
                    .setDescription(textToAdd)
                    .setFooter({ text: `Part ${partNumber}` });
                
                if (partNumber === 1) {
                    embed.setTitle(`❓ Q: ${query.substring(0, 200)}`);
                    embed.setAuthor({ 
                        name: 'Gyan Guru AI Assistant',
                        iconURL: interaction.client.user.avatarURL()
                    });
                }
                
                embeds.push(embed);
                remaining = remaining.substring(textToAdd.length).trim();
                partNumber++;
            }
        }

        await interaction.editReply({ embeds });
    },
};