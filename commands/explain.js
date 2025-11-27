const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { explainTopic } = require('../utils/ai');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('explain')
        .setDescription('Get a clear explanation of any topic')
        .addStringOption(option => 
            option.setName('topic')
                .setDescription('The topic to explain')
                .setRequired(true)
                .setMaxLength(200)),
    async execute(interaction) {
        await interaction.deferReply();
        
        const topic = interaction.options.getString('topic').trim();
        
        // Validate input
        if (!topic || topic.length === 0) {
            return await interaction.editReply({
                content: '❌ Please provide a valid topic!',
                ephemeral: true
            });
        }

        // Show thinking indicator
        const thinkingEmbed = new EmbedBuilder()
            .setTitle('📚 Preparing explanation...')
            .setDescription(`Gathering information about: *${topic}*`)
            .setColor(0x3B82F6);
        
        await interaction.editReply({ embeds: [thinkingEmbed] });
        
        const explanation = await explainTopic(topic, interaction.user.id);
        
        // Split long responses into multiple embeds
        const MAX_DESC_LENGTH = 3500;
        const embeds = [];
        
        if (explanation.length <= MAX_DESC_LENGTH) {
            // Short response - single embed
            const embed = new EmbedBuilder()
                .setTitle(`📚 ${topic}`)
                .setDescription(explanation)
                .setColor(0x3B82F6)
                .setAuthor({ 
                    name: 'Gyan Guru Explainer',
                    iconURL: interaction.client.user.avatarURL()
                })
                .setFooter({ text: '📖 Ask another topic with /explain' });
            embeds.push(embed);
        } else {
            // Long response - split into multiple embeds
            let remaining = explanation;
            let partNumber = 1;
            
            while (remaining.length > 0 && partNumber <= 10) {
                const chunk = remaining.substring(0, MAX_DESC_LENGTH);
                const lastNewline = chunk.lastIndexOf('\n');
                const textToAdd = lastNewline > MAX_DESC_LENGTH * 0.7 ? chunk.substring(0, lastNewline) : chunk;
                
                const embed = new EmbedBuilder()
                    .setColor(0x3B82F6)
                    .setDescription(textToAdd)
                    .setFooter({ text: `Part ${partNumber}` });
                
                if (partNumber === 1) {
                    embed.setTitle(`📚 ${topic}`);
                    embed.setAuthor({ 
                        name: 'Gyan Guru Explainer',
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