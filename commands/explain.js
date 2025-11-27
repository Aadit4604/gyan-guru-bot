const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { explainTopic } = require('../utils/ai');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('explain')
        .setDescription('Get a clear explanation of a topic')
        .addStringOption(option => 
            option.setName('topic')
            .setDescription('The topic to explain')
            .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply();
        const topic = interaction.options.getString('topic');
        
        const explanation = await explainTopic(topic, interaction.user.id);
        
        // Split long responses into multiple embeds
        // Discord embed size limit is 6000 total, but we'll use 3500 per embed to be safe
        const MAX_DESC_LENGTH = 3500;
        const embeds = [];
        
        if (explanation.length <= MAX_DESC_LENGTH) {
            // Short response - single embed
            const embed = new EmbedBuilder()
                .setTitle(`📚 Explanation: ${topic.substring(0, 256)}`)
                .setDescription(explanation)
                .setColor(0x3B82F6)
                .setFooter({ text: 'Powered by Padh Lo AI' });
            embeds.push(embed);
        } else {
            // Long response - split into multiple embeds
            let remaining = explanation;
            let partNumber = 1;
            
            while (remaining.length > 0) {
                const chunk = remaining.substring(0, MAX_DESC_LENGTH);
                const lastNewline = chunk.lastIndexOf('\n');
                const textToAdd = lastNewline > MAX_DESC_LENGTH * 0.7 ? chunk.substring(0, lastNewline) : chunk;
                
                const embed = new EmbedBuilder()
                    .setColor(0x3B82F6)
                    .setFooter({ text: `Powered by Padh Lo AI • Part ${partNumber}` });
                
                if (partNumber === 1) {
                    embed.setTitle(`📚 Explanation: ${topic.substring(0, 256)}`);
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