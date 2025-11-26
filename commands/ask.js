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
        
        try {
            const answer = await askQuestion(query, interaction.user.id);
            
            // Truncate question if too long
            const displayQuery = query.length > 100 ? query.substring(0, 97) + '...' : query;
            
            const embed = new EmbedBuilder()
                .setAuthor({ 
                    name: `${interaction.user.username} asked:`,
                    iconURL: interaction.user.displayAvatarURL()
                })
                .setTitle(`❓ ${displayQuery}`)
                .setDescription(
                    `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                    `${answer}\n` +
                    `━━━━━━━━━━━━━━━━━━━━━━━━━━━`
                )
                .setColor(0x10B981)
                .setFooter({ text: '🤖 Powered by Google Gemini AI • Gyan Guru' })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            const errorEmbed = new EmbedBuilder()
                .setTitle('❌ Error')
                .setDescription('Sorry, I encountered an error processing your question. Please try again or rephrase your question.')
                .setColor(0xEF4444)
                .setFooter({ text: 'If this persists, contact an administrator' });
            
            await interaction.editReply({ embeds: [errorEmbed] });
        }
    },
};